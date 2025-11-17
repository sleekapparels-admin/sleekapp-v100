import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2, MapPin, Mail, Phone } from "lucide-react";

export const DualEntityFooter = () => {
  const { data: companies } = useQuery({
    queryKey: ["company-info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_info")
        .select("*")
        .eq("active", true)
        .order("display_order");
      
      if (error) throw error;
      return data;
    },
  });

  const usEntity = companies?.find(c => c.entity_type === 'us_llc');
  const bdEntity = companies?.find(c => c.entity_type === 'bangladesh');

  return (
    <div className="border-t border-border/40 mt-8 pt-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* US Entity */}
        {usEntity && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Building2 className="h-4 w-4 text-primary" />
              <span>Global Office</span>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{usEntity.legal_name}</p>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>{usEntity.address}</p>
                  {usEntity.city && usEntity.state && usEntity.zip_code && (
                    <p>{usEntity.city}, {usEntity.state} {usEntity.zip_code}</p>
                  )}
                </div>
              </div>
              {usEntity.registration_number && (
                <p className="text-xs">LLC Reg: {usEntity.registration_number}</p>
              )}
              {usEntity.tax_id && (
                <p className="text-xs">EIN: {usEntity.tax_id}</p>
              )}
              <div className="pt-2 text-xs space-y-1">
                <p>🇺🇸 US-based support & customer service</p>
                <p>💳 Easy payments via Stripe & ACH transfer</p>
                <p>📞 English-first communication</p>
              </div>
            </div>
          </div>
        )}

        {/* Bangladesh Entity */}
        {bdEntity && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Building2 className="h-4 w-4 text-primary" />
              <span>Manufacturing Operations</span>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{bdEntity.legal_name}</p>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>114/3, Khapara Rd, Tongi</p>
                  <p>Gazipur 1712, Dhaka, Bangladesh</p>
                </div>
              </div>
              {bdEntity.registration_number && (
                <p className="text-xs">Incorporation: {bdEntity.registration_number}</p>
              )}
              {bdEntity.tax_id && (
                <p className="text-xs">BIN: {bdEntity.tax_id}</p>
              )}
              <div className="pt-2 text-xs space-y-1">
                <p>🇧🇩 Premium manufacturing at competitive rates</p>
                <p>✅ On-ground quality control</p>
                <p>🏭 Vetted supplier network</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
        <p className="mb-2 font-medium text-foreground">American-Managed, Bangladesh-Manufactured</p>
        <p>© {new Date().getFullYear()} {usEntity?.legal_name || 'Sleek Apparels LLC'} & {bdEntity?.legal_name || 'Sleek Apparels'}. All rights reserved.</p>
        <p className="mt-2">
          <span className="inline-block mx-2">Terms of Service</span>
          <span className="inline-block mx-2">•</span>
          <span className="inline-block mx-2">Privacy Policy</span>
          <span className="inline-block mx-2">•</span>
          <span className="inline-block mx-2">Payment Terms</span>
        </p>
      </div>
    </div>
  );
};
