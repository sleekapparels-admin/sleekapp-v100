import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  BarChart3, 
  FileText, 
  Settings,
  ShoppingCart,
  Factory,
  TrendingUp
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
  { icon: Factory, label: "Supplier Orders", path: "/admin/supplier-orders" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: Users, label: "Suppliers", path: "/admin/suppliers" },
  { icon: FileText, label: "Quotes", path: "/admin/quotes" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: TrendingUp, label: "Leads", path: "/admin/leads" },
  { icon: FileText, label: "Blog", path: "/admin/blog" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex w-64 flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-border bg-card">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h2 className="text-lg font-semibold">Admin Panel</h2>
            </div>
            <ScrollArea className="mt-5 flex-1">
              <nav className="space-y-1 px-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Button
                      key={item.path}
                      variant={isActive ? "secondary" : "ghost"}
                      className={`w-full justify-start ${
                        isActive ? "bg-primary/10 text-primary" : ""
                      }`}
                      onClick={() => navigate(item.path)}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};
