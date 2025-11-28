import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, BookOpen, Lightbulb, TrendingUp } from "lucide-react";

export const NoBlogPosts = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Card className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border-purple-100 shadow-lg">
        <CardContent className="p-8 md:p-12">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full shadow-lg">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
            Blog Coming Soon!
          </h2>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-center text-gray-700 mb-8 max-w-2xl mx-auto">
            We're preparing insightful articles on apparel manufacturing, sustainable fashion, 
            startup guides, and industry trends. Subscribe to get notified when we launch.
          </p>

          {/* Newsletter Signup */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                aria-label="Email address"
              />
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md"
              >
                Notify Me
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-3 text-center">
              Join 500+ apparel entrepreneurs getting our updates. Unsubscribe anytime.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-purple-200 my-8"></div>

          {/* What to Expect */}
          <div className="mb-8">
            <p className="text-center text-sm font-semibold text-gray-700 mb-4">
              What to Expect:
            </p>
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="flex flex-col items-center text-center p-4 bg-white/70 rounded-lg">
                <Lightbulb className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-sm mb-1">Expert Insights</h3>
                <p className="text-xs text-gray-600">Manufacturing tips & industry best practices</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white/70 rounded-lg">
                <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-sm mb-1">Market Trends</h3>
                <p className="text-xs text-gray-600">Latest fashion & textile industry updates</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white/70 rounded-lg">
                <Calendar className="h-8 w-8 text-indigo-600 mb-2" />
                <h3 className="font-semibold text-sm mb-1">Startup Guides</h3>
                <p className="text-xs text-gray-600">Step-by-step brand building resources</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-purple-200 my-8"></div>

          {/* Alternative Resources */}
          <div>
            <p className="text-center text-sm font-semibold text-gray-700 mb-4">
              While you wait, explore these resources:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" asChild className="border-purple-300 hover:bg-purple-50">
                <Link to="/for-startups">
                  Startup Guide
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="border-blue-300 hover:bg-blue-50">
                <Link to="/tech-pack-services">
                  Tech Pack Resources
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="border-indigo-300 hover:bg-indigo-50">
                <Link to="/samples">
                  Sample Program
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="border-purple-300 hover:bg-purple-50">
                <Link to="/pricing">
                  Pricing Calculator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
