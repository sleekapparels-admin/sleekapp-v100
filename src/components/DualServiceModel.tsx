import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Network, ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { FactoryIcon, OrderIcon } from "@/components/CustomIcons";

export const DualServiceModel = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Two Service Models for Your Business Needs
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Whether you're a retailer, wholesaler, educational institution, or organization, 
            we offer flexible manufacturing solutions tailored to your requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* In-House Knitwear Manufacturing */}
          <Card className="p-8 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 animate-fade-up bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <FactoryIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">In-House Knitwear Production</h3>
                <p className="text-sm text-muted-foreground">Direct Factory Knitting Services</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <OrderIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">MOQ: 50–200 pieces</div>
                  <p className="text-sm text-muted-foreground">Ideal for retailers and small businesses</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Lead Time: 10–20 days</div>
                  <p className="text-sm text-muted-foreground">From sample approval to shipment</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Advanced Flat Knitting</div>
                  <p className="text-sm text-muted-foreground">Multi-gauge with AI analytics</p>
                </div>
              </div>
            </div>

            <div className="bg-card/50 rounded-lg p-4 mb-6">
              <div className="font-semibold mb-2">Pricing Example:</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Basic Polo T-Shirt: Starting $4.50/pc (MOQ 100)</li>
                <li>• Knit Sweater: Starting $8.00/pc (MOQ 100)</li>
                <li>• Cardigan: Starting $12.00/pc (MOQ 100)</li>
              </ul>
            </div>

            <Button asChild variant="gold" size="lg" className="w-full">
              <Link to="/knitwear">
                Explore Knitwear Capabilities
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </Card>

          {/* Full-Package Sourcing */}
          <Card className="p-8 border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300 animate-fade-up bg-gradient-to-br from-secondary/5 to-transparent" style={{ animationDelay: "150ms" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-secondary/10">
                <Network className="h-8 w-8 text-secondary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Full-Service Manufacturing</h3>
                <p className="text-sm text-muted-foreground">Complete Apparel Production Solutions</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <OrderIcon className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">MOQ: 50–500 pieces</div>
                  <p className="text-sm text-muted-foreground">Perfect for wholesalers and organizations</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Lead Time: 30–60 days</div>
                  <p className="text-sm text-muted-foreground">Including fabric sourcing and production</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Vetted Factory Partners</div>
                  <p className="text-sm text-muted-foreground">Cut & sew, woven, denim, outerwear</p>
                </div>
              </div>
            </div>

            <div className="bg-card/50 rounded-lg p-4 mb-6">
              <div className="font-semibold mb-2">Product Categories:</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Woven Shirts & Blouses</li>
                <li>• Denim & Twill Pants</li>
                <li>• Jackets & Outerwear</li>
                <li>• School & Corporate Uniforms</li>
              </ul>
            </div>

            <Button asChild variant="outline" size="lg" className="w-full">
              <Link to="/services">
                View Sourcing Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </Card>
        </div>

        <div className="text-center mt-8 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <p className="text-sm text-muted-foreground">
            Not sure which service fits your needs? <Link to="/contact" className="text-primary hover:underline font-semibold">Contact us</Link> for personalized guidance.
          </p>
        </div>
      </div>
    </section>
  );
};
