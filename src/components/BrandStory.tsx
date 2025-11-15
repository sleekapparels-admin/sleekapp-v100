import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import factoryExterior from "@/assets/sleek-factory-exterior.webp";
export const BrandStory = () => {
  return <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-secondary leading-tight">
              Breaking Bangladesh's High MOQ Barrier
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
              Traditional Bangladesh factories demand 500-5,000 pieces per style. We start at just 50 pieces. Perfect for fashion startups testing new designs, boutique brands with limited budgets, schools ordering uniforms, and private labels launching collections.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
              Beyond low MOQ, we solve Bangladesh's biggest problems: lack of transparency, basic-only designs, and compliance uncertainty. Our AI-powered LoopTrace™ system gives you real-time visibility into every production stage. We specialize in innovative knitwear, not just basics. And our certified ethical practices are verifiable, not just promised.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/about">
                  Our Story
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link to="/sustainability">Our Sustainability Commitment</Link>
              </Button>
            </div>
          </div>
          <div className="relative order-1 lg:order-2 mb-8 lg:mb-0">
            <img src={factoryExterior} alt="Sleek Apparels factory exterior in Bangladesh - ethical garment manufacturing facility" className="rounded-xl sm:rounded-2xl shadow-card-hover w-full h-auto object-cover" loading="lazy" width="1732" height="1732" />
            <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-primary text-primary-foreground p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-xl">
              <p className="text-3xl sm:text-4xl md:text-5xl font-accent font-semibold">MOQ 50+</p>
              <p className="text-xs sm:text-sm font-medium mt-1">
                Starting at just 50 pieces
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};