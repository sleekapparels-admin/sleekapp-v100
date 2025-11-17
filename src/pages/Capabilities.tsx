import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Users, Zap, Globe, Shield, Award } from "lucide-react";

const Capabilities = () => {
  const capabilities = [
    {
      icon: Users,
      title: "Production Capacity",
      description: "200,000+ pieces per month across multiple production lines"
    },
    {
      icon: Zap,
      title: "Fast Turnaround",
      description: "5-10 day sampling, 10-20 day production for most orders"
    },
    {
      icon: Globe,
      title: "Global Shipping",
      description: "Worldwide delivery with reliable logistics partners"
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "AQL 2.5 inspection standards on all production"
    },
    {
      icon: Award,
      title: "Certifications",
      description: "OEKO-TEX®, BSCI, and WRAP certified facility"
    },
    {
      icon: CheckCircle2,
      title: "Low MOQ",
      description: "Start with as low as 50 pieces per style"
    }
  ];

  return (
    <>
      <SEO 
        config={{
          title: "Manufacturing Capabilities | Sleek Apparels",
          description: "Discover our state-of-the-art manufacturing capabilities including production capacity, quality standards, and certifications.",
          canonical: `${window.location.origin}/capabilities`,
        }}
      />
      
      <Navbar />
      
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-h1-mobile md:text-h1 font-heading font-bold mb-6">
              Our Manufacturing Capabilities
            </h1>
            <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto">
              State-of-the-art facilities and proven processes to deliver quality apparel manufacturing at scale
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <Card key={index} className="p-8 hover:shadow-card-hover transition-all">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-h3-mobile font-heading font-semibold mb-3 text-center">
                    {capability.title}
                  </h3>
                  <p className="text-body text-muted-foreground text-center leading-relaxed">
                    {capability.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Capabilities;
