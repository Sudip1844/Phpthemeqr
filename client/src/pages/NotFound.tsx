import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { getSEOByQRType, updatePageSEO } from "@/lib/seo-config";

const NotFound = () => {
  const location = useLocation();
  
  // Get SEO config for headings from notfound config
  const seoConfig = getSEOByQRType('notfound');
  const h1Text = seoConfig.headings?.h1 || "404 - Page Not Found";
  const h2List = seoConfig.headings?.h2 || [];

  useEffect(() => {
    updatePageSEO(seoConfig);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{h1Text}</h1>
        {/* SEO H2 headings - hidden but crawlable */}
        {h2List.map((h2: string, index: number) => (
          <h2 key={index} className="sr-only">{h2}</h2>
        ))}
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
