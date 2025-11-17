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
        
        {/* Section 3: Value Propositions */}
        <ValuePropositions />
        
        {/* Section 4: Main Services */}
        <ServicesSection />
        
        {/* Section 5: Portfolio Gallery */}
        <PortfolioGallery />
        
        {/* Section 6: Competitive Advantage */}
        <ComparisonTable />
        
        {/* Section 7: Founder Message */}
        <FounderMessage />
        
        {/* Section 8: Testimonials */}
        <Testimonials />
        
        {/* Section 9: Resources */}
        <ResourcesSection />
        
        {/* Section 10: Final CTA */}
        <FinalCTA />
        
        <Footer />
      </div>
    </>
  );
}

export default Index;
