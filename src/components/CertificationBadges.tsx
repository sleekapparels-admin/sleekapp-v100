import { Shield, Award, Leaf, Users, CheckCircle2, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const iconMap: Record<string, any> = {
  Shield,
  Award,
  Leaf,
  Users,
  CheckCircle2,
};

export const CertificationBadges = () => {
  const { data: certifications, isLoading } = useQuery({
    queryKey: ["certifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .eq("active", true)
        .order("display_order");
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {certifications?.map((cert) => {
        const Icon = iconMap[cert.icon_name] || Shield;
        const statusLabel = cert.status === 'certified' ? 'Certified' : 
                          cert.status === 'in_progress' ? 'In Progress' : 'Committed';
        const statusColor = cert.status === 'certified' ? 'bg-emerald-500' : 
                           cert.status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-500';
        
        return (
          <div
            key={cert.id}
            className="flex flex-col items-center text-center p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all hover:-translate-y-1 relative"
          >
            <Badge className={`absolute top-2 right-2 text-xs ${statusColor}`}>
              {statusLabel}
            </Badge>
            <div className={`${cert.bg_color_class} p-3 rounded-full mb-3`}>
              <Icon className={`h-8 w-8 ${cert.color_class}`} />
            </div>
            <div className="font-semibold text-sm">{cert.name}</div>
            <div className="text-xs text-muted-foreground">{cert.description}</div>
            {cert.issuing_body && (
              <div className="text-xs text-muted-foreground mt-1 opacity-70">
                {cert.issuing_body}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};