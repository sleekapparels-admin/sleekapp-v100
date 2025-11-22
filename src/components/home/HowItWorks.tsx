import { useState } from "react";
import { MessageSquare, Cog, Eye, Package, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    number: 1,
    icon: MessageSquare,
    title: "Get Instant Quote",
    duration: "60 Seconds",
    description: "Use our AI-powered quote generator or chat with our expert directly. Describe your product, quantity, and timeline.",
    features: [
      "AI analyzes your requirements instantly",
      "Transparent pricing breakdown",
      "Material recommendations included",
      "No hidden fees or surprises"
    ],
    cta: {
      label: "Try AI Quote Generator",
      link: "/quote-generator"
    },
    color: "from-blue-500 to-blue-600"
  },
  {
    number: 2,
    icon: Cog,
    title: "We Produce",
    duration: "10-20 Days",
    description: "Once approved, production begins immediately. Our advanced facilities and streamlined workflow ensure rapid turnaround.",
    features: [
      "Sample development (3-7 days)",
      "Bulk production (10-20 days)",
      "Advanced automated machinery",
      "Quality checkpoints at every stage"
    ],
    cta: {
      label: "See Our Capabilities",
      link: "/capabilities"
    },
    color: "from-purple-500 to-purple-600"
  },
  {
    number: 3,
    icon: Eye,
    title: "Track with LoopTrace™",
    duration: "Real-Time",
    description: "Watch your order progress through 8 manufacturing stages with photo evidence and live updates. Complete transparency.",
    features: [
      "Live production stage updates",
      "Photo/video documentation",
      "AI-powered delay predictions",
      "Direct supplier communication"
    ],
    cta: {
      label: "View Tracking Demo",
      link: "/production-tracking"
    },
    color: "from-green-500 to-green-600"
  },
  {
    number: 4,
    icon: Package,
    title: "Receive Quality Products",
    duration: "5-30 Days Shipping",
    description: "Every garment inspected to AQL 2.5 standards before shipment. Fast international delivery to 15+ countries.",
    features: [
      "Final quality inspection",
      "Detailed QC reports included",
      "Express shipping available",
      "30-day quality guarantee"
    ],
    cta: {
      label: "View Shipping Options",
      link: "/shipping-logistics"
    },
    color: "from-orange-500 to-orange-600"
  }
];

export const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Simple 4-Step Process
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From quote to delivery in as fast as 15 days. No complexity, no confusion—just transparent manufacturing.
          </p>
        </div>

        {/* Desktop: Step Cards in Grid */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;
            
            return (
              <div
                key={index}
                onClick={() => setActiveStep(index)}
                className={`relative cursor-pointer transition-all duration-300 ${
                  isActive ? 'scale-105' : 'hover:scale-102'
                }`}
              >
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-1/2 z-0" />
                )}

                <div
                  className={`relative bg-card border-2 rounded-2xl p-6 transition-all ${
                    isActive 
                      ? 'border-primary shadow-xl' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {/* Step Number Badge */}
                  <div className={`absolute -top-4 -right-4 w-10 h-10 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 mx-auto`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Title & Duration */}
                  <h3 className="text-xl font-bold text-center mb-2">
                    {step.title}
                  </h3>
                  <Badge variant="secondary" className="w-full justify-center mb-3">
                    {step.duration}
                  </Badge>

                  {/* Description (shown when active) */}
                  {isActive && (
                    <p className="text-sm text-muted-foreground text-center">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="lg:hidden space-y-8 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            
            return (
              <div key={index} className="relative pl-12">
                {/* Timeline Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-transparent" />
                )}

                {/* Step Number */}
                <div className={`absolute left-0 top-0 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {step.number}
                </div>

                {/* Content */}
                <div className="bg-card border-2 border-border rounded-xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Icon className="h-8 w-8 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                      <Badge variant="secondary">{step.duration}</Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  <ul className="space-y-2 mb-4">
                    {step.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to={step.cta.link}>
                      {step.cta.label}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: Detailed View of Active Step */}
        <div className="hidden lg:block">
          {steps.map((step, index) => {
            if (activeStep !== index) return null;
            
            return (
              <div
                key={index}
                className="bg-card border-2 border-primary rounded-2xl p-8 shadow-xl"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">What Happens:</h3>
                    <p className="text-lg text-muted-foreground mb-6">
                      {step.description}
                    </p>
                    <Button asChild size="lg" className="group">
                      <Link to={step.cta.link}>
                        {step.cta.label}
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-4">Key Features:</h4>
                    <ul className="space-y-3">
                      {step.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Ready to experience the fastest, most transparent manufacturing process?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/quote-generator">
                Start with AI Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link to="/contact">
                Talk to Founder
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
