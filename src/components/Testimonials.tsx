import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sustainable Fashion Brand",
    role: "",
    location: "Stockholm, Sweden",
    quote: "Working with Sleek Apparels transformed our sourcing strategy. The AI tracking gave us transparency we never had before, and the quality exceeded our European standards.",
    rating: 5,
  },
  {
    name: "Streetwear Startup",
    role: "",
    location: "London, UK",
    quote: "Finally, a manufacturer that understands small brands. The 50-piece MOQ let us test our designs without huge risk. Now they're our exclusive production partner.",
    rating: 5,
  },
  {
    name: "Corporate Apparel Distributor",
    role: "",
    location: "Toronto, Canada",
    quote: "The response time and communication quality is what impressed us most. They reply within hours, not days. Production was exactly on schedule.",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section className="py-section-mobile md:py-section bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-h2-mobile md:text-h2 font-heading font-semibold mb-4">
            What Our Partners Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-card border border-border rounded-xl p-6 sm:p-8 hover:shadow-card-hover transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              
              <Quote className="w-8 h-8 text-primary/20 mb-3" />
              
              <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>
              
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-secondary">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                <p className="text-xs text-muted-foreground mt-1">{testimonial.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
