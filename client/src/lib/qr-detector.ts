export type QRCodeType = 'url' | 'event' | 'paypal' | 'zoom' | 'email' | 'phone' | 'sms' | 'whatsapp' | 'wifi' | 'vcard' | 'enhanced-vcard' | 'image' | 'text';

export interface ParsedField {
  label: string;
  value: string;
  isAction?: boolean;
}

export interface QRCodeInfo {
  type: QRCodeType;
  data: string;
  actionUrl?: string;
  actionText?: string;
  displayText?: string;
  parsedFields?: ParsedField[];
}

function unescapeVCard(value: string): string {
  return value
    .replace(/\\n/g, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\:/g, ':')
    .replace(/\\\\/g, '\\');
}

function parseVCard(vcardData: string): ParsedField[] {
  const lines = vcardData.split('\n').map(line => line.trim());
  const fields: ParsedField[] = [];
  
  for (const line of lines) {
    // Name
    const fnMatch = line.match(/^FN(?:;[^:]*)?:(.*)$/);
    if (fnMatch) {
      fields.push({ label: 'Name', value: unescapeVCard(fnMatch[1]) });
      continue;
    }
    
    // Title/Prefix (Mr./Ms./Dr.)
    const prefixMatch = line.match(/^X-TITLE(?:;[^:]*)?:(.*)$/i);
    if (prefixMatch) {
      fields.push({ label: 'Title', value: unescapeVCard(prefixMatch[1]) });
      continue;
    }
    
    // Phone numbers with type detection
    const telMatch = line.match(/^TEL(?:;([^:]*?))?:(.*)$/);
    if (telMatch) {
      const typeStr = telMatch[1] || '';
      const phoneValue = unescapeVCard(telMatch[2]);
      let phoneLabel = 'Phone';
      
      if (typeStr.toUpperCase().includes('HOME')) {
        phoneLabel = 'Phone (Home)';
      } else if (typeStr.toUpperCase().includes('CELL') || typeStr.toUpperCase().includes('MOBILE')) {
        phoneLabel = 'Phone (Mobile)';
      } else if (typeStr.toUpperCase().includes('WORK') || typeStr.toUpperCase().includes('OFFICE')) {
        phoneLabel = 'Phone (Office)';
      } else if (typeStr.toUpperCase().includes('FAX')) {
        phoneLabel = 'Fax';
      }
      
      fields.push({ label: phoneLabel, value: phoneValue, isAction: true });
      continue;
    }
    
    // Email
    const emailMatch = line.match(/^EMAIL(?:;[^:]*)?:(.*)$/);
    if (emailMatch) {
      fields.push({ label: 'Email', value: unescapeVCard(emailMatch[1]), isAction: true });
      continue;
    }
    
    // Organization/Company
    const orgMatch = line.match(/^ORG(?:;[^:]*)?:(.*)$/);
    if (orgMatch) {
      fields.push({ label: 'Company', value: unescapeVCard(orgMatch[1]) });
      continue;
    }

    // Job Title
    const titleMatch = line.match(/^TITLE(?:;[^:]*)?:(.*)$/);
    if (titleMatch) {
      fields.push({ label: 'Job Title', value: unescapeVCard(titleMatch[1]) });
      continue;
    }

    // Website
    const urlMatch = line.match(/^URL(?:;[^:]*)?:(.*)$/);
    if (urlMatch) {
      fields.push({ label: 'Website', value: unescapeVCard(urlMatch[1]), isAction: true });
      continue;
    }

    // Address - parse components
    const adrMatch = line.match(/^ADR(?:;[^:]*)?:(.*)$/);
    if (adrMatch) {
      const adrParts = unescapeVCard(adrMatch[1]).split(';');
      // ADR format: ;;street;city;state;postalcode;country
      const street = adrParts[2] || '';
      const city = adrParts[3] || '';
      const state = adrParts[4] || '';
      const postalCode = adrParts[5] || '';
      const country = adrParts[6] || '';
      
      if (street) fields.push({ label: 'Address', value: street });
      if (city) fields.push({ label: 'City', value: city });
      if (state) fields.push({ label: 'State', value: state });
      if (postalCode) fields.push({ label: 'Postal Code', value: postalCode });
      if (country) fields.push({ label: 'Country', value: country });
      continue;
    }
  }
  
  return fields;
}

function parseWiFi(wifiData: string): ParsedField[] {
  const lowerData = wifiData.toLowerCase();
  if (!lowerData.startsWith('wifi:')) {
    return [{ label: 'Data', value: wifiData }];
  }
  
  const fields: ParsedField[] = [];
  const content = wifiData.substring(wifiData.indexOf(':') + 1);
  
  const parts: string[] = [];
  let current = '';
  let i = 0;
  
  while (i < content.length) {
    const char = content[i];
    
    if (char === '\\' && i + 1 < content.length) {
      current += content[i + 1];
      i += 2;
    } else if (char === ';') {
      if (current) parts.push(current);
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  if (current) parts.push(current);
  
  let ssid = '';
  let security = '';
  let password = '';
  let hidden = false;
  
  for (const part of parts) {
    if (part.startsWith('S:')) {
      ssid = part.substring(2);
    } else if (part.startsWith('T:')) {
      security = part.substring(2);
    } else if (part.startsWith('P:')) {
      password = part.substring(2);
    } else if (part.startsWith('H:')) {
      const val = part.substring(2).toLowerCase();
      hidden = val === 'true' || val === '1';
    }
  }
  
  if (ssid) fields.push({ label: 'Network Name (SSID)', value: ssid });
  if (security) fields.push({ label: 'Security Type', value: security });
  if (password) fields.push({ label: 'Password', value: password });
  if (hidden) fields.push({ label: 'Hidden Network', value: 'Yes' });
  
  return fields;
}

function parseEmail(emailData: string): ParsedField[] {
  const fields: ParsedField[] = [];
  const lowerData = emailData.toLowerCase();
  
  if (lowerData.startsWith('mailto:')) {
    try {
      const url = new URL(emailData);
      const email = url.pathname;
      const subject = url.searchParams.get('subject');
      const body = url.searchParams.get('body');
      
      if (email) fields.push({ label: 'Email', value: email, isAction: true });
      if (subject) fields.push({ label: 'Subject', value: subject });
      if (body) fields.push({ label: 'Body', value: body });
    } catch {
      fields.push({ label: 'Email', value: emailData, isAction: true });
    }
  } else {
    fields.push({ label: 'Email', value: emailData, isAction: true });
  }
  
  return fields;
}

function parseSMS(smsData: string): ParsedField[] {
  const fields: ParsedField[] = [];
  const lowerData = smsData.toLowerCase();
  
  // Check for query-string format first (sms:number?body=message)
  if ((lowerData.startsWith('sms:') || lowerData.startsWith('smsto:')) && smsData.includes('?')) {
    try {
      const schemeEnd = smsData.indexOf(':') + 1;
      const url = new URL(smsData.substring(0, schemeEnd) + '//' + smsData.substring(schemeEnd));
      // Phone is in the hostname for query-string format
      const phone = url.hostname || url.pathname.replace(/^\/+/, '');
      const body = url.searchParams.get('body');
      
      if (phone) fields.push({ label: 'Phone Number', value: phone, isAction: true });
      if (body) fields.push({ label: 'Message', value: body });
      return fields;
    } catch (e) {
      // Fall through to colon-split format
    }
  }
  
  // Handle SMSTO:number:message format
  if (lowerData.startsWith('smsto:') || lowerData.startsWith('sms:')) {
    const withoutScheme = smsData.substring(smsData.indexOf(':') + 1);
    const colonIndex = withoutScheme.indexOf(':');
    const phone = colonIndex !== -1 ? withoutScheme.substring(0, colonIndex) : withoutScheme;
    const message = colonIndex !== -1 ? withoutScheme.substring(colonIndex + 1) : '';
    
    if (phone) fields.push({ label: 'Phone Number', value: phone, isAction: true });
    if (message) {
      try {
        fields.push({ label: 'Message', value: decodeURIComponent(message) });
      } catch {
        fields.push({ label: 'Message', value: message });
      }
    }
  } else {
    fields.push({ label: 'Data', value: smsData });
  }
  
  return fields;
}

function parseWhatsApp(whatsappData: string): ParsedField[] {
  const fields: ParsedField[] = [];
  const lowerData = whatsappData.toLowerCase();
  
  if (lowerData.includes('wa.me/') || lowerData.includes('api.whatsapp.com/send')) {
    try {
      const url = new URL(whatsappData);
      const phone = url.pathname.split('/').pop() || url.searchParams.get('phone') || '';
      const text = url.searchParams.get('text');
      
      if (phone) fields.push({ label: 'WhatsApp Number', value: phone, isAction: true });
      if (text) fields.push({ label: 'Message', value: text });
    } catch {
      fields.push({ label: 'Data', value: whatsappData });
    }
  } else {
    fields.push({ label: 'Data', value: whatsappData });
  }
  
  return fields;
}

function parseEvent(eventData: string): ParsedField[] {
  const fields: ParsedField[] = [];
  const lowerData = eventData.toLowerCase();
  
  if (lowerData.includes('google.com/calendar/render')) {
    try {
      const url = new URL(eventData);
      const text = url.searchParams.get('text');
      const dates = url.searchParams.get('dates');
      const details = url.searchParams.get('details');
      const location = url.searchParams.get('location');
      
      if (text) fields.push({ label: 'Event Title', value: text });
      if (location) fields.push({ label: 'Location', value: location });
      if (details) fields.push({ label: 'Description', value: details });
      if (dates) {
        const [start, end] = dates.split('/');
        if (start) fields.push({ label: 'Start Time', value: formatEventDate(start) });
        if (end) fields.push({ label: 'End Time', value: formatEventDate(end) });
      }
    } catch {
      fields.push({ label: 'Event Link', value: eventData, isAction: true });
    }
  } else {
    fields.push({ label: 'Event Link', value: eventData, isAction: true });
  }
  
  return fields;
}

function formatEventDate(dateStr: string): string {
  if (!dateStr) return '';
  
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const hour = dateStr.substring(9, 11);
  const minute = dateStr.substring(11, 13);
  
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function parseICalendar(icalData: string): ParsedField[] {
  const fields: ParsedField[] = [];
  const lines = icalData.split(/\r?\n/).map(line => line.trim());
  
  for (const line of lines) {
    const summaryMatch = line.match(/^SUMMARY:(.*)$/i);
    if (summaryMatch) {
      fields.push({ label: 'Event Title', value: summaryMatch[1] });
      continue;
    }
    
    const locationMatch = line.match(/^LOCATION:(.*)$/i);
    if (locationMatch) {
      fields.push({ label: 'Location', value: locationMatch[1] });
      continue;
    }
    
    const descriptionMatch = line.match(/^DESCRIPTION:(.*)$/i);
    if (descriptionMatch) {
      fields.push({ label: 'Description', value: descriptionMatch[1].replace(/\\n/g, '\n') });
      continue;
    }
    
    const dtstartMatch = line.match(/^DTSTART[;:](.*)$/i);
    if (dtstartMatch) {
      const dateValue = dtstartMatch[1].split(':').pop() || dtstartMatch[1];
      fields.push({ label: 'Start Time', value: formatICalDate(dateValue) });
      continue;
    }
    
    const dtendMatch = line.match(/^DTEND[;:](.*)$/i);
    if (dtendMatch) {
      const dateValue = dtendMatch[1].split(':').pop() || dtendMatch[1];
      fields.push({ label: 'End Time', value: formatICalDate(dateValue) });
      continue;
    }
  }
  
  return fields;
}

function formatICalDate(dateStr: string): string {
  if (!dateStr) return '';
  
  dateStr = dateStr.replace(/[TZ\-:]/g, '');
  
  if (dateStr.length >= 8) {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.length >= 12 ? dateStr.substring(8, 10) : '00';
    const minute = dateStr.length >= 12 ? dateStr.substring(10, 12) : '00';
    
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
  
  return dateStr;
}

function parseZoom(zoomData: string): ParsedField[] {
  const fields: ParsedField[] = [];
  const lowerData = zoomData.toLowerCase();
  
  if (lowerData.includes('zoom.us/j/')) {
    const meetingIdMatch = zoomData.match(/\/j\/(\d+)/i);
    const pwdMatch = zoomData.match(/[?&]pwd=([^&]+)/i);
    
    if (meetingIdMatch) fields.push({ label: 'Meeting ID', value: meetingIdMatch[1] });
    if (pwdMatch) fields.push({ label: 'Password', value: pwdMatch[1] });
  }
  
  return fields;
}

function parseGoogleMeet(meetData: string): ParsedField[] {
  const fields: ParsedField[] = [];
  const lowerData = meetData.toLowerCase();
  
  if (lowerData.includes('meet.google.com/')) {
    const meetingCodeMatch = meetData.match(/meet\.google\.com\/([a-z\-]+)/i);
    const pwdMatch = meetData.match(/[?&]pwd=([^&]+)/i);
    
    if (meetingCodeMatch) fields.push({ label: 'Meeting Code', value: meetingCodeMatch[1] });
    if (pwdMatch) fields.push({ label: 'Password', value: pwdMatch[1] });
  }
  
  return fields;
}

function parsePayPal(paypalData: string): ParsedField[] {
  const fields: ParsedField[] = [];
  const lowerData = paypalData.toLowerCase();
  
  if (lowerData.includes('paypal.com')) {
    try {
      const url = new URL(paypalData);
      const email = url.searchParams.get('business') || url.searchParams.get('receiver');
      const item = url.searchParams.get('item_name');
      const amount = url.searchParams.get('amount');
      const currency = url.searchParams.get('currency_code');
      
      if (email) fields.push({ label: 'PayPal Email', value: email });
      if (item) fields.push({ label: 'Item Name', value: item });
      if (amount) fields.push({ label: 'Amount', value: `${amount}${currency ? ' ' + currency : ''}` });
    } catch {
      fields.push({ label: 'PayPal Link', value: paypalData });
    }
  }
  
  return fields;
}

export function detectQRCodeType(data: string): QRCodeInfo {
  const trimmedData = data.trim();
  const lowerData = trimmedData.toLowerCase();
  
  // SMS detection (case-insensitive)
  if (lowerData.startsWith('smsto:') || lowerData.startsWith('sms:')) {
    const fields = parseSMS(trimmedData);
    const phone = fields.find(f => f.label === 'Phone Number')?.value || '';
    return {
      type: 'sms',
      data: trimmedData,
      actionUrl: trimmedData,
      actionText: 'Send SMS',
      parsedFields: fields
    };
  }

  // WhatsApp detection (case-insensitive)
  if (lowerData.includes('wa.me/') || lowerData.includes('api.whatsapp.com/send')) {
    const fields = parseWhatsApp(trimmedData);
    return {
      type: 'whatsapp',
      data: trimmedData,
      actionUrl: trimmedData,
      actionText: 'Open WhatsApp',
      parsedFields: fields
    };
  }
  
  // Event detection (case-insensitive)
  if (lowerData.includes('google.com/calendar/render')) {
    const fields = parseEvent(trimmedData);
    return {
      type: 'event',
      data: trimmedData,
      actionUrl: trimmedData,
      actionText: 'Add to Calendar',
      parsedFields: fields
    };
  }
  
  // PayPal detection (case-insensitive)
  if (lowerData.includes('paypal.com')) {
    const fields = parsePayPal(trimmedData);
    return {
      type: 'paypal',
      data: trimmedData,
      actionUrl: trimmedData,
      actionText: 'Open PayPal',
      parsedFields: fields
    };
  }
  
  // Google Meet detection (case-insensitive)
  if (lowerData.includes('meet.google.com/')) {
    const fields = parseGoogleMeet(trimmedData);
    return {
      type: 'url',
      data: trimmedData,
      actionUrl: trimmedData,
      actionText: 'Join Google Meet',
      parsedFields: fields
    };
  }
  
  // Zoom detection (case-insensitive)
  if (lowerData.includes('zoom.us/j/')) {
    const fields = parseZoom(trimmedData);
    return {
      type: 'zoom',
      data: trimmedData,
      actionUrl: trimmedData,
      actionText: 'Join Zoom Meeting',
      parsedFields: fields
    };
  }
  
  // Email detection (case-insensitive)
  if (lowerData.startsWith('mailto:')) {
    const fields = parseEmail(trimmedData);
    return {
      type: 'email',
      data: trimmedData,
      actionUrl: trimmedData,
      actionText: 'Send Email',
      parsedFields: fields
    };
  }
  
  // Phone detection (case-insensitive)
  if (lowerData.startsWith('tel:')) {
    const phone = trimmedData.replace(/^tel:/i, '');
    return {
      type: 'phone',
      data: trimmedData,
      actionUrl: trimmedData,
      actionText: 'Call',
      parsedFields: [{ label: 'Phone Number', value: phone, isAction: true }]
    };
  }
  
  // WiFi detection (case-insensitive)
  if (lowerData.startsWith('wifi:')) {
    const fields = parseWiFi(trimmedData);
    return {
      type: 'wifi',
      data: trimmedData,
      parsedFields: fields
    };
  }
  
  // iCalendar detection (case-insensitive) - check for both base64 and plain text formats
  if (lowerData.startsWith('begin:vcalendar') || lowerData.startsWith('data:text/calendar')) {
    let icalContent = trimmedData;
    
    if (lowerData.startsWith('data:text/calendar')) {
      try {
        const base64Match = trimmedData.match(/data:text\/calendar[^,]*;base64,(.+)/i);
        if (base64Match) {
          icalContent = atob(base64Match[1]);
        }
      } catch (e) {
        console.error('Failed to decode base64 calendar data:', e);
      }
    }
    
    const fields = parseICalendar(icalContent);
    return {
      type: 'event',
      data: icalContent,
      parsedFields: fields
    };
  }
  
  // vCard detection (case-insensitive)
  if (lowerData.startsWith('begin:vcard')) {
    const fields = parseVCard(trimmedData);
    const isEnhanced = lowerData.includes('version:3.0') || lowerData.includes('version:4.0');
    return {
      type: isEnhanced ? 'enhanced-vcard' : 'vcard',
      data: trimmedData,
      parsedFields: fields
    };
  }

  // Image URL detection
  if ((trimmedData.startsWith('http://') || trimmedData.startsWith('https://')) && 
      (trimmedData.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i))) {
    return {
      type: 'image',
      data: trimmedData,
      actionUrl: trimmedData,
      actionText: 'View Image',
      parsedFields: [{ label: 'Image URL', value: trimmedData, isAction: true }]
    };
  }
  
  // URL detection
  if (trimmedData.startsWith('http://') || trimmedData.startsWith('https://')) {
    return {
      type: 'url',
      data: trimmedData,
      actionUrl: trimmedData,
      actionText: 'Open Link',
      parsedFields: [{ label: 'URL', value: trimmedData, isAction: true }]
    };
  }
  
  // Default text
  return {
    type: 'text',
    data: trimmedData,
    parsedFields: [{ label: 'Text', value: trimmedData }]
  };
}
