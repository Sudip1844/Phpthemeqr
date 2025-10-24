import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SEOProvider } from "@/contexts/SEOContext";
import { lazy, Suspense } from "react";
import { PageSkeleton } from "@/components/PageLoadingSkeleton";

const Index = lazy(() => import("./pages/Index"));
const Scanner = lazy(() => import("./pages/Scanner"));
const Download = lazy(() => import("./pages/Download"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Support = lazy(() => import("./pages/Support"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SEOProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageSkeleton />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/url-to-qr" element={<Index qrType="url" />} />
              <Route path="/email-to-qr" element={<Index qrType="email" />} />
              <Route path="/text-to-qr" element={<Index qrType="text" />} />
              <Route path="/phone-to-qr" element={<Index qrType="phone" />} />
              <Route path="/sms-to-qr" element={<Index qrType="sms" />} />
              <Route path="/whatsapp-to-qr" element={<Index qrType="whatsapp" />} />
              <Route path="/wifi-to-qr" element={<Index qrType="wifi" />} />
              <Route path="/contact-to-qr" element={<Index qrType="vcard" />} />
              <Route path="/v-card-to-qr" element={<Index qrType="enhanced-vcard" />} />
              <Route path="/event-to-qr" element={<Index qrType="event" />} />
              <Route path="/image-to-qr" element={<Index qrType="image" />} />
              <Route path="/paypal-to-qr" element={<Index qrType="paypal" />} />
              <Route path="/zoom-to-qr" element={<Index qrType="zoom" />} />
              <Route path="/download" element={<Download />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/support" element={<Support />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </SEOProvider>
  </QueryClientProvider>
);

export default App;
