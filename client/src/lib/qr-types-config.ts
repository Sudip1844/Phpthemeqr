export interface QRTypeConfig {
  name: string;
  href: string;
  testId: string;
}

export const allQRTypes: QRTypeConfig[] = [
  { name: "URL QR Code", href: "/url-to-qr", testId: "link-url-qr" },
  { name: "Email QR Code", href: "/email-to-qr", testId: "link-email-qr" },
  { name: "Text QR Code", href: "/text-to-qr", testId: "link-text-qr" },
  { name: "Phone QR Code", href: "/phone-to-qr", testId: "link-phone-qr" },
  { name: "SMS QR Code", href: "/sms-to-qr", testId: "link-sms-qr" },
  { name: "WhatsApp QR Code", href: "/whatsapp-to-qr", testId: "link-whatsapp-qr" },
  { name: "WiFi QR Code", href: "/wifi-to-qr", testId: "link-wifi-qr" },
  { name: "Contact QR Code", href: "/contact-to-qr", testId: "link-contact-qr" },
  { name: "vCard QR Code", href: "/v-card-to-qr", testId: "link-vcard-qr" },
  { name: "Event QR Code", href: "/event-to-qr", testId: "link-event-qr" },
  { name: "Image QR Code", href: "/image-to-qr", testId: "link-image-qr" },
  { name: "PayPal QR Code", href: "/paypal-to-qr", testId: "link-paypal-qr" },
  { name: "Zoom QR Code", href: "/zoom-to-qr", testId: "link-zoom-qr" },
];

export function getRandomQRTypes(count: number = 4): QRTypeConfig[] {
  const shuffled = [...allQRTypes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
