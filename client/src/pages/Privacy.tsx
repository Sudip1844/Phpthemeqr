import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSEOByQRType, updatePageSEO } from "@/lib/seo-config";
import StructuredData from "@/components/StructuredData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButton from "@/components/ShareButton";

export default function Privacy() {
  // Get SEO config for headings
  const seoConfig = getSEOByQRType('privacy');
  const h1Text = seoConfig.headings?.h1 || "Privacy Policy";
  const h2List = seoConfig.headings?.h2 || [];

  useEffect(() => {
    updatePageSEO(seoConfig);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <StructuredData pageType="privacy" />
      <Header stickyHeaderEnabled={false} pageType="privacy" />
      <div className="container max-w-4xl mx-auto px-4 py-12">

        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4" data-testid="text-privacy-title">{h1Text}</h1>
          {/* SEO H2 headings - hidden but crawlable */}
          {h2List.map((h2: string, index: number) => (
            <h2 key={index} className="sr-only">{h2}</h2>
          ))}
          <p className="text-muted-foreground text-lg" data-testid="text-privacy-subtitle">
            Your privacy is completely protected. Learn about our privacy-first approach.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: October 2, 2025
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Welcome to My Qrcode Tool. We believe in complete privacy and transparency. This Privacy Policy explains how our QR code generator and scanner services work entirely in your browser without collecting any personal information.
              </p>
              <p className="font-semibold text-foreground">
                Key Point: My Qrcode Tool is a 100% client-side static website. We do not have any servers, databases, or backend systems that collect, store, or process your data.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Information We Do NOT Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="font-semibold text-foreground mb-3">
                We want to be crystal clear: We do NOT collect ANY of the following:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>No Account Required:</strong> We don't collect names, emails, or require user registration</li>
                <li><strong>No QR Code Content:</strong> Your QR code data never leaves your browser</li>
                <li><strong>No Camera Storage:</strong> Camera feed for scanning is processed in real-time and never stored</li>
                <li><strong>No File Storage:</strong> Uploaded images for scanning are processed locally and not stored</li>
              </ul>
              <p className="mt-4 font-semibold text-foreground">
                All QR code generation and scanning happens entirely in your browser using client-side JavaScript.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                How My Qrcode Tool Works (100% Client-Side)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">QR Code Generation</h3>
                <p>
                  All QR code generation happens entirely in your web browser using JavaScript. When you create a QR code:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Your data stays in your browser's memory</li>
                  <li>The QR code is generated using client-side libraries</li>
                  <li>Nothing is sent to any server</li>
                  <li>Downloaded QR codes are created directly in your browser</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">QR Code Scanning</h3>
                <p>
                  QR code scanning also runs completely in your browser:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Camera access is requested by your browser, not our servers</li>
                  <li>Images are processed locally using JavaScript</li>
                  <li>Scanned data never leaves your device</li>
                  <li>No images or video are stored or transmitted anywhere</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                Camera Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                When you use the QR scanner feature, your browser will ask for camera permission. This is a standard browser security feature:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Camera access is controlled entirely by your browser</li>
                <li>We only access the camera stream for real-time QR code detection</li>
                <li>No photos, videos, or camera data are saved or transmitted</li>
                <li>You can revoke camera permission at any time in your browser settings</li>
                <li>Camera access ends immediately when you close the scanner</li>
              </ul>
              <p className="mt-4">
                The camera processing happens entirely in your browser using the html5-qrcode library, which is open-source and privacy-respecting.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>External Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                My Qrcode Tool loads the following external resources for functionality and performance:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Open-source JavaScript libraries for QR code generation and scanning (loaded from CDN for performance)</li>
                <li>Fonts and icons for visual design</li>
              </ul>
              <p className="mt-4">
                These resources are standard web assets necessary for the application to function properly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Local Storage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may use your browser's local storage to save your preferences (like theme settings or recent QR type selections). This data:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Stays only on your device</li>
                <li>Is never sent to any server</li>
                <li>Can be cleared at any time through your browser settings</li>
                <li>Contains no personal or identifying information</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Since we don't collect any data, there's no data to secure on our end. However, we still maintain security best practices:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>The website is served over HTTPS for encrypted connections</li>
                <li>All code runs in your browser's secure sandbox environment</li>
                <li>We use well-tested, open-source libraries for QR functionality</li>
                <li>No user data ever leaves your device</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Our service is safe for all ages because we don't collect any personal information from anyone, including children. There is no age restriction for using My Qrcode Tool.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights and Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Since we don't collect any data about you, there's no data to access, modify, or delete. You have complete control because everything happens on your device:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>You can use My Qrcode Tool without creating an account</li>
                <li>You can clear your browser's local storage to remove any preferences</li>
                <li>You can use My Qrcode Tool offline (after the initial page load)</li>
                <li>You can inspect our source code to verify our privacy claims</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. Any changes will be posted on this page with an updated "Last updated" date.
              </p>
              <p>
                However, our core commitment to privacy will never change: My Qrcode Tool will always be a client-side application that doesn't collect your personal data.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you have any questions about this Privacy Policy or how My Qrcode Tool works, please feel free to reach out through our contact form:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <Link to="/support" className="text-primary hover:underline cursor-pointer font-semibold" data-testid="link-contact-us">
                  → Contact Us
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-12" />

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            By using My Qrcode Tool, you acknowledge that you have read and understood this Privacy Policy.
          </p>
          <p className="text-sm font-semibold text-primary">
            🔒 100% Private • 🚫 No Tracking • ✨ Client-Side Only
          </p>
        </div>
      </div>
      
      <ShareButton pageType="generator" />
      
      <Footer />
    </div>
  );
}
