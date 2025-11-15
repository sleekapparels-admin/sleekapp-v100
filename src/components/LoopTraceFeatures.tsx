import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Truck, Shield, Globe } from "lucide-react";
import { TrackingIcon, QualityIcon, AnalyticsIcon, NotificationIcon } from "@/components/CustomIcons";

export const LoopTraceFeatures = () => {
  const features = [
    {
      icon: TrackingIcon,
      title: "Live Factory Floor Updates",
      description: "Watch your order progress through cutting, sewing, finishing, and QC with timestamped photo documentation and status updates—so you always know what's happening and why."
    },
    {
      icon: QualityIcon,
      title: "AI-Powered Quality Predictions",
      description: "Machine learning analyzes production signals to predict defects and suggest fixes before problems escalate, reducing rework and returns."
    },
    {
      icon: Truck,
      title: "End-to-End Shipment Tracking",
      description: "Follow every movement from factory gate to your warehouse with GPS, carrier status, and customs impact—minimizing surprises and improving delivery planning."
    },
    {
      icon: Shield,
      title: "Automated Compliance Verification",
      description: "Real-time checks for ethical practices, material certifications, and spec compliance provide traceable proof and reduce compliance risk."
    },
    {
      icon: AnalyticsIcon,
      title: "Production Analytics Dashboard",
      description: "Actionable insights on throughput, quality trends, cost drivers, and timeline forecasts to help you optimize operations and make data-driven decisions."
    },
    {
      icon: NotificationIcon,
      title: "Smart Alerts & Notifications",
      description: "Immediate, prioritized alerts for quality concerns, schedule deviations, compliance flags, and shipment changes so you can respond quickly and reduce impact."
    }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>LAUNCHING SOON</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            LoopTrace™: End the Bangladesh Black Box
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Traditional Bangladesh sourcing means trusting blindly. LoopTrace™ changes everything with AI-powered transparency—see exactly what's happening with your order at every production stage, in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-90">
          {features.map((feature, index) => (
            <div key={index} className="relative p-6 rounded-lg border border-border bg-card/50 backdrop-blur">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Interested in early access to LoopTrace™ when it launches?
          </p>
          <Button asChild size="lg" className="font-semibold shadow-lg">
            <Link to="/contact">
              Request Information
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};