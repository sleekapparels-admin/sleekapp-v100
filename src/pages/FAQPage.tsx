import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { SEO } from "@/components/SEO";
import { getPageSEO } from "@/lib/seo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const faqCategories = [
  {
    category: "Ordering & MOQ",
    questions: [
      {
        q: "What is your minimum order quantity (MOQ)?",
        a: "Our standard MOQ is 50 pieces per style. For knitwear and complex designs, the MOQ may vary between 50-300 pieces depending on the product complexity and customization level. We're flexible and happy to discuss your specific needs."
      },
      {
        q: "Can I order samples before placing a bulk order?",
        a: "Yes! We offer sample development services. Sample lead time is typically 7-10 days. Sample costs are charged separately but can be credited against your first bulk order (minimum 200 pieces)."
      },
      {
        q: "How do I place an order?",
        a: "You can request a quote through our website or contact us directly via email or WhatsApp. Our merchandising team will work with you to finalize specifications, pricing, and timelines."
      },
      {
        q: "What information do I need to provide for a quote?",
        a: "Please provide: product type, quantity, fabric/material preferences, colors, sizes, any custom branding/embellishments, target price range, and your deadline. Detailed tech packs or reference images are helpful but not required."
      }
    ]
  },
  {
    category: "Production & Lead Times",
    questions: [
      {
        q: "What are your typical production lead times?",
        a: "Standard production times: Sampling 7-10 days, Bulk production 30-45 days from approval. Rush orders available with surcharge. Lead times depend on order quantity, complexity, and current production schedule."
      },
      {
        q: "Can you handle rush orders?",
        a: "Yes, we can accommodate urgent orders depending on our current capacity. Rush orders typically incur a 15-25% surcharge and require upfront payment. Contact us to discuss your timeline."
      },
      {
        q: "Do you provide production updates?",
        a: "Yes! Our digital platform provides real-time production tracking with photos and progress updates at each stage: yarn received, knitting, linking, washing, QC, and packing."
      },
      {
        q: "What happens if there are delays?",
        a: "We communicate proactively if any delays occur. You'll receive immediate notification with revised timelines and explanations. We work to minimize delays through efficient planning and resource management."
      }
    ]
  },
  {
    category: "Quality & Standards",
    questions: [
      {
        q: "What quality certifications do you have?",
        a: "We are ISO 9001 certified for quality management, WRAP certified for ethical manufacturing, and GOTS approved for organic textile processing. We also maintain Oeko-Tex Standard 100 certification for fabric safety."
      },
      {
        q: "What is your quality control process?",
        a: "We implement a 4-point inspection system with checks at every production stage: incoming materials, in-line production, pre-washing, and final inspection. Detailed QC reports with photos are provided for every order."
      },
      {
        q: "What if I receive defective products?",
        a: "We maintain strict quality standards with less than 1% defect rate. If you receive defective items, contact us within 7 days with photos. We'll provide replacements or credit for verified manufacturing defects at our expense."
      },
      {
        q: "Can I inspect the factory or visit during production?",
        a: "Absolutely! We welcome factory visits and can arrange virtual tours or in-person inspections. We believe in complete transparency. Contact us to schedule a visit to our Bangladesh facilities."
      }
    ]
  },
  {
    category: "Pricing & Payment",
    questions: [
      {
        q: "How is pricing calculated?",
        a: "Pricing depends on: fabric type & weight, product complexity, quantity, customization level (embroidery, printing, etc.), and packaging requirements. We provide detailed breakdowns in all quotes."
      },
      {
        q: "What payment terms do you offer?",
        a: "Standard terms: 30% deposit upon order confirmation, 70% balance before shipment. We accept bank transfers, PayPal, and other secure payment methods. Different terms available for established clients."
      },
      {
        q: "Are there additional costs I should know about?",
        a: "Quote prices are FOB Bangladesh. Additional costs may include: international shipping, customs duties, sample costs, urgent production surcharges, and premium packaging. We provide full cost transparency upfront."
      },
      {
        q: "Do you offer discounts for larger orders?",
        a: "Yes, we offer volume-based pricing. Orders above 500 pieces typically receive 5-10% discount, 1000+ pieces receive 10-15% discount. Repeat customers also benefit from preferential pricing."
      }
    ]
  },
  {
    category: "Customization & Design",
    questions: [
      {
        q: "Can you create custom designs?",
        a: "Yes! We offer full design and development services. Share your ideas, sketches, or reference images, and our team will create tech packs and samples. We can also help improve existing designs."
      },
      {
        q: "What customization options are available?",
        a: "We offer: custom knit patterns, jacquard designs, embroidery (logo/text), screen printing, heat transfer, woven labels, hang tags, custom packaging, and size/fit adjustments."
      },
      {
        q: "Do you have a design studio or AI tools?",
        a: "Yes! Our AI-powered Design Studio lets you visualize custom garments with different colors, patterns, and branding. We also have an in-house design team for technical development."
      },
      {
        q: "Can you match a Pantone color exactly?",
        a: "We can match Pantone colors closely (within industry-standard tolerance). Exact matches depend on yarn availability and dye lot. We always provide pre-production samples for color approval."
      }
    ]
  },
  {
    category: "Sustainability & Ethics",
    questions: [
      {
        q: "Are you an ethical manufacturer?",
        a: "Yes, we are committed to ethical manufacturing. We ensure fair wages above local standards, safe working conditions, no child labor, and regular third-party audits. We're WRAP and Fair Trade certified."
      },
      {
        q: "What sustainable materials do you use?",
        a: "We work with: organic cotton (GOTS certified), recycled polyester, bamboo blends, Tencel/lyocell, hemp blends, and low-impact dyes. We can source specialized eco-friendly materials upon request."
      },
      {
        q: "How do you minimize environmental impact?",
        a: "Our initiatives include: water recycling systems, renewable energy usage, waste reduction programs, biodegradable packaging options, and local sourcing to reduce transportation emissions."
      },
      {
        q: "Can I visit the factory to verify conditions?",
        a: "Yes! We encourage transparency. Schedule a factory tour to see our operations, meet our team, and verify our ethical and sustainable practices firsthand."
      }
    ]
  },
  {
    category: "Shipping & Logistics",
    questions: [
      {
        q: "Where do you ship to?",
        a: "We ship worldwide. Primary markets include USA, UK, EU, Canada, Australia, and the Middle East. We work with reliable freight forwarders to ensure smooth international delivery."
      },
      {
        q: "What shipping methods are available?",
        a: "We offer sea freight (most economical for bulk), air freight (faster for urgent orders), and express courier for samples. We can arrange shipping or work with your preferred forwarder."
      },
      {
        q: "Who handles customs and duties?",
        a: "Customs duties and import taxes are the buyer's responsibility. We provide all necessary documentation (commercial invoice, packing list, certificate of origin). We can advise on documentation for your country."
      },
      {
        q: "How long does international shipping take?",
        a: "Sea freight: 25-35 days to USA/EU, 15-20 days to Middle East. Air freight: 5-7 days worldwide. Express: 3-5 days. Times vary by destination and customs clearance."
      }
    ]
  }
];

const FAQPage = () => {
  return (
    <>
      <SEO config={getPageSEO('faq')} />
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-muted/50 to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about ordering, production, quality, and working with Sleek Apparels.
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {faqCategories.map((category, idx) => (
              <Card key={idx} className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-foreground">{category.category}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, qIdx) => (
                    <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                      <AccordionTrigger className="text-left font-semibold">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-muted/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our team is here to help. Contact us directly for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:info@sleekapparels.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition"
              >
                Email Us
              </a>
              <a 
                href="https://wa.me/8801617848686"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-input text-base font-medium rounded-md text-foreground bg-background hover:bg-muted transition"
              >
                WhatsApp Chat
              </a>
            </div>
          </div>
        </section>

        <Footer />
        <FloatingContactWidget />
      </div>
    </>
  );
};

export default FAQPage;
