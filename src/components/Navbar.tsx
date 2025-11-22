import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, ChevronDown, Heart, LogOut, Shirt, Zap, Users, Sparkles, LayoutGrid, FileText, Truck, Droplet, BookOpen, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationBell } from "@/components/NotificationBell";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { supabase } from "@/integrations/supabase/client";
import { roleHelpers } from "@/lib/supabaseHelpers";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useWishlistContext } from "@/contexts/WishlistContext";
import sleekLogo from "@/assets/sleek-logo.webp";
const servicesMenu = [{
  name: "Casualwear",
  href: "/casualwear",
  description: "T-shirts, hoodies, sweatshirts, joggers",
  icon: Shirt
}, {
  name: "Activewear",
  href: "/activewear",
  description: "Performance wear and athletic basics",
  icon: Zap
}, {
  name: "Team Uniforms",
  href: "/uniforms-teamwear",
  description: "Bulk orders for schools & teams",
  icon: Users
}, {
  name: "LoopTrace™ Platform",
  href: "/looptrace-technology",
  description: "AI-powered instant quotes & production tracking with full transparency",
  highlight: true,
  icon: Sparkles
}, {
  name: "View All Services",
  href: "/services",
  description: "Explore our full capabilities",
  icon: LayoutGrid
}];

const resourcesMenuNew = [{
  name: "Materials Guide",
  href: "/materials-guide",
  description: "Find the right fabric for your project",
  icon: Droplet
}, {
  name: "Shipping & Logistics",
  href: "/shipping-logistics",
  description: "International shipping information",
  icon: Truck
}, {
  name: "Sample Policy",
  href: "/sample-policy",
  description: "How sampling works with us",
  icon: FileText
}, {
  name: "First-Time Ordering",
  href: "/first-time-ordering",
  description: "Beginner's guide to ordering",
  icon: BookOpen
}];

const resourcesMenu = [{
  name: "Portfolio Gallery",
  href: "/portfolio",
  description: "View our past work & client projects"
}, {
  name: "Quote History",
  href: "/quote-history",
  description: "View & compare your past quotes"
}, {
  name: "Our Story",
  href: "/our-story",
  description: "Learn about our journey & values"
}, {
  name: "Blog & Insights",
  href: "/blog",
  description: "Industry news & manufacturing tips"
}, {
  name: "Contact Us",
  href: "/contact",
  description: "Get in touch with our team"
}];
const navigation: { name: string; href: string }[] = [];
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const { wishlistCount } = useWishlistContext();
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link to="/why-sleek-apparels" className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${isHome ? "text-white hover:bg-white/10" : "text-foreground hover:bg-muted"}`}>
              Why Choose Us
            </Link>
            {navigation.map(item => <Link key={item.name} to={item.href} className={`px-2 xl:px-3 py-2 rounded-md text-xs xl:text-sm font-medium transition-all duration-200 ${isHome ? location.pathname === item.href ? "text-white bg-white/20 backdrop-blur drop-shadow-md" : "text-white/90 hover:text-white hover:bg-white/10 drop-shadow-md" : location.pathname === item.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                {item.name}
              </Link>)}
            
            {/* Services Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`!h-10 px-2 xl:px-3 rounded-md text-xs xl:text-sm font-medium transition-all duration-200 appearance-none !border-none !shadow-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 ${isHome ? "!bg-primary !text-white hover:!bg-primary/90 data-[state=open]:!bg-primary/80" : "!bg-primary !text-white hover:!bg-primary/90 data-[state=open]:!bg-primary/80"}`}>
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[420px] p-2 bg-gradient-to-br from-background via-background to-primary/5 backdrop-blur-xl border border-border/50 shadow-2xl rounded-lg">
                      <div className="p-3 border-b border-border/50 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-t-md">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <LayoutGrid className="h-4 w-4 text-primary" />
                          Our Services
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">Explore what we can do for you</p>
                      </div>
                      <ul className="flex flex-col gap-1 p-2">
                        {servicesMenu.map(item => <li key={item.name}>
                            <NavigationMenuLink asChild>
                              <Link to={item.href} className={`group block select-none rounded-lg p-3 leading-none no-underline outline-none transition-all duration-200 ${item.highlight ? 'bg-gradient-to-r from-primary/15 to-purple-500/15 hover:from-primary/25 hover:to-purple-500/25 border border-primary/20 hover:border-primary/30 shadow-sm hover:shadow-md' : 'hover:bg-accent/50 hover:shadow-sm'}`}>
                                <div className="flex items-start gap-3">
                                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${item.highlight ? 'bg-gradient-to-br from-primary to-purple-600 shadow-md group-hover:shadow-lg group-hover:scale-110' : 'bg-primary/10 group-hover:bg-primary/20'}`}>
                                    <item.icon className={`h-5 w-5 ${item.highlight ? 'text-white' : 'text-primary'}`} />
                                  </div>
                                  <div className="flex-1 space-y-1">
                                    <div className="text-sm font-semibold leading-none flex items-center gap-2 text-foreground group-hover:text-primary transition-colors">
                                      {item.name}
                                      {item.highlight && <span className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full font-bold shadow-sm animate-pulse">NEW</span>}
                                    </div>
                                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
                                      {item.description}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>)}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Resources Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`!h-10 px-2 xl:px-3 rounded-md text-xs xl:text-sm font-medium transition-all duration-200 appearance-none !border-none !shadow-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 ${isHome ? "!bg-primary !text-white hover:!bg-primary/90 data-[state=open]:!bg-primary/80" : "!bg-primary !text-white hover:!bg-primary/90 data-[state=open]:!bg-primary/80"}`}>
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-2 bg-gradient-to-br from-background via-background to-blue-500/5 backdrop-blur-xl border border-border/50 shadow-2xl rounded-lg">
                      <div className="p-3 border-b border-border/50 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-t-md">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          Resources & Guides
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">Everything you need to know</p>
                      </div>
                      <ul className="flex flex-col gap-1 p-2">
                        {resourcesMenuNew.map(item => <li key={item.name}>
                            <NavigationMenuLink asChild>
                              <Link to={item.href} className="group block select-none rounded-lg p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-accent/50 hover:shadow-sm">
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                                    <item.icon className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div className="flex-1 space-y-1">
                                    <div className="text-sm font-semibold leading-none text-foreground group-hover:text-blue-600 transition-colors">
                                      {item.name}
                                    </div>
                                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
                                      {item.description}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>)}
                        <li className="pt-2 border-t border-border/50 mt-1">
                          <Link to="/portfolio" className="group block select-none rounded-lg p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:shadow-sm">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                                <Image className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="text-sm font-semibold leading-none text-foreground group-hover:text-blue-600 transition-colors">
                                  Portfolio & More
                                </div>
                                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
                                  View our work and additional resources
                                </p>
                              </div>
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {userRole !== 'supplier' && <Button asChild variant={isHome ? "outline" : "default"} size="sm" className={`ml-2 font-semibold ${isHome ? "border-white text-white hover:bg-white/20 bg-white/10 backdrop-blur-sm" : "bg-accent hover:bg-accent/90 text-accent-foreground"}`}>
                <Link to="/get-started">Start Your Project</Link>
              </Button>}

            {user ? <>
                <NotificationBell className={`relative ${isHome ? "text-white hover:bg-white/10" : ""}`} />
                <Button onClick={() => navigate("/dashboard-router")} variant="outline" size="sm" className={`ml-2 ${isHome ? "border-white text-white hover:bg-white/20 bg-white/10 backdrop-blur-sm drop-shadow-sm" : ""}`}>
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button 
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate("/");
                  }} 
                  variant="ghost" 
                  size="sm" 
                  className={`ml-2 ${isHome ? "text-white hover:bg-white/20" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </> : <>
                <Button onClick={() => navigate("/auth")} variant="outline" size="sm" className={`ml-2 ${isHome ? "border-white text-white hover:bg-white/20 bg-white/10 backdrop-blur-sm drop-shadow-sm" : ""}`}>
                  Sign In
                </Button>
              </>}
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
            {navigation.map(item => <Link key={item.name} to={item.href} onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${location.pathname === item.href ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground hover:bg-primary/10 active:scale-95"}`}>
                {item.name}
              </Link>)}
            
            {/* Services Section */}
            <div className="pt-2">
              <p className="px-4 py-2 text-xs font-semibold text-foreground/70 uppercase tracking-wide">Services</p>
              {servicesMenu.map(item => <Link key={item.name} to={item.href} onClick={() => setIsOpen(false)} className="block px-4 py-2 rounded-lg text-sm transition-all text-foreground hover:bg-primary/10">
                  {item.name}
                </Link>)}
            </div>

            {/* Resources Section */}
            <div className="pt-2">
              <p className="px-4 py-2 text-xs font-semibold text-foreground/70 uppercase tracking-wide">Resources</p>
              {resourcesMenu.filter(item => userRole !== 'supplier' || item.name !== 'Portfolio Gallery').map(item => <Link key={item.name} to={item.href} onClick={() => setIsOpen(false)} className="block px-4 py-2 rounded-lg text-sm transition-all text-foreground hover:bg-primary/10">
                  {item.name}
                </Link>)}
              <Link to="/wishlist" className="flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all text-foreground hover:bg-primary/10" onClick={() => setIsOpen(false)}>
                <span>My Wishlist</span>
                {wishlistCount > 0 && (
                  <Badge className="ml-2 bg-primary text-xs">{wishlistCount}</Badge>
                )}
              </Link>
            </div>

            {userRole !== 'supplier' && <Button asChild variant="default" className="w-full mt-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-sm">
                <Link to="/get-started" onClick={() => setIsOpen(false)}>
                  Start Your Project
                </Link>
              </Button>}
            {user ? <>
                <div className="flex justify-center mt-2">
                  <NotificationBell />
                </div>
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
            navigate("/auth");
            setIsOpen(false);
          }} variant="outline" className="w-full mt-2">
                  Sign In
                </Button>
              </>}
          </div>
        </div>}
    </nav>;
};