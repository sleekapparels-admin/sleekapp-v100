import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { getPageSEO } from "@/lib/seo";
import { TrustBadgeBar } from "@/components/TrustBadgeBar";
import { ValuePropositions } from "@/components/ValuePropositions";
import { ServicesSection } from "@/components/ServicesSection";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { ComparisonTable } from "@/components/ComparisonTable";
import { FounderMessage } from "@/components/FounderMessage";
import { Testimonials } from "@/components/Testimonials";
import { ResourcesSection } from "@/components/ResourcesSection";
import { FinalCTA } from "@/components/FinalCTA";
import { StatsCounter } from "@/components/home/StatsCounter";
import { CertificationBadges } from "@/components/home/CertificationBadges";
import { HowItWorks } from "@/components/home/HowItWorks";
import { SupplierCTASection } from "@/components/home/SupplierCTASection";
import { BetaPricingSection } from "@/components/home/BetaPricingSection";
import { FeaturedMarketplace } from "@/components/home/FeaturedMarketplace";
import { LoopTraceFeatures } from "@/components/home/LoopTraceFeatures";
import { BuyerSupplierJourney } from "@/components/home/BuyerSupplierJourney";
import { usePageTracking } from "@/hooks/usePageTracking";
import { usePerformanceMonitoring, useResourcePreloading } from "@/hooks/usePerformance";

function Index() {
  // Performance and analytics tracking
  usePageTracking('home');
  usePerformanceMonitoring();
  useResourcePreloading();
  
  return (
    <>
      <SEO 
        config={getPageSEO('home')} 
        includeOrganizationSchema 
        includeLocalBusinessSchema 
        includeServiceSchema 
      />

      <div className="min-h-screen">
        <Navbar />
        
        {/* Section 1: Hero */}
        <Hero />
        
        {/* Section 2: Trust Badge Bar */}
        <TrustBadgeBar />
        
        {/* Section 3: Stats Counter - NEW */}
        <StatsCounter />
        
        {/* Section 4: Value Propositions - ENHANCED */}
        <ValuePropositions />
        
        {/* Section 5: Certification Badges - NEW */}
        <CertificationBadges />
        
        {/* Section 6: How It Works - NEW */}
        <HowItWorks />
        
        {/* Section 7: Supplier CTA - NEW */}
        <SupplierCTASection />
        
        {/* Section 7.5: Featured Marketplace - NEW */}
        <FeaturedMarketplace />
        
        {/* Section 7.6: LoopTrace Features - NEW */}
        <LoopTraceFeatures />
        
        {/* Section 7.7: Buyer/Supplier Journey - NEW */}
        <BuyerSupplierJourney />
        
        {/* Section 8: Main Services */}
        <ServicesSection />
        
        {/* Section 8: Portfolio Gallery */}
        <PortfolioGallery />
        
        {/* Section 9: Competitive Advantage */}
        <ComparisonTable />
        
        {/* Section 10: Founder Message */}
        <FounderMessage />
        
        {/* Section 11: Testimonials */}
        <Testimonials />
        
        {/* Section 12: Resources */}
        <ResourcesSection />
        
        {/* Section 13: Beta Pricing */}
        <BetaPricingSection />
        
        {/* Section 14: Final CTA */}
        <FinalCTA />
        
        <Footer />
      </div>
    </>
  );
}

export default Index;
