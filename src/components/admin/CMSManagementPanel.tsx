import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CMSContent {
  id: string;
  section: string;
  content_type: string;
  content: any;
  active: boolean;
  display_order: number;
}

export const CMSManagementPanel = () => {
  const [contents, setContents] = useState<CMSContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cms_content')
        .select('*')
        .order('section')
        .order('display_order');

      if (error) throw error;
      setContents((data || []).map(c => ({
        ...c,
        active: c.active ?? true,
        display_order: c.display_order ?? 0
      })));
    } catch (error: any) {
      toast.error(`Failed to load content: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cms_content')
        .update({
          content: editData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success("Content updated successfully");
      setEditing(null);
      fetchContents();
    } catch (error: any) {
      toast.error(`Failed to update content: ${error.message}`);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('cms_content')
        .update({ active: !active })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Content ${!active ? 'activated' : 'deactivated'}`);
      fetchContents();
    } catch (error: any) {
      toast.error(`Failed to update status: ${error.message}`);
    }
  };

  const groupedContents = contents.reduce((acc, content) => {
    if (!acc[content.section]) {
      acc[content.section] = [];
    }
    acc[content.section].push(content);
    return acc;
  }, {} as Record<string, CMSContent[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">CMS Management</h2>
          <p className="text-muted-foreground">Manage website content</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Content
        </Button>
      </div>

      <Tabs defaultValue={Object.keys(groupedContents)[0] || 'hero'}>
        <TabsList>
          {Object.keys(groupedContents).map((section) => (
            <TabsTrigger key={section} value={section} className="capitalize">
              {section.replace('_', ' ')}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(groupedContents).map(([section, items]) => (
          <TabsContent key={section} value={section} className="space-y-4">
            {items.map((content) => (
              <Card key={content.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="capitalize">{content.content_type.replace('_', ' ')}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Display Order: {content.display_order}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={content.active ? 'default' : 'secondary'}>
                        {content.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleActive(content.id, content.active)}
                      >
                        {content.active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {editing === content.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={JSON.stringify(editData, null, 2)}
                        onChange={(e) => {
                          try {
                            setEditData(JSON.parse(e.target.value));
                          } catch {}
                        }}
                        rows={10}
                        className="font-mono text-sm"
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => updateContent(content.id)} size="sm">
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={() => setEditing(null)} variant="outline" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <pre className="bg-secondary p-4 rounded-lg overflow-x-auto text-sm">
                        {JSON.stringify(content.content, null, 2)}
                      </pre>
                      <Button
                        onClick={() => {
                          setEditing(content.id);
                          setEditData(content.content);
                        }}
                        variant="outline"
                        size="sm"
                        className="mt-3"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
