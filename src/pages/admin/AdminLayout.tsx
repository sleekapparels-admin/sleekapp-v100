import { useNavigate, Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="flex h-screen pt-16">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <RouteErrorBoundary 
            fallbackTitle="Admin Section Error"
            fallbackDescription="The admin section encountered an error. Please try reloading."
          >
            <Outlet />
          </RouteErrorBoundary>
        </main>
      </div>
      <Footer />
    </>
  );
}
