import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Globe, Award } from "lucide-react";
import { TeamIcon } from "@/components/CustomIcons";

export const TrustBuilders = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Retailers & Organizations Choose Sleek Apparels
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ethical manufacturing, transparent processes, and a commitment to quality that delivers real value to our partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center hover:shadow-card-hover transition-all duration-300 animate-fade-up border-0 bg-card">
            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Ethical Manufacturing</h3>
            <p className="text-sm text-muted-foreground">
              Fair wages, safe working conditions, and compliance with international labor standards for all partners.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-card-hover transition-all duration-300 animate-fade-up border-0 bg-card" style={{ animationDelay: "100ms" }}>
            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Quality Certifications</h3>
            <p className="text-sm text-muted-foreground">
              AQL 2.5 inspection standard, ISO-compliant processes, and third-party audits.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-card-hover transition-all duration-300 animate-fade-up border-0 bg-card" style={{ animationDelay: "200ms" }}>
            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
              <TeamIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Experienced Team</h3>
            <p className="text-sm text-muted-foreground">
              15+ years serving retailers, wholesalers, and organizations with skilled merchandisers and QC experts.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-card-hover transition-all duration-300 animate-fade-up border-0 bg-card" style={{ animationDelay: "300ms" }}>
            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Global Reach</h3>
            <p className="text-sm text-muted-foreground">
              Serving retailers and organizations worldwide with reliable shipping and customs support.
            </p>
          </Card>
        </div>

        <div className="mt-12 bg-card border border-border rounded-lg p-8 animate-fade-up" style={{ animationDelay: "400ms" }}>
          <div className="text-center mb-6">
            <Badge variant="outline" className="mb-2">Our Commitment</Badge>
            <h3 className="text-2xl font-bold mb-4">Complete Transparency</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="font-semibold mb-2">Clear Pricing</div>
              <p className="text-sm text-muted-foreground">All costs clearly itemized in quotes</p>
            </div>
            <div>
              <div className="font-semibold mb-2">Production Tracking</div>
              <p className="text-sm text-muted-foreground">LoopTrace™ shows real-time status</p>
            </div>
            <div>
              <div className="font-semibold mb-2">Direct Communication</div>
              <p className="text-sm text-muted-foreground">Email, WhatsApp, and messaging support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
