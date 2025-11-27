import { useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { PainPointSelector } from "@/components/quote/PainPointSelector";
import { MOQComparisonChart } from "@/components/infographics/MOQComparisonChart";
import { TimelineComparisonChart } from "@/components/infographics/TimelineComparisonChart";
import { SupplierProfileCard, SampleSupplierProfiles } from "@/components/supplier/SupplierProfileCard";
import { EnhancedAIAssistant } from "@/components/EnhancedAIAssistant";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Eye } from "lucide-react";

/**
 * AI Visual Enhancement Showcase Page
 * 
 * This page demonstrates all newly implemented visual components
 * and AI enhancements for addressing buyer and supplier pain points.
 * 
 * Components Showcased:
 * 1. Pain Point Selector - Visual concern identification
 * 2. MOQ Comparison Chart - Capital savings visualization
 * 3. Timeline Comparison Chart - Speed advantage
 * 4. Supplier Profile Cards - Transparency and empowerment
 * 5. Enhanced AI Assistant - Pain point-first conversation
 */
export default function AIVisualShowcase() {
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<'all' | 'painpoint' | 'moq' | 'timeline' | 'suppliers'>('all');

  const handlePainPointSelect = (painPointId: string) => {
    setSelectedPainPoints(prev =>
      prev.includes(painPointId)
        ? prev.filter(id => id !== painPointId)
        : [...prev, painPointId]
    );
  };

  return (
    <>
      <SEO
        config={{
          title: "AI & Visual Enhancement Showcase | Sleek Apparels",
          description: "Experience our new pain point-focused visual components and AI assistant designed to address buyer concerns transparently.",
          canonical: "https://sleekapparels.com/ai-visual-showcase"
        }}
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-purple-600/5 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white text-sm px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2 inline" />
                New AI & Visual Enhancements
              </Badge>

              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-accent bg-clip-text text-transparent">
                Pain Point-Solving Through Visual Transparency
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience our revolutionary approach to addressing buyer concerns with
                visual infographics, transparent supplier profiles, and AI-powered guidance.
              </p>

              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={() => setActiveSection('all')}>
                  <Eye className="h-4 w-4 mr-2" />
                  View All Components
                </Button>
                <Button variant="outline" onClick={() => setActiveSection('painpoint')}>
                  Pain Point Selector
                </Button>
                <Button variant="outline" onClick={() => setActiveSection('moq')}>
                  MOQ Comparison
                </Button>
                <Button variant="outline" onClick={() => setActiveSection('timeline')}>
                  Timeline Chart
                </Button>
                <Button variant="outline" onClick={() => setActiveSection('suppliers')}>
                  Supplier Profiles
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Components Showcase */}
        <div className="container mx-auto px-4 py-16 space-y-20">

          {/* Pain Point Selector Section */}
          {(activeSection === 'all' || activeSection === 'painpoint') && (
            <section id="painpoint-selector" className="space-y-8">
              <div className="text-center space-y-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Component 1: Pain Point Selector
                </Badge>
                <h2 className="text-4xl font-bold">Identify Buyer Concerns Upfront</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Visual card-based interface that helps buyers express their primary concerns,
                  allowing the platform to tailor the experience to address their specific pain points.
                </p>
                <div className="flex gap-2 justify-center text-sm">
                  <Badge>Multi-select capable</Badge>
                  <Badge>Animated interactions</Badge>
                  <Badge>Mobile responsive</Badge>
                </div>
              </div>

              <PainPointSelector
                onSelect={handlePainPointSelect}
                selectedPainPoints={selectedPainPoints}
                multiSelect={true}
              />

              {selectedPainPoints.length > 0 && (
                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <p className="font-semibold mb-2">
                    Selected Pain Points: {selectedPainPoints.join(', ')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    In a real implementation, this would trigger tailored content and AI responses
                  </p>
                </div>
              )}
            </section>
          )}

          {/* MOQ Comparison Chart Section */}
          {(activeSection === 'all' || activeSection === 'moq') && (
            <section id="moq-comparison" className="space-y-8">
              <div className="text-center space-y-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Component 2: MOQ Comparison Infographic
                </Badge>
                <h2 className="text-4xl font-bold">Visualize Capital Savings</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Interactive bar chart comparison showing the dramatic difference between
                  Sleek's 50-piece MOQ and traditional 1000-piece minimums. Addresses the #1
                  startup pain point: high capital risk.
                </p>
                <div className="flex gap-2 justify-center text-sm">
                  <Badge>Real-time calculations</Badge>
                  <Badge>Animated bars</Badge>
                  <Badge>Before/after scenarios</Badge>
                </div>
              </div>

              <MOQComparisonChart
                quantity={100}
                productType="t-shirts"
                unitPrice={8.50}
              />
            </section>
          )}

          {/* Timeline Comparison Section */}
          {(activeSection === 'all' || activeSection === 'timeline') && (
            <section id="timeline-comparison" className="space-y-8">
              <div className="text-center space-y-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Component 3: Timeline Comparison Chart
                </Badge>
                <h2 className="text-4xl font-bold">Demonstrate Speed Advantage</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Gantt-style timeline visualization showing stage-by-stage comparison of
                  Sleek's 10-20 day production vs. traditional 45-90 day timelines.
                  Includes LoopTrace™ checkpoint indicators.
                </p>
                <div className="flex gap-2 justify-center text-sm">
                  <Badge>6 production stages</Badge>
                  <Badge>LoopTrace™ markers</Badge>
                  <Badge>Cumulative tracking</Badge>
                </div>
              </div>

              <TimelineComparisonChart showLoopTraceIndicators={true} />
            </section>
          )}

          {/* Supplier Profiles Section */}
          {(activeSection === 'all' || activeSection === 'suppliers') && (
            <section id="supplier-profiles" className="space-y-8">
              <div className="text-center space-y-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Component 4: Supplier Profile Cards
                </Badge>
                <h2 className="text-4xl font-bold">Transparent Supplier Showcase</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Humanizing cards that tell the story of small manufacturer partners,
                  showcasing their specializations, certifications, impact metrics, and
                  before/after transformation through Sleek's fair pricing model.
                </p>
                <div className="flex gap-2 justify-center text-sm">
                  <Badge>Impact metrics</Badge>
                  <Badge>Before/after stories</Badge>
                  <Badge>Certifications display</Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SampleSupplierProfiles.map(supplier => (
                  <SupplierProfileCard
                    key={supplier.id}
                    supplier={supplier}
                    showImpactMetrics={true}
                    showBeforeAfter={true}
                    onViewDetails={(id) => console.log('View supplier:', id)}
                  />
                ))}
              </div>

              <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-semibold text-green-900 mb-2">
                  <TrendingUp className="h-5 w-5 inline mr-2" />
                  Supplier Empowerment Impact
                </p>
                <p className="text-sm text-green-800">
                  By choosing Sleek Apparels, buyers support small manufacturers earning
                  <strong> 25-30% higher margins</strong> compared to traditional large brand contracts.
                  This enables investment in worker welfare, equipment upgrades, and sustainable growth.
                </p>
              </div>
            </section>
          )}

          {/* Implementation Guide Section */}
          <section className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center">
                <Badge className="mb-4">Implementation Guide</Badge>
                <h2 className="text-3xl font-bold mb-4">How to Integrate These Components</h2>
                <p className="text-muted-foreground">
                  These components are designed for easy integration into existing pages
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border-2 border-primary/20">
                  <h3 className="font-semibold text-lg mb-3">Quote Flow Enhancement</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add PainPointSelector as first step in quote generation flow.
                    Display MOQComparisonChart based on user input.
                  </p>
                  <code className="text-xs bg-slate-100 p-2 rounded block">
                    import {`{PainPointSelector}`} from '@/components/quote/PainPointSelector'
                  </code>
                </div>

                <div className="bg-white rounded-lg p-6 border-2 border-purple-600/20">
                  <h3 className="font-semibold text-lg mb-3">Homepage Integration</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add MOQComparisonChart and TimelineComparisonChart to showcase
                    competitive advantages visually.
                  </p>
                  <code className="text-xs bg-slate-100 p-2 rounded block">
                    import {`{MOQComparisonChart}`} from '@/components/infographics/...'
                  </code>
                </div>

                <div className="bg-white rounded-lg p-6 border-2 border-green-600/20">
                  <h3 className="font-semibold text-lg mb-3">Supplier Pages</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create "Meet Our Suppliers" page using SupplierProfileCard
                    components with real partner data.
                  </p>
                  <code className="text-xs bg-slate-100 p-2 rounded block">
                    import {`{SupplierProfileCard}`} from '@/components/supplier/...'
                  </code>
                </div>

                <div className="bg-white rounded-lg p-6 border-2 border-blue-600/20">
                  <h3 className="font-semibold text-lg mb-3">AI Assistant Upgrade</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Replace existing SmartAIAssistant with EnhancedAIAssistant
                    for pain point-first conversation flow.
                  </p>
                  <code className="text-xs bg-slate-100 p-2 rounded block">
                    import {`{EnhancedAIAssistant}`} from '@/components/...'
                  </code>
                </div>
              </div>

              <div className="text-center pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  For complete implementation guide, see AI_VISUAL_ENHANCEMENT_IMPLEMENTATION.md
                </p>
                <Button>
                  View Full Documentation
                </Button>
              </div>
            </div>
          </section>

          {/* Next Steps Section */}
          <section className="text-center space-y-6 py-12">
            <Badge className="text-lg px-4 py-2">
              Next Steps
            </Badge>
            <h2 className="text-4xl font-bold">Content Population Required</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              To complete Phase 1 implementation, the following content assets need to be created:
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">📊 Infographics (5)</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• MOQ Comparison (SVG)</li>
                  <li>• Timeline Comparison (SVG)</li>
                  <li>• Cost Transparency (SVG)</li>
                  <li>• Quality Process (SVG)</li>
                  <li>• Fair Pricing Model (SVG)</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-3">📸 Photos (15-20)</h3>
                <ul className="text-sm text-green-800 space-y-2">
                  <li>• Factory process stages</li>
                  <li>• Quality control stations</li>
                  <li>• Supplier portraits</li>
                  <li>• Worker team photos</li>
                  <li>• Production close-ups</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-semibold text-purple-900 mb-3">🎥 Videos (3-4)</h3>
                <ul className="text-sm text-purple-800 space-y-2">
                  <li>• 60s Factory Tour</li>
                  <li>• LoopTrace™ Demo (30s)</li>
                  <li>• Supplier Stories (90s)</li>
                  <li>• Customer Journey (2min)</li>
                </ul>
              </div>
            </div>

            <div className="pt-6">
              <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600">
                Start Content Creation
              </Button>
            </div>
          </section>
        </div>

        {/* Enhanced AI Assistant (Fixed Bottom Right) */}
        <EnhancedAIAssistant />

        <Footer />
      </div>
    </>
  );
}
