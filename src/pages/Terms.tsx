import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Terms = () => {
  return (
    <>
      <SEO 
        config={{
          title: "Terms of Service | Sleek Apparels",
          description: "Read our terms of service for manufacturing and ordering custom apparel.",
          canonical: `${window.location.origin}/terms`,
        }}
      />
      
      <Navbar />
      
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-h1-mobile md:text-h1 font-heading font-bold mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p className="text-body-lg">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section>
              <h2 className="text-h2-mobile md:text-h2 font-heading font-semibold mb-4 text-foreground">
                Order Terms
              </h2>
              <p className="text-body mb-4">
                All orders are subject to minimum order quantities (MOQ) as specified in your quote. Prices are valid for 30 days from quote date unless otherwise specified.
              </p>
            </section>

            <section>
              <h2 className="text-h2-mobile md:text-h2 font-heading font-semibold mb-4 text-foreground">
                Payment Terms
              </h2>
              <p className="text-body mb-4">
                Payment terms are typically 50% deposit upon order confirmation and 50% before shipment. Alternative payment arrangements may be negotiated for established customers.
              </p>
            </section>

            <section>
              <h2 className="text-h2-mobile md:text-h2 font-heading font-semibold mb-4 text-foreground">
                Production Timeline
              </h2>
              <p className="text-body mb-4">
                Production timelines are estimates and may vary based on order complexity, material availability, and factory capacity. We will notify you of any significant delays.
              </p>
            </section>

            <section>
              <h2 className="text-h2-mobile md:text-h2 font-heading font-semibold mb-4 text-foreground">
                Quality Standards
              </h2>
              <p className="text-body mb-4">
                All products are manufactured to AQL 2.5 standards. Any quality issues must be reported within 7 days of delivery for resolution.
              </p>
            </section>

            <section>
              <h2 className="text-h2-mobile md:text-h2 font-heading font-semibold mb-4 text-foreground">
                Contact
              </h2>
              <p className="text-body mb-4">
                For questions about these terms, contact us at inquiry@sleekapparels.com
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Terms;
