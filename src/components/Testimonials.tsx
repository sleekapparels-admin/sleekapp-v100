import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Emma Richardson",
    role: "Founder, Nordic Threads",
    location: "Stockholm, Sweden",
    quote: "Finally, a Bangladesh manufacturer that understands small brands. We started with just 75 pieces to test our designs. The quality exceeded our expectations, and the real-time tracking gave us confidence throughout production.",
    rating: 5,
  },
  {
    name: "Marcus Chen",
    role: "Sourcing Director, Urban Collective",
    location: "Toronto, Canada",
    quote: "We've worked with dozens of factories in Bangladesh. Sleek is the only one that delivers on transparency promises. The AI tracking isn't marketing fluff—it's real, and it's game-changing for our operations.",
    rating: 5,
  },
  {
    name: "Sarah Mitchell",
    role: "Head of Procurement, Westfield Academy",
    location: "Manchester, UK",
    quote: "Ordering 200 custom school uniforms used to be impossible from Bangladesh. Sleek made it seamless. Great quality, fair pricing, and they actually care about getting the details right.",
    rating: 5,
  },
  {
    name: "David Park",
    role: "Creative Director, Atelier Moderne",
    location: "Los Angeles, USA",
    quote: "Most Bangladesh factories only do basics. Sleek handles our complex knitwear designs with intricate patterns and custom yarns. They're not just manufacturers—they're partners in bringing our vision to life.",
    rating: 5,
  },
  {
    name: "Lisa Weber",
    role: "Owner, Conscious Clothing Co.",
    location: "Berlin, Germany",
    quote: "Ethical sourcing from Bangladesh felt like an oxymoron until we found Sleek. Their compliance documentation is thorough, their workers are treated fairly, and they're transparent about every aspect of production.",
    rating: 5,
  },
  {
    name: "James O'Connor",
    role: "Brand Manager, Heritage Sports",
    location: "Dublin, Ireland",
    quote: "We needed 150 custom team jerseys with a tight deadline. Sleek delivered in 18 days with perfect quality. The live production updates kept our team informed and confident throughout the process.",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-secondary">
            Trusted by Brands Worldwide
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From fashion startups to established brands, schools to private labels—see why customers choose Sleek Apparels for their Bangladesh sourcing needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
