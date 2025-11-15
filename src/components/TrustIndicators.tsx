import { Shield, Award, Leaf, Users, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";

const iconMap: Record<string, any> = {
  Shield,
  Award,
  Leaf,
  Users,
};

export const TrustIndicators = () => {
  const { data: certifications, isLoading } = useQuery({
    queryKey: ["certifications-trust"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .eq("active", true)
        .order("display_order")
        .limit(4);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">Certified & Verified Compliance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {certifications?.map((cert) => {
            const Icon = iconMap[cert.icon_name] || Shield;
            return (
            <div key={cert.id} className="text-center group hover:scale-105 transition-transform">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${cert.bg_color_class} mb-4 group-hover:shadow-lg transition-all`}>
                <Icon className={`w-8 h-8 ${cert.color_class}`} />
              </div>
              <h3 className="font-semibold text-sm mb-1">{cert.name}</h3>
              <p className="text-xs text-muted-foreground">{cert.description}</p>
            </div>
          );
          })}
        </div>
      </div>
    </section>
  );
};