import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted/20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1 - About */}
          <div>
            <h3 className="font-heading font-semibold text-h4-mobile mb-4">
              Sleek Apparels
            </h3>
            <p className="text-body-sm text-muted-foreground mb-4">
              Premium custom apparel manufacturing from Bangladesh
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.linkedin.com/company/sleek-apparels-limited" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2 - Services */}
          <div>
            <h3 className="font-heading font-semibold text-body mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-body-sm text-muted-foreground hover:text-primary transition-colors">
                  Casualwear Manufacturing
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-body-sm text-muted-foreground hover:text-primary transition-colors">
                  Activewear & Joggers
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-body-sm text-muted-foreground hover:text-primary transition-colors">
                  Uniforms & Teamwear
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-body-sm text-muted-foreground hover:text-primary transition-colors">
                  Cut & Sew Production
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Resources */}
          <div>
            <h3 className="font-heading font-semibold text-body mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-body-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/capabilities" className="text-body-sm text-muted-foreground hover:text-primary transition-colors">
                  Capabilities
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-body-sm text-muted-foreground hover:text-primary transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-body-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-body-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="font-heading font-semibold text-body mb-4">
              Contact
            </h3>
            <ul className="space-y-2 text-body-sm text-muted-foreground">
              <li>
                <a href="mailto:inquiry@sleekapparels.com" className="hover:text-primary transition-colors">
                  inquiry@sleekapparels.com
                </a>
              </li>
              <li>
                <a href="tel:+8801861011367" className="hover:text-primary transition-colors">
                  +880-186-1011-367
                </a>
              </li>
              <li className="pt-2">
                01, Road 19A, Sector 04<br />
                Uttara, Dhaka 1230<br />
                Bangladesh
              </li>
              <li className="pt-2">
                Business Hours:<br />
                9 AM - 6 PM (GMT+6)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-body-sm text-muted-foreground">
            © 2024 Sleek Apparels Limited. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-body-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-body-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
