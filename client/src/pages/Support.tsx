import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { getSEOByQRType, updatePageSEO } from "@/lib/seo-config";
import StructuredData from "@/components/StructuredData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const CONTACT_EMAIL = 'sudipbiswas1844@gmail.com';

export default function Support() {
  // Get SEO config for headings
  const seoConfig = getSEOByQRType('support');
  const h1Text = seoConfig.headings?.h1 || "Contact Us";
  const h2List = seoConfig.headings?.h2 || [];

  useEffect(() => {
    updatePageSEO(seoConfig);
  }, []);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormData) => {
    const subject = `My Qrcode Tool Contact: Message from ${data.firstName} ${data.lastName}`;
    const body = `Name: ${data.firstName} ${data.lastName}%0D%0AEmail: ${data.email}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(data.message)}`;
    
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <StructuredData pageType="support" />
      <Header stickyHeaderEnabled={false} pageType="support" />
      <div className="container max-w-6xl mx-auto px-4 py-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h1 className="text-4xl font-bold mb-4" data-testid="text-contact-title">
              {h1Text}
            </h1>
            {/* SEO H2 headings - hidden but crawlable */}
            {h2List.map((h2: string, index: number) => (
              <h2 key={index} className="sr-only">{h2}</h2>
            ))}
            <p className="text-muted-foreground text-lg mb-6" data-testid="text-contact-subtitle">
              Need to get in touch with us? Either fill out the form with your inquiry or find the department email you'd like to contact below.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-8 shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-first-name">First name*</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="" 
                            {...field} 
                            data-testid="input-first-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-last-name">Last name*</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="" 
                            {...field} 
                            data-testid="input-last-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="label-email">Email*</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="" 
                          {...field} 
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="label-message">What can we help you with?*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="" 
                          className="min-h-[120px] resize-none" 
                          {...field} 
                          data-testid="input-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full sm:w-auto" 
                  data-testid="button-submit"
                >
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
