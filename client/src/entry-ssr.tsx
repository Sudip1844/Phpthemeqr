import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SEOProvider } from "@/contexts/SEOContext";
import Index from "./pages/Index";
import Scanner from "./pages/Scanner";
import Download from "./pages/Download";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import Support from "./pages/Support";

interface RenderOptions {
  url: string;
  qrType?: string;
}

export function render({ url, qrType }: RenderOptions): string {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Disable queries during SSR
        enabled: false,
      },
    },
  });

  // Determine which component to render based on URL
  let PageComponent = Index;
  let pageProps: any = {};

  if (url.includes('/scanner')) {
    PageComponent = Scanner;
  } else if (url.includes('/download')) {
    PageComponent = Download;
  } else if (url.includes('/faq')) {
    PageComponent = FAQ;
  } else if (url.includes('/privacy')) {
    PageComponent = Privacy;
  } else if (url.includes('/support')) {
    PageComponent = Support;
  } else if (qrType) {
    PageComponent = Index;
    pageProps = { qrType };
  }

  const html = renderToString(
    <QueryClientProvider client={queryClient}>
      <SEOProvider>
        <TooltipProvider>
          <StaticRouter location={url}>
            <PageComponent {...pageProps} />
          </StaticRouter>
        </TooltipProvider>
      </SEOProvider>
    </QueryClientProvider>
  );

  return html;
}
