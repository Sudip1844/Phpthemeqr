import { Link } from "react-router-dom";
import { QrCode, Scan, Download, HelpCircle, Shield, LifeBuoy, Wifi, Mail, Phone, Link as LinkIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  interface FooterLink {
    name: string;
    href: string;
    icon?: any;
    testId: string;
    external?: boolean;
    scrollTo?: string;
  }

  interface FooterSection {
    title: string;
    links: FooterLink[];
  }

  const footerLinks: FooterSection[] = [
    {
      title: "Tools",
      links: [
        { name: "QR Generator", href: "/", icon: QrCode, testId: "link-generator", scrollTo: "generator" },
        { name: "QR Scanner", href: "/scanner", icon: Scan, testId: "link-scanner" },
        { name: "Download App", href: "/download", icon: Download, testId: "link-download" },
      ]
    },
    {
      title: "Support",
      links: [
        { name: "FAQ", href: "/faq", icon: HelpCircle, testId: "link-faq" },
        { name: "Privacy Policy", href: "/privacy", icon: Shield, testId: "link-privacy" },
        { name: "Contact Us", href: "/support", icon: LifeBuoy, testId: "link-support" },
      ]
    },
    {
      title: "Popular QR Types",
      links: [
        { name: "URL QR Code", href: "/url-to-qr", icon: LinkIcon, testId: "link-qr-url", scrollTo: "generator" },
        { name: "WiFi QR Code", href: "/wifi-to-qr", icon: Wifi, testId: "link-qr-wifi", scrollTo: "generator" },
        { name: "Email QR Code", href: "/email-to-qr", icon: Mail, testId: "link-qr-email", scrollTo: "generator" },
        { name: "Phone QR Code", href: "/phone-to-qr", icon: Phone, testId: "link-qr-phone", scrollTo: "generator" },
      ]
    }
  ];

  return (
    <footer role="contentinfo" className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <QrCode className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">My Qrcode Tool</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Free QR code generator and scanner. Create professional QR codes for URLs, WiFi, contacts, events, and more. Fast, secure, and easy to use.
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Free Forever</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">No Registration</span>
            </div>
          </div>

          {footerLinks.map((section, index) => (
            <nav key={index} className="space-y-4" aria-label={`${section.title} links`}>
              <h3 className="font-semibold text-sm uppercase tracking-wider">{section.title}</h3>
              <ul className="space-y-3" role="list">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                        data-testid={link.testId}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.icon && <link.icon className="w-4 h-4" />}
                        {link.name}
                      </a>
                    ) : (
                      <Link 
                        to={link.href}
                        state={link.scrollTo ? { scrollTo: link.scrollTo } : undefined}
                        data-testid={link.testId}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        {link.icon && <link.icon className="w-4 h-4" />}
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} My Qrcode Tool. All rights reserved.</p>
          <div className="flex gap-4">
            <Link 
              to="/privacy" 
              data-testid="link-privacy-bottom"
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Privacy
            </Link>
            <Link 
              to="/faq" 
              data-testid="link-faq-bottom"
              className="hover:text-primary transition-colors cursor-pointer"
            >
              FAQ
            </Link>
            <Link 
              to="/support" 
              data-testid="link-support-bottom"
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            QR Code Generator • QR Code Scanner • Free QR Codes • WiFi QR Generator • vCard QR Code • URL to QR • Text to QR
          </p>
        </div>
      </div>
    </footer>
  );
}
