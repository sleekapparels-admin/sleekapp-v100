import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DualEntityFooter } from "@/components/DualEntityFooter";
import { BusinessHours } from "@/components/BusinessHours";

export const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold bg-gradient-hero bg-clip-text text-transparent">
              Sleek Apparels
            </h3>
            <p className="text-sm text-muted-foreground">
              Sustainable Apparel. Redefined.
            </p>
            <p className="text-sm text-muted-foreground">
              Precision knitwear manufacturing from Bangladesh, serving global brands with transparency and quality.
            </p>
          </div>

          {/* Quick Links - Products */}
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/knitwear" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Knitwear Manufacturing
                </Link>
              </li>
              <li>
                <Link to="/cut-and-sew" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cut & Sew Production
                </Link>
              </li>
              <li>
                <Link to="/uniforms-teamwear" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Uniforms & Teamwear
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  All Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/materials-guide" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Materials Guide
                </Link>
              </li>
              <li>
                <Link to="/shipping-logistics" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Shipping & Logistics
                </Link>
              </li>
              <li>
                <Link to="/sample-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sample Policy
                </Link>
              </li>
              <li>
                <Link to="/first-time-ordering" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  First-Time Ordering Guide
                </Link>
              </li>
              <li>
                <Link to="/looptrace-technology" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  LoopTrace™ Technology
                </Link>
              </li>
              <li>
                <Link to="/sustainability" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/why-sleek-apparels" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Why Choose Us
                </Link>
              </li>
              <li>
                <Link to="/our-story" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>01, Road 19A, Sector 04, Uttara,</p>
                  <p>Dhaka 1230, Bangladesh</p>
                </div>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:inquiry@sleekapparels.com" className="hover:text-primary transition-colors">
                  inquiry@sleekapparels.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+8801861011367" className="hover:text-primary transition-colors">
                  +880-186-1011-367
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4 flex-shrink-0" />
                <a 
                  href="https://wa.me/8801861011367" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  WhatsApp Inquiry
                </a>
              </li>
            </ul>
            
            {/* Business Hours */}
            <div className="mt-6 pt-6 border-t border-border">
              <BusinessHours variant="compact" />
            </div>
            
            <div className="flex gap-3 mt-4">
              <a 
                href="https://www.linkedin.com/company/sleekapparels-bangladesh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Sleek Apparels Company LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/sleekapparels" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Sleek Apparels Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Dual Entity Information */}
        <DualEntityFooter />
        
        <div className="mt-6 text-center">
          <Button asChild variant="gold" size="sm">
            <Link to="/contact">Start Your Project</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
};
