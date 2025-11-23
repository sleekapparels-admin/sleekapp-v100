import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Shirt, Zap, Users, Sparkles, LayoutGrid, FileText, Truck, Droplet, BookOpen, Factory, Building2, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import sleekLogo from "@/assets/sleek-logo.webp";

// Platform dropdown - Consolidate main platform features
const platformMenu = [
  {
    name: "LoopTrace™ Platform",
    href: "/looptrace-technology",
    description: "AI-powered instant quotes & real-time tracking",
    highlight: true,
    highlightColor: "primary",
    icon: Sparkles
  },
  {
    name: "Become a Supplier",
    href: "/become-supplier",
    description: "Partner with us & grow your manufacturing business",
    highlight: true,
    highlightColor: "green",
    icon: Factory
  },
  {
    name: "Why Sleek Apparels",
    href: "/why-sleek-apparels",
    description: "What makes us different",
    icon: Building2
  },
  {
    name: "Casualwear",
    href: "/casualwear",
    description: "T-shirts, hoodies, sweatshirts, joggers",
    icon: Shirt
  },
  {
    name: "Activewear",
    href: "/activewear",
    description: "Performance wear and athletic basics",
    icon: Zap
  },
  {
    name: "Team Uniforms",
    href: "/uniforms-teamwear",
    description: "Bulk orders for schools & teams",
    icon: Users
  },
  {
    name: "All Services",
    href: "/services",
    description: "Explore our full manufacturing capabilities",
    icon: LayoutGrid
  }
];

// Resources dropdown - Educational content for buyers & suppliers
const resourcesMenu = [
  {
    name: "Materials Guide",
    href: "/materials-guide",
    description: "Find the right fabric for your project",
    icon: Droplet,
    audience: "buyer"
  },
  {
    name: "First-Time Ordering",
    href: "/first-time-ordering",
    description: "Beginner's guide for new buyers",
    icon: BookOpen,
    audience: "buyer"
  },
  {
    name: "Sample Policy",
    href: "/sample-policy",
    description: "How sampling works with us",
    icon: FileText,
    audience: "buyer"
  },
  {
    name: "Shipping & Logistics",
    href: "/shipping-logistics",
    description: "International shipping information",
    icon: Truck,
    audience: "both"
  }
];

// Account dropdown menu for non-logged-in users
const accountMenu = [
  {
    name: "Create Account",
    href: "/signup",
    description: "Join our platform today",
    icon: UserPlus,
    primary: true
  },
  {
    name: "Become a Supplier",
    href: "/become-supplier",
    description: "Partner with us & grow your business",
    icon: Factory,
    highlight: true
  },
  {
    name: "Sign In",
    href: "/signup",
    description: "Access your dashboard",
    icon: LogIn
  },
  {
    name: "Contact Us",
    href: "/contact",
    description: "Get in touch with our team",
    icon: FileText
  }
];
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  useEffect(() => {
    const fetchUserRole = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        const {
          data
        } = await supabase.from('user_roles').select('role').eq('user_id', session.user.id).maybeSingle();
        setUserRole(data?.role || null);
      } else {
        setUserRole(null);
      }
    };
    fetchUserRole();
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const {
          data
        } = await supabase.from('user_roles').select('role').eq('user_id', session.user.id).maybeSingle();
        setUserRole(data?.role || null);
      } else {
        setUserRole(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  return <nav 
      className={`${isHome ? "fixed top-0 left-0 w-full bg-black/60 backdrop-blur-sm border-0" : "sticky top-0 bg-background/95 backdrop-blur-md border-b border-border shadow-sm"} z-50`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 rounded-none">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img 
              src={sleekLogo} 
              alt="Sleek Apparels" 
              className="h-9 w-9 sm:h-10 sm:w-10"
              width="40"
              height="40"
            />
            <span className={`text-lg sm:text-2xl font-bold whitespace-nowrap ${isHome ? "text-white drop-shadow-lg" : "text-foreground"}`}>
              Sleek Apparels
            </span>
          </Link>

          {/* Desktop Navigation - Clean & Simple */}
          <div className="hidden lg:flex items-center space-x-2">
            
            {/* Platform Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`h-9 px-4 text-sm font-medium ${isHome ? "!bg-transparent !text-white hover:!bg-white/10" : "!bg-transparent hover:!bg-muted"}`}>
                    Platform
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[420px] p-3 bg-background border border-border shadow-xl rounded-lg">
                      <div className="space-y-1">
                        {platformMenu.map(item => {
                          const isGreenHighlight = item.highlightColor === 'green';
                          const isPrimaryHighlight = item.highlightColor === 'primary';
                          
                          return (
                            <NavigationMenuLink key={item.name} asChild>
                              <Link 
                                to={item.href} 
                                className={`group flex items-start gap-3 rounded-lg p-3 hover:bg-accent transition-colors ${
                                  isPrimaryHighlight ? 'bg-primary/5 border border-primary/20' : 
                                  isGreenHighlight ? 'bg-green-500/5 border border-green-500/20' : ''
                                }`}
                              >
                                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                                  isPrimaryHighlight ? 'bg-primary text-white' : 
                                  isGreenHighlight ? 'bg-green-600 text-white' :
                                  'bg-primary/10 text-primary'
                                }`}>
                                  <item.icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="text-sm font-semibold flex items-center gap-2">
                                    {item.name}
                                    {isPrimaryHighlight && <span className="text-[10px] px-1.5 py-0.5 bg-primary text-white rounded-full">AI</span>}
                                    {isGreenHighlight && <span className="text-[10px] px-1.5 py-0.5 bg-green-600 text-white rounded-full">Partner</span>}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {item.description}
                                  </p>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          );
                        })}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Resources Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`h-9 px-4 text-sm font-medium ${isHome ? "!bg-transparent !text-white hover:!bg-white/10" : "!bg-transparent hover:!bg-muted"}`}>
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[380px] p-3 bg-background border border-border shadow-xl rounded-lg">
                      <div className="space-y-1">
                        {resourcesMenu.map(item => (
                          <NavigationMenuLink key={item.name} asChild>
                            <Link 
                              to={item.href} 
                              className="group flex items-start gap-3 rounded-lg p-3 hover:bg-accent transition-colors"
                            >
                              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                                <item.icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="text-sm font-semibold flex items-center gap-2">
                                  {item.name}
                                  {item.audience === "supplier" && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-green-500/10 text-green-600 rounded-full">For Suppliers</span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {item.description}
                                </p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            {/* Primary CTA - Get Quote */}
            <Button asChild variant={isHome ? "default" : "default"} size="sm" className={`ml-2 font-semibold ${isHome ? "bg-primary text-white hover:bg-primary/90 shadow-lg" : "bg-primary text-white hover:bg-primary/90"}`}>
              <Link to="/quote-generator">Get Quote</Link>
            </Button>

            {/* Account Menu or Dashboard */}
            {user ? (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={`h-9 px-3 text-sm font-medium ${isHome ? "!bg-transparent !text-white hover:!bg-white/10" : "!bg-transparent hover:!bg-muted"}`}>
                      <User className="mr-2 h-4 w-4" />
                      Account
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[280px] p-2 bg-background border border-border shadow-xl rounded-lg">
                        <div className="space-y-1">
                          <NavigationMenuLink asChild>
                            <button
                              onClick={() => navigate("/dashboard-router")}
                              className="w-full text-left flex items-center gap-3 rounded-lg p-3 hover:bg-accent transition-colors"
                            >
                              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                <User className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-semibold">Dashboard</div>
                                <p className="text-xs text-muted-foreground">View your account</p>
                              </div>
                            </button>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <button
                              onClick={async () => {
                                await supabase.auth.signOut();
                                navigate("/");
                              }}
                              className="w-full text-left flex items-center gap-3 rounded-lg p-3 hover:bg-accent transition-colors"
                            >
                              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center">
                                <LogOut className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-semibold">Sign Out</div>
                                <p className="text-xs text-muted-foreground">End your session</p>
                              </div>
                            </button>
                          </NavigationMenuLink>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={`h-9 px-3 text-sm font-medium ${isHome ? "!bg-transparent !text-white hover:!bg-white/10" : "!bg-transparent hover:!bg-muted"}`}>
                      <User className="mr-2 h-4 w-4" />
                      Account
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[280px] p-2 bg-background border border-border shadow-xl rounded-lg">
                        <div className="space-y-1">
                          {accountMenu.map(item => (
                            <NavigationMenuLink key={item.name} asChild>
                              <Link 
                                to={item.href} 
                                className={`group flex items-start gap-3 rounded-lg p-3 hover:bg-accent transition-colors ${
                                  item.primary ? 'bg-primary/5 border border-primary/20' : 
                                  item.highlight ? 'bg-green-500/5 border border-green-500/20' : ''
                                }`}
                              >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                                  item.primary ? 'bg-primary text-white' : 
                                  item.highlight ? 'bg-green-600 text-white' :
                                  'bg-primary/10 text-primary'
                                }`}>
                                  <item.icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-semibold flex items-center gap-2">
                                    {item.name}
                                    {item.highlight && <span className="text-[10px] px-1.5 py-0.5 bg-green-600 text-white rounded-full">Partner</span>}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {item.description}
                                  </p>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className={`lg:hidden p-2 rounded-md transition-colors ${isHome ? "text-white hover:bg-white/10" : "text-foreground hover:bg-muted"}`} aria-label="Toggle menu">
            {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && <div className="lg:hidden animate-slide-in border-t border-border shadow-2xl relative overflow-hidden">
          {/* Video Background for Mobile Menu (only on homepage) */}
          {isHome && (
            <div className="absolute inset-0 z-0">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover opacity-30"
              >
                <source src="/videos/homepage-hero.webm" type="video/webm" />
              </video>
              <div className="absolute inset-0 bg-background/95 backdrop-blur-xl"></div>
            </div>
          )}
          {!isHome && <div className="absolute inset-0 bg-background/98 backdrop-blur-xl"></div>}
          <div className="px-3 pt-3 pb-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto relative z-10">
            
            {/* Platform Section */}
            <div className="pt-2">
              <p className="px-4 py-2 text-xs font-semibold text-foreground/70 uppercase tracking-wide">Platform</p>
              {platformMenu.map(item => {
                const isGreenHighlight = item.highlightColor === 'green';
                const isPrimaryHighlight = item.highlightColor === 'primary';
                
                return (
                  <Link key={item.name} to={item.href} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all text-foreground hover:bg-primary/10">
                    <item.icon className={`h-4 w-4 ${isGreenHighlight ? 'text-green-600' : 'text-primary'}`} />
                    {item.name}
                    {isPrimaryHighlight && <span className="text-[9px] px-1.5 py-0.5 bg-primary text-white rounded-full ml-auto">AI</span>}
                    {isGreenHighlight && <span className="text-[9px] px-1.5 py-0.5 bg-green-600 text-white rounded-full ml-auto">Partner</span>}
                  </Link>
                );
              })}
            </div>

            {/* Resources Section */}
            <div className="pt-2">
              <p className="px-4 py-2 text-xs font-semibold text-foreground/70 uppercase tracking-wide">Resources</p>
              {resourcesMenu.map(item => <Link key={item.name} to={item.href} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all text-foreground hover:bg-primary/10">
                  <item.icon className="h-4 w-4 text-blue-600" />
                  {item.name}
                </Link>)}
            </div>
            
            {/* Primary CTA */}
            <Button asChild variant="default" className="w-full mt-3 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg">
              <Link to="/quote-generator" onClick={() => setIsOpen(false)}>
                Get Instant Quote
              </Link>
            </Button>
            
            {user ? <>
                <Button onClick={() => {
                  navigate("/dashboard-router");
                  setIsOpen(false);
                }} variant="outline" className="w-full mt-2">
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button 
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setIsOpen(false);
                    navigate("/");
                  }} 
                  variant="ghost" 
                  className="w-full mt-2"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </> : <>
                <Button onClick={() => {
                  navigate("/signup");
                  setIsOpen(false);
                }} variant="default" className="w-full mt-2 bg-primary hover:bg-primary/90 text-white font-semibold">
                  Create Account
                </Button>
                <Button onClick={() => {
                  navigate("/signup");
                  setIsOpen(false);
                }} variant="outline" className="w-full mt-2">
                  Sign In
                </Button>
              </>}
          </div>
        </div>}
    </nav>;
};