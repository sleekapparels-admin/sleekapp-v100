import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is your minimum order quantity (MOQ)?",
    answer: "Our MOQ is just 50 pieces per style—the lowest in Bangladesh. Perfect for fashion startups testing designs, boutique brands with limited budgets, schools ordering uniforms, or private labels launching new collections. Unlike traditional Bangladesh factories requiring 500-5,000 pieces, we're built for small orders.",
  },
  {
    question: "Why is your MOQ so much lower than other Bangladesh factories?",
    answer: "Most Bangladesh factories are designed for mass production and can't profitably handle small orders. We've invested in flexible manufacturing systems and efficient processes that make 50-piece orders economically viable. We believe small brands deserve the same quality and service as big brands.",
  },
  {
    question: "Can you handle innovative designs, or just basics?",
    answer: "We specialize in innovative knitwear—complex patterns, custom yarns, intricate details. While many Bangladesh factories only do basic t-shirts and polos, we have computerized Stoll & Cixing knitting machines capable of jacquard, intarsia, and complex structures. Send us your most challenging designs.",
  },
  {
    question: "How does your AI tracking system work?",
    answer: "Our LoopTrace™ system (launching soon) provides real-time updates at every production stage: cutting, sewing, finishing, QC, and shipping. You'll receive timestamped photos, AI-powered quality predictions, and compliance verification. No more wondering what's happening with your order—you'll see everything.",
  },
  {
    question: "What about ethical manufacturing and compliance?",
    answer: "We're ISO 9001, WRAP, and GOTS certified with full documentation available. Fair wages, safe conditions, and transparent practices aren't just promises—they're verified. Our AI system tracks compliance in real-time, so you can prove ethical sourcing to your customers.",
  },
  {
    question: "How long does production take?",
    answer: "Samples: 5-10 business days. Bulk production: 10-20 days depending on complexity. We're faster than most Bangladesh factories because our efficient systems and low MOQ focus mean your order doesn't wait behind massive orders from big brands.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes! We ship worldwide with experience in EU, North America, UK, and beyond. We handle all export documentation, customs paperwork, and logistics coordination. Whether you're in Stockholm, Toronto, London, or Los Angeles, we've got you covered.",
  },
  {
    question: "I don't have tech packs. Can you still help?",
    answer: "Absolutely! Send us reference photos, sketches, or even just descriptions. Our technical team will create complete specifications, suggest materials, and develop samples based on your vision. We're partners in bringing your designs to life, not just order-takers.",
  },
  {
    question: "What makes you different from other Bangladesh manufacturers?",
    answer: "Three things: (1) Industry-lowest 50-piece MOQ, (2) AI-powered transparency solving Bangladesh's 'black box' problem, (3) Innovative design capabilities beyond basics. We're not trying to be the biggest factory—we're trying to be the best partner for small to medium brands.",
  },
];

export const FAQ = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about working with us
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4 animate-fade-up">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-semibold hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
