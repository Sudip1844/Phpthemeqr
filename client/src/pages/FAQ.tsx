import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HelpCircle, Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getSEOByQRType, updatePageSEO } from "@/lib/seo-config";
import { faqData, faqCategories } from "@/lib/faq";
import StructuredData from "@/components/StructuredData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButton from "@/components/ShareButton";

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get SEO config for headings
  const seoConfig = getSEOByQRType('faq');
  const h1Text = seoConfig.headings?.h1 || "Frequently Asked Questions";
  const h2List = seoConfig.headings?.h2 || [];

  useEffect(() => {
    updatePageSEO(seoConfig);
  }, []);

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <StructuredData pageType="faq" />
      <Header stickyHeaderEnabled={false} pageType="faq" />
      <div className="container max-w-4xl mx-auto px-4 py-12">

        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4" data-testid="text-faq-title">
            {h1Text}
          </h1>
          {/* SEO H2 headings - hidden but crawlable */}
          {h2List.map((h2: string, index: number) => (
            <h2 key={index} className="sr-only">{h2}</h2>
          ))}
          <p className="text-muted-foreground text-lg" data-testid="text-faq-subtitle">
            Find answers to common questions about QR code generation and scanning
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-faq"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
              data-testid="badge-category-all"
            >
              All Categories
            </Badge>
            {faqCategories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
                data-testid={`badge-category-${category.toLowerCase()}`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No questions found matching your search. Try different keywords.
            </p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-lg px-6 bg-card"
                data-testid={`faq-item-${index}`}
              >
                <AccordionTrigger
                  className="text-left hover:no-underline"
                  data-testid={`button-faq-${index}`}
                >
                  <div className="flex items-start gap-3 pr-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold mt-0.5">
                      {index + 1}
                    </div>
                    <span className="font-semibold">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent
                  className="text-muted-foreground pl-9 pt-2"
                  data-testid={`text-answer-${index}`}
                >
                  <p>{faq.answer}</p>
                  {faq.category && (
                    <Badge variant="secondary" className="mt-3">
                      {faq.category}
                    </Badge>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        <div className="mt-12 p-6 bg-card border rounded-lg text-center">
          <h3 className="font-semibold text-lg mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for? We're here to help!
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/" data-testid="link-home-cta">
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md font-medium" data-testid="button-try-generator">
                Try QR Generator
              </button>
            </Link>
            <Link to="/scanner" data-testid="link-scanner-cta">
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md font-medium" data-testid="button-try-scanner">
                Try QR Scanner
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      <ShareButton pageType="generator" />
      
      <Footer />
    </div>
  );
}
