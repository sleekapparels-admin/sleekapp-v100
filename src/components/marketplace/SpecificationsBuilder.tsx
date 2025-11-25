import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Specification {
  id: string;
  key: string;
  value: string;
  unit?: string;
}

interface SpecificationsBuilderProps {
  specifications: Record<string, any>;
  onChange: (specs: Record<string, any>) => void;
  disabled?: boolean;
}

// Common specification templates by category
const SPEC_TEMPLATES = {
  fabric: [
    { key: 'Material', placeholder: 'e.g., 100% Cotton', unit: '' },
    { key: 'Weight', placeholder: 'e.g., 180', unit: 'GSM' },
    { key: 'Width', placeholder: 'e.g., 60', unit: 'inches' },
    { key: 'Construction', placeholder: 'e.g., Plain Weave', unit: '' },
    { key: 'Finish', placeholder: 'e.g., Brushed, Mercerized', unit: '' },
    { key: 'Shrinkage', placeholder: 'e.g., 3', unit: '%' },
    { key: 'Color Fastness', placeholder: 'e.g., Grade 4', unit: '' },
  ],
  garment: [
    { key: 'Fabric Type', placeholder: 'e.g., Jersey, Fleece', unit: '' },
    { key: 'GSM', placeholder: 'e.g., 200', unit: 'GSM' },
    { key: 'Size Range', placeholder: 'e.g., S to XXL', unit: '' },
    { key: 'Fit', placeholder: 'e.g., Regular, Slim, Oversized', unit: '' },
    { key: 'Neck Type', placeholder: 'e.g., Round, V-Neck', unit: '' },
    { key: 'Sleeve Length', placeholder: 'e.g., Short, Long', unit: '' },
    { key: 'Printing', placeholder: 'e.g., Screen, Digital', unit: '' },
  ],
  yarn: [
    { key: 'Count', placeholder: 'e.g., 30s', unit: 'Ne' },
    { key: 'Ply', placeholder: 'e.g., Single, 2-Ply', unit: '' },
    { key: 'Twist', placeholder: 'e.g., S-Twist, Z-Twist', unit: '' },
    { key: 'Strength', placeholder: 'e.g., 2400', unit: 'g/tex' },
    { key: 'Elongation', placeholder: 'e.g., 5', unit: '%' },
    { key: 'Evenness', placeholder: 'e.g., CV 12%', unit: '' },
  ],
  dyeing: [
    { key: 'Dye Type', placeholder: 'e.g., Reactive, Disperse', unit: '' },
    { key: 'Color Matching', placeholder: 'e.g., 95% accuracy', unit: '' },
    { key: 'Fastness to Wash', placeholder: 'e.g., Grade 4-5', unit: '' },
    { key: 'Fastness to Light', placeholder: 'e.g., Grade 4', unit: '' },
    { key: 'Processing Time', placeholder: 'e.g., 3-5', unit: 'days' },
  ],
};

const COMMON_UNITS = ['', 'GSM', 'inches', 'cm', 'kg', 'meters', 'yards', '%', 'pcs', 'days'];

export function SpecificationsBuilder({
  specifications,
  onChange,
  disabled = false,
}: SpecificationsBuilderProps) {
  const [specs, setSpecs] = useState<Specification[]>(() => {
    // Convert existing specifications object to array format
    return Object.entries(specifications).map(([key, value]) => ({
      id: `spec-${Date.now()}-${Math.random()}`,
      key,
      value: typeof value === 'object' && value.value ? value.value : String(value),
      unit: typeof value === 'object' && value.unit ? value.unit : '',
    }));
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const updateSpecifications = (newSpecs: Specification[]) => {
    setSpecs(newSpecs);
    // Convert array back to object format
    const specsObject: Record<string, any> = {};
    newSpecs.forEach((spec) => {
      if (spec.key) {
        specsObject[spec.key] = spec.unit
          ? { value: spec.value, unit: spec.unit }
          : spec.value;
      }
    });
    onChange(specsObject);
  };

  const addSpecification = (key = '', value = '', unit = '') => {
    const newSpec: Specification = {
      id: `spec-${Date.now()}-${Math.random()}`,
      key,
      value,
      unit,
    };
    updateSpecifications([...specs, newSpec]);
  };

  const updateSpec = (id: string, field: keyof Specification, value: string) => {
    updateSpecifications(specs.map((spec) => (spec.id === id ? { ...spec, [field]: value } : spec)));
  };

  const removeSpec = (id: string) => {
    updateSpecifications(specs.filter((spec) => spec.id !== id));
  };

  const applyTemplate = (templateKey: string) => {
    const template = SPEC_TEMPLATES[templateKey as keyof typeof SPEC_TEMPLATES];
    if (template) {
      const newSpecs = template.map((t) => ({
        id: `spec-${Date.now()}-${Math.random()}`,
        key: t.key,
        value: '',
        unit: t.unit,
      }));
      updateSpecifications([...specs, ...newSpecs]);
    }
    setSelectedTemplate('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">Product Specifications</Label>
        <div className="flex items-center gap-2">
          <Select value={selectedTemplate} onValueChange={applyTemplate} disabled={disabled}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Use template..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fabric">Fabric Template</SelectItem>
              <SelectItem value="garment">Garment Template</SelectItem>
              <SelectItem value="yarn">Yarn Template</SelectItem>
              <SelectItem value="dyeing">Dyeing Template</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={() => addSpecification()}
            size="sm"
            variant="outline"
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Spec
          </Button>
        </div>
      </div>

      {specs.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p>No specifications added yet.</p>
          <p className="text-sm mt-2">Click "Add Spec" or use a template to get started.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {specs.map((spec, index) => (
              <motion.div
                key={spec.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-2 cursor-move text-muted-foreground">
                      <GripVertical className="h-5 w-5" />
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Specification Key */}
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          Specification Name
                        </Label>
                        <Input
                          placeholder="e.g., Material, Weight, GSM"
                          value={spec.key}
                          onChange={(e) => updateSpec(spec.id, 'key', e.target.value)}
                          disabled={disabled}
                        />
                      </div>

                      {/* Specification Value */}
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Value</Label>
                        <Input
                          placeholder="e.g., 100% Cotton, 180"
                          value={spec.value}
                          onChange={(e) => updateSpec(spec.id, 'value', e.target.value)}
                          disabled={disabled}
                        />
                      </div>

                      {/* Unit */}
                      <div className="space-y-1 flex gap-2">
                        <div className="flex-1 space-y-1">
                          <Label className="text-xs text-muted-foreground">Unit (Optional)</Label>
                          <Select
                            value={spec.unit || ''}
                            onValueChange={(value) => updateSpec(spec.id, 'unit', value)}
                            disabled={disabled}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {COMMON_UNITS.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit || 'None'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSpec(spec.id)}
                      disabled={disabled}
                      className="mt-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Preview */}
                  {spec.key && spec.value && (
                    <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                      <span className="font-medium">{spec.key}:</span> {spec.value}
                      {spec.unit && ` ${spec.unit}`}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {specs.length > 0 && (
        <div className="flex justify-between items-center pt-2">
          <p className="text-sm text-muted-foreground">{specs.length} specification(s) added</p>
          {!disabled && (
            <Button
              type="button"
              onClick={() => addSpecification()}
              size="sm"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add More
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
