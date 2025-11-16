import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Privacy = () => {
  return (
    <>
      <SEO 
        config={{
          title: "Privacy Policy | Sleek Apparels",
          description: "Learn how Sleek Apparels collects, uses, and protects your personal information.",
          canonical: `${window.location.origin}/privacy`,
        }}
      />
      
      <Navbar />
      
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-h1-mobile md:text-h1 font-heading font-bold mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p className="text-body-lg">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section>
              <h2 className="text-h2-mobile md:text-h2 font-heading font-semibold mb-4 text-foreground">
                Information We Collect
              </h2>
              <p className="text-body mb-4">
                We collect information that you provide directly to us, including name, email address, company name, phone number, and order details when you request quotes or place orders.
              </p>
            </section>

            <section>
              <h2 className="text-h2-mobile md:text-h2 font-heading font-semibold mb-4 text-foreground">
                How We Use Your Information
              </h2>
              <p className="text-body mb-4">
                We use the information we collect to process your orders, communicate with you about our services, and improve our manufacturing processes and customer experience.
              </p>
            </section>

            <section>
              <h2 className="text-h2-mobile md:text-h2 font-heading font-semibold mb-4 text-foreground">
                Data Security
              </h2>
              <p className="text-body mb-4">
                We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-h2-mobile md:text-h2 font-heading font-semibold mb-4 text-foreground">
                Contact Us
              </h2>
              <p className="text-body mb-4">
                If you have questions about this Privacy Policy, please contact us at inquiry@sleekapparels.com
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Privacy;
