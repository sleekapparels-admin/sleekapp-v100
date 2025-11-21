import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CMSManagementPanel } from './CMSManagementPanel';
import { BlogEditor } from '@/components/blog/BlogEditor';
import { ProductDescriptionGenerator } from './ProductDescriptionGenerator';
import { FileText, Sparkles, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const EnhancedCMSPanel = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Content Management System</h2>
        <p className="text-muted-foreground">Manage all website content and AI-powered content generation</p>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">
            <FileText className="h-4 w-4 mr-2" />
            Website Content
          </TabsTrigger>
          <TabsTrigger value="blog">
            <FileText className="h-4 w-4 mr-2" />
            Blog Editor
          </TabsTrigger>
          <TabsTrigger value="products">
            <Package className="h-4 w-4 mr-2" />
            Product Descriptions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <CMSManagementPanel />
        </TabsContent>

        <TabsContent value="blog">
          <BlogEditor onSave={() => toast({ title: "Success", description: "Blog post saved" })} />
        </TabsContent>

        <TabsContent value="products">
          <ProductDescriptionGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
};