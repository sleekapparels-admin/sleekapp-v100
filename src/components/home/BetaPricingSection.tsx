import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check, Sparkles, Zap, Crown } from "lucide-react";

export const BetaPricingSection = () => {
  return (
    <section className="py-section-mobile md:py-section bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            🚀 Beta Launch Pricing
          </Badge>
          <h2 className="text-h2-mobile md:text-h2 font-heading font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            Join our beta program and get free access to all features until December 31, 2025
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Beta Access */}
          <Card className="border-2 border-primary shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
              LIMITED TIME
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle className="text-2xl">Beta Access</CardTitle>
              </div>
              <div className="mb-2">
                <span className="text-4xl font-bold">FREE</span>
                <span className="text-muted-foreground ml-2">until Dec 31, 2025</span>
              </div>
              <CardDescription>Full platform access for early adopters</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Unlimited AI quote generations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Full LoopTrace™ order tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Priority customer support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Real-time production analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <Crown className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold text-accent">Lifetime discount on future tiers</span>
                </li>
              </ul>
              <Button asChild className="w-full" size="lg">
                <Link to="/auth?intent=beta">Join Beta Now</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Free Tier (After Launch) */}
          <Card className="border border-border">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-2xl">Free Tier</CardTitle>
              </div>
              <div className="mb-2">
                <span className="text-4xl font-bold">FREE</span>
                <span className="text-muted-foreground ml-2">forever</span>
              </div>
              <CardDescription>After Jan 1, 2026 • Core features</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm">5 AI quotes per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Basic order tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Email support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Standard product catalog</span>
                </li>
              </ul>
              <p className="text-xs text-muted-foreground text-center">
                Available after beta period ends
              </p>
            </CardContent>
          </Card>

          {/* Pro & Pro Plus */}
          <Card className="border border-border bg-muted/30">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-accent" />
                <CardTitle className="text-2xl">Growth & Scale</CardTitle>
              </div>
              <div className="mb-2">
                <span className="text-4xl font-bold">TBD</span>
              </div>
              <CardDescription>Starting Jan 2026 • Advanced features</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Unlimited AI quotes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Advanced analytics dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Priority production scheduling</span>
                </li>
                <li className="flex items-start gap-2">
                  <Crown className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold text-accent">Beta users: Lifetime discount</span>
                </li>
              </ul>
              <p className="text-xs text-muted-foreground text-center">
                Pricing details coming soon
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            <strong>Note:</strong> All beta users will retain access to a free tier after launch, with core features included. 
            Beta users will also receive exclusive lifetime discounts on Growth and Scale subscription tiers.
          </p>
        </div>
      </div>
    </section>
  );
};
