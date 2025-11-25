/**
 * User Type Selection Page
 * First step in signup flow - user selects their type
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Factory, ArrowRight, Check } from 'lucide-react';
import { trackCTAClick } from '@/lib/analyticsTracking';

export default function UserTypeSelection() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleSelection = (userType: 'customer' | 'production_partner') => {
    trackCTAClick(`user_type_selected_${userType}`, 'user_type_selection_page');
    navigate(`/auth?type=${userType}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to Sleek Apparels
          </h1>
          <p className="text-xl text-muted-foreground">
            First, tell us what brings you here today
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Card */}
          <Card 
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl ${
              hoveredCard === 'customer' ? 'scale-105 border-primary' : ''
            }`}
            onMouseEnter={() => setHoveredCard('customer')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleSelection('customer')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl">I Need Custom Apparel</CardTitle>
              <CardDescription className="text-base">
                For my brand, school, team, or business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Fashion Brands & Clothing Lines</p>
                    <p className="text-xs text-muted-foreground">Start or scale your apparel brand</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Retail & E-commerce Stores</p>
                    <p className="text-xs text-muted-foreground">Private label for your business</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Schools & Educational Institutions</p>
                    <p className="text-xs text-muted-foreground">Uniforms and team apparel</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Corporates & Businesses</p>
                    <p className="text-xs text-muted-foreground">Company uniforms and branded apparel</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Sports Teams & Clubs</p>
                    <p className="text-xs text-muted-foreground">Custom team uniforms and gear</p>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full mt-6" 
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelection('customer');
                }}
              >
                Continue as Customer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>

          {/* Production Partner Card */}
          <Card 
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl ${
              hoveredCard === 'production_partner' ? 'scale-105 border-green-500' : ''
            }`}
            onMouseEnter={() => setHoveredCard('production_partner')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleSelection('production_partner')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Factory className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl">I'm a Production Partner</CardTitle>
              <CardDescription className="text-base">
                Ready to manufacture for others
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Garment Manufacturers</p>
                    <p className="text-xs text-muted-foreground">Finished product manufacturing (cut & sew)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Fabric & Textile Suppliers</p>
                    <p className="text-xs text-muted-foreground">Raw material supply for production</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Trims & Accessories</p>
                    <p className="text-xs text-muted-foreground">Labels, buttons, zippers, packaging</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Raw Materials Suppliers</p>
                    <p className="text-xs text-muted-foreground">Threads, elastic, interfacing, etc.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Other Production Services</p>
                    <p className="text-xs text-muted-foreground">Printing, embroidery, finishing</p>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full mt-6 bg-green-600 hover:bg-green-700" 
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelection('production_partner');
                }}
              >
                Continue as Production Partner
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto font-semibold"
              onClick={() => navigate('/auth')}
            >
              Sign in here
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
