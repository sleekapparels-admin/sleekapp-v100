import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ExportButtonProps {
  data: Record<string, unknown>[];
  filename: string;
  headers: string[];
  label?: string;
}

export const ExportButton = ({ data, filename, headers, label = "Export CSV" }: ExportButtonProps) => {
  const [exporting, setExporting] = useState(false);

  const exportToCSV = () => {
    try {
      setExporting(true);

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header.toLowerCase().replace(' ', '_')];
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"` 
              : value || '';
          }).join(',')
        )
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Export successful");
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={exportToCSV}
      disabled={exporting || data.length === 0}
    >
      {exporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  );
};
