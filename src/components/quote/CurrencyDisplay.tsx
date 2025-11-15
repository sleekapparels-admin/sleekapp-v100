import { useEffect, useState } from "react";
import { supabaseInjected as supabase } from "@/integrations/supabase/client.injected";
import { Loader2 } from "lucide-react";

interface CurrencyDisplayProps {
  usdAmount: number;
}

export const CurrencyDisplay = ({ usdAmount }: CurrencyDisplayProps) => {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRates() {
      try {
        const { data } = await supabase.functions.invoke('get-exchange-rates');
        if (data?.rates) {
          const rateMap: Record<string, number> = {};
          data.rates.forEach((r: any) => {
            rateMap[r.target_currency] = r.rate;
          });
          setRates(rateMap);
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        // Use fallback rates if API fails
        setRates({
          EUR: 0.92,
          CAD: 1.35,
          AUD: 1.52,
          GBP: 0.79,
          BDT: 119,
          USD: 1,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading exchange rates...</span>
      </div>
    );
  }

  return (
    <>
      <div className="text-4xl font-bold text-primary">
        ${usdAmount.toFixed(2)} USD
      </div>
      <div className="text-xs text-muted-foreground mt-2 space-y-0.5">
        <div>≈ €{(usdAmount * (rates.EUR || 0.92)).toFixed(2)} EUR</div>
        <div>≈ CA${(usdAmount * (rates.CAD || 1.35)).toFixed(2)} CAD</div>
        <div>≈ AU${(usdAmount * (rates.AUD || 1.52)).toFixed(2)} AUD</div>
        <div>≈ £{(usdAmount * (rates.GBP || 0.79)).toFixed(2)} GBP</div>
        <div>≈ ৳{(usdAmount * (rates.BDT || 119)).toFixed(0)} BDT</div>
      </div>
    </>
  );
};
