export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export const faqData: FAQItem[] = [
  {
    question: "What is a QR code and how does it work?",
    answer: "A QR code (Quick Response code) is a two-dimensional barcode that stores information in a grid pattern. When scanned with a camera or QR scanner app, it quickly directs users to websites, displays text, connects to WiFi, or performs other actions. QR codes work by encoding data in black and white squares that smartphones can read instantly.",
    category: "Basics"
  },
  {
    question: "Is your QR code generator really free?",
    answer: "Yes! Our QR code generator is completely free with no hidden charges. You can create unlimited QR codes for URLs, text, email, phone, SMS, WhatsApp, WiFi, contacts, events, and more. There are no watermarks, no registration required, and no time limits. All features are free for lifetime.",
    category: "Pricing"
  },
  {
    question: "How do I create a QR code online?",
    answer: "Creating a QR code is simple: 1) Select your QR code type (URL, text, WiFi, etc.), 2) Enter your information, 3) Customize colors and size if desired, 4) Click generate, and 5) Download your QR code. No app download or registration needed. It takes less than 30 seconds!",
    category: "Getting Started"
  },
  {
    question: "Can I scan QR codes online without downloading an app?",
    answer: "Yes! Use our online QR code scanner at myqrcodetool.com/scanner. You can scan QR codes using your webcam, upload an image with a QR code, or use your mobile camera. It works on all devices - desktop, mobile, and tablet - without any app download. Just allow camera access and point it at the QR code.",
    category: "Scanner"
  },
  {
    question: "How do I create a QR code for my WiFi network?",
    answer: "Select the WiFi QR code type, enter your network name (SSID), password, and security type (WPA/WEP). Generate the QR code and share it. When guests scan it, their device will automatically connect to your WiFi without manually typing the password. Perfect for homes, offices, and cafes.",
    category: "WiFi"
  },
  {
    question: "Can I add a logo to my QR code?",
    answer: "Yes! Our QR code generator supports custom logo embedding. You can upload your company logo, brand image, or any picture to place in the center of your QR code. The QR code will remain scannable even with the logo. You can adjust logo size between 15-25% of the QR code size.",
    category: "Customization"
  },
  {
    question: "What types of QR codes can I generate?",
    answer: "You can generate QR codes for: URLs/websites, plain text, email addresses, phone numbers, SMS messages, WhatsApp chats, WiFi credentials, vCard contacts, calendar events, images, PayPal payments, Zoom meetings, Skype calls, and more. Each type is optimized for its specific use case.",
    category: "Features"
  },
  {
    question: "How do I scan a QR code from an image or screenshot?",
    answer: "Upload the image to our online scanner at myqrcodetool.com/scanner. Click 'Upload Image' and select your screenshot or photo containing the QR code. Our scanner will automatically detect and decode the QR code from the image. This works with photos, screenshots, or downloaded QR code images.",
    category: "Scanner"
  },
  {
    question: "Are the QR codes generated on your site permanent?",
    answer: "Yes! Static QR codes generated on our site are permanent and will work forever. Since the data is encoded directly in the QR code itself (not stored on our servers), the codes will continue working even if our website goes down. There's no expiration date.",
    category: "Basics"
  },
  {
    question: "Can I edit or change a QR code after creating it?",
    answer: "Static QR codes cannot be edited after generation because the data is permanently encoded in the pattern. However, for URL QR codes, you can use a URL shortener that allows editing the destination, or regenerate a new QR code with updated information. Always test before printing.",
    category: "Editing"
  },
  {
    question: "What's the best size for printing QR codes?",
    answer: "For optimal scanning, QR codes should be at least 2 x 2 cm (0.8 x 0.8 inches) when printed. For business cards, use 2.5-3 cm. For posters or billboards, scale up proportionally - minimum 10 x 10 cm for viewing from 1 meter away. Always test scanning at the intended distance.",
    category: "Printing"
  },
  {
    question: "Do QR codes work without internet?",
    answer: "It depends on the content. The scanning process works offline, but accessing the content may need internet. Static data like text, phone numbers, WiFi passwords, and vCards work without internet. URLs, images, and online content require an internet connection to load after scanning.",
    category: "Technical"
  },
  {
    question: "How can I track QR code scans?",
    answer: "For scan tracking, use URL shortening services with analytics (like Bitly) in your URL QR codes, or use dynamic QR code services that offer analytics. Our free static QR codes don't track scans since no data is stored on servers, ensuring complete privacy.",
    category: "Analytics"
  },
  {
    question: "Can I create QR codes in bulk?",
    answer: "Currently, you can generate QR codes one at a time with full customization options. For bulk QR code generation with different data, you would need to create them individually. Each code can be quickly generated and downloaded in seconds with your custom settings.",
    category: "Bulk Generation"
  },
  {
    question: "What's the difference between static and dynamic QR codes?",
    answer: "Static QR codes have data permanently encoded and cannot be changed. They work forever without depending on any service. Dynamic QR codes use a redirect URL allowing you to change the destination, but require an active subscription service to keep working.",
    category: "Basics"
  },
  {
    question: "How do I create a vCard QR code for my business card?",
    answer: "Select vCard or Enhanced vCard from QR types. Enter your contact details: name, phone, email, company, address, website, etc. Generate and download. When scanned, it automatically adds your contact information to the user's phone contacts. Perfect for business cards and networking.",
    category: "vCard"
  },
  {
    question: "Can I customize QR code colors?",
    answer: "Yes! You can fully customize your QR code colors. Change the foreground (dark squares) and background colors to match your brand. Use our color picker or enter hex codes. Ensure good contrast (dark foreground, light background) for reliable scanning. Test before printing.",
    category: "Customization"
  },
  {
    question: "Are QR codes secure and safe to scan?",
    answer: "QR codes themselves are safe - they just encode data. However, they can link to malicious websites. Always check the destination before clicking links from scanned QR codes. Our generator creates safe codes with exactly what you input. When scanning unknown codes, preview the URL first.",
    category: "Security"
  },
  {
    question: "How do I create a QR code for a PDF file?",
    answer: "Upload your PDF to a cloud service (Google Drive, Dropbox, etc.) and get a shareable link. Create a URL QR code with that link. When scanned, users will be directed to view or download your PDF. Ensure the link has public access permissions.",
    category: "Files"
  },
  {
    question: "Can I use QR codes for WhatsApp?",
    answer: "Yes! Create a WhatsApp QR code by selecting WhatsApp type, entering your phone number with country code, and an optional pre-filled message. When scanned, it opens WhatsApp with your chat ready to start. Perfect for customer support, business inquiries, and quick contact.",
    category: "WhatsApp"
  },
  {
    question: "What's the maximum data capacity of a QR code?",
    answer: "QR codes can store up to 4,296 alphanumeric characters or 7,089 numeric characters. However, more data makes the QR code more complex with smaller squares, which can be harder to scan. For best results, keep content concise - URLs, short text, contact info work best.",
    category: "Technical"
  },
  {
    question: "Do QR codes expire?",
    answer: "Static QR codes generated on our site never expire. They work forever because the data is encoded directly in the QR code pattern. There's no server dependency, subscription, or time limit. Print them with confidence - they'll work years from now.",
    category: "Basics"
  },
  {
    question: "Can I scan QR codes with Google Lens?",
    answer: "Yes! Google Lens, available on Android and iOS, can scan QR codes. Open Google Lens, point your camera at the QR code, and it will automatically detect and decode it. You can also use your device's native camera app or our online scanner for quick scanning.",
    category: "Scanner"
  },
  {
    question: "How do I create an event/calendar QR code?",
    answer: "Select Event QR code type. Enter event title, date, time, location, and description. Generate the code. When scanned, it creates a calendar entry (ICS format) that users can save directly to their phone calendar. Perfect for invitations, meetings, and event promotions.",
    category: "Events"
  },
  {
    question: "Can I create QR codes for payments?",
    answer: "Yes! We support PayPal QR codes. Enter your PayPal email, amount, currency, and item description. When scanned, it directs users to PayPal payment page with pre-filled details. Great for invoices, donations, products, and services. Ensure your PayPal account is verified.",
    category: "Payments"
  },
  {
    question: "Is my data private and secure?",
    answer: "Yes! All QR code generation and scanning happens entirely in your browser using client-side JavaScript. Your QR code content, camera feed, and scanning results are processed locally on your device. We use industry-standard encryption (HTTPS) to protect your connection.",
    category: "Security"
  },
  {
    question: "Can I use My Qrcode Tool offline?",
    answer: "Yes! After the initial page load, My Qrcode Tool can work offline because it's a client-side application. Your browser caches the necessary files, allowing you to generate and customize QR codes without an internet connection. For scanning, camera access works offline too, though content like URLs will need internet to open.",
    category: "Technical"
  },
  {
    question: "Where is my QR code data stored?",
    answer: "Your QR code data is never stored anywhere except temporarily in your browser's memory while you're using the generator. When you download a QR code, it's created directly in your browser and saved to your device. We have no servers or databases, so your data is never uploaded, stored, or transmitted to us.",
    category: "Security"
  },
  {
    question: "How does the QR code scanner work?",
    answer: "Our QR scanner uses your device's camera or allows you to upload an image. It processes the QR code entirely in your browser using advanced JavaScript libraries. Simply grant camera permission, point at a QR code, and get instant results. The scanner works on desktop, mobile, and tablet devices.",
    category: "Scanner"
  },
  {
    question: "Why is my camera not working in the scanner?",
    answer: "If the camera isn't working: 1) Check if you granted camera permission in your browser, 2) Ensure no other app is using the camera, 3) Try refreshing the page, 4) Check if your browser supports camera access (HTTPS required). You can also upload an image of the QR code instead of using the camera.",
    category: "Scanner"
  },
  {
    question: "Can I scan multiple QR codes at once?",
    answer: "Currently, you can scan one QR code at a time for accurate results. After scanning one code, you can immediately scan another. For batch scanning from multiple images, you can upload images one by one to our scanner, and each will be decoded instantly.",
    category: "Scanner"
  }
];

export const faqCategories = Array.from(new Set(faqData.map(item => item.category).filter(Boolean))) as string[];
