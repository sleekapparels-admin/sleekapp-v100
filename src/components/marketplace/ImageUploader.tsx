import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, ZoomIn, Image as ImageIcon, AlertCircle, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  productId?: string;
  maxImages?: number;
  onImagesChange: (imageUrls: string[]) => void;
  initialImages?: string[];
  disabled?: boolean;
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  url?: string;
}

export function ImageUploader({
  productId,
  maxImages = 10,
  onImagesChange,
  initialImages = [],
  disabled = false,
}: ImageUploaderProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(initialImages);
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit.';
    }
    return null;
  };

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files || disabled) return;

      const fileArray = Array.from(files);
      const remainingSlots = maxImages - (images.length + uploadedUrls.length);

      if (remainingSlots <= 0) {
        alert(`Maximum ${maxImages} images allowed`);
        return;
      }

      const newImages: ImageFile[] = [];

      fileArray.slice(0, remainingSlots).forEach((file) => {
        const error = validateFile(file);
        const id = `${Date.now()}-${Math.random()}`;

        newImages.push({
          id,
          file,
          preview: URL.createObjectURL(file),
          status: error ? 'error' : 'pending',
          progress: 0,
          error,
        });
      });

      setImages((prev) => [...prev, ...newImages]);
    },
    [images.length, uploadedUrls.length, maxImages, disabled]
  );

  const uploadImage = async (imageFile: ImageFile) => {
    if (!productId) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageFile.id
            ? { ...img, status: 'error', error: 'Product ID required for upload' }
            : img
        )
      );
      return;
    }

    setImages((prev) =>
      prev.map((img) => (img.id === imageFile.id ? { ...img, status: 'uploading' } : img))
    );

    try {
      const fileExt = imageFile.file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${productId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile.file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from('product-images').getPublicUrl(data.path);

      setImages((prev) =>
        prev.map((img) =>
          img.id === imageFile.id ? { ...img, status: 'success', progress: 100, url: publicUrl } : img
        )
      );

      setUploadedUrls((prev) => {
        const newUrls = [...prev, publicUrl];
        onImagesChange(newUrls);
        return newUrls;
      });
    } catch (error) {
      console.error('Upload error:', error);
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageFile.id
            ? { ...img, status: 'error', error: 'Upload failed. Please try again.' }
            : img
        )
      );
    }
  };

  const uploadAllPending = useCallback(() => {
    images
      .filter((img) => img.status === 'pending')
      .forEach((img) => uploadImage(img));
  }, [images, productId]);

  const removeImage = (imageId: string) => {
    const image = images.find((img) => img.id === imageId);
    if (image?.preview) {
      URL.revokeObjectURL(image.preview);
    }
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const removeUploadedImage = async (url: string) => {
    if (disabled) return;

    try {
      // Extract file path from URL
      const urlParts = url.split('/product-images/');
      if (urlParts.length === 2) {
        const filePath = urlParts[1];
        await supabase.storage.from('product-images').remove([filePath]);
      }

      setUploadedUrls((prev) => {
        const newUrls = prev.filter((u) => u !== url);
        onImagesChange(newUrls);
        return newUrls;
      });
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const totalImages = images.length + uploadedUrls.length;
  const canAddMore = totalImages < maxImages && !disabled;
  const hasPendingUploads = images.some((img) => img.status === 'pending');

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          isDragging && 'border-primary border-2 bg-primary/5',
          !canAddMore && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-8">
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            multiple
            onChange={handleFileInput}
            disabled={!canAddMore}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Upload className="h-8 w-8 text-primary" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">Upload Product Images</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop images here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Max {maxImages} images • JPEG, PNG, WebP, GIF • Max 5MB each
              </p>
            </div>

            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={!canAddMore}
              variant="outline"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Select Images ({totalImages}/{maxImages})
            </Button>
          </div>
        </div>
      </Card>

      {/* Image Previews */}
      {(uploadedUrls.length > 0 || images.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Uploaded Images */}
          <AnimatePresence>
            {uploadedUrls.map((url, index) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group"
              >
                <Card className="overflow-hidden">
                  <div className="aspect-square relative bg-gray-100">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => setPreviewImage(url)}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      {!disabled && (
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => removeUploadedImage(url)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Primary
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Pending/Uploading Images */}
            {images.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group"
              >
                <Card className="overflow-hidden">
                  <div className="aspect-square relative bg-gray-100">
                    <img
                      src={image.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />

                    {/* Status Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      {image.status === 'pending' && (
                        <div className="text-white text-center">
                          <AlertCircle className="h-6 w-6 mx-auto mb-1" />
                          <p className="text-xs">Ready to upload</p>
                        </div>
                      )}
                      {image.status === 'uploading' && (
                        <div className="text-white text-center">
                          <Loader2 className="h-6 w-6 mx-auto mb-1 animate-spin" />
                          <p className="text-xs">Uploading...</p>
                        </div>
                      )}
                      {image.status === 'success' && (
                        <div className="text-white text-center">
                          <Check className="h-6 w-6 mx-auto mb-1" />
                          <p className="text-xs">Uploaded</p>
                        </div>
                      )}
                      {image.status === 'error' && (
                        <div className="text-white text-center p-2">
                          <AlertCircle className="h-6 w-6 mx-auto mb-1 text-red-400" />
                          <p className="text-xs">{image.error}</p>
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(image.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload All Button */}
      {hasPendingUploads && productId && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>You have pending images ready to upload</span>
            <Button onClick={uploadAllPending} size="sm">
              Upload All ({images.filter((img) => img.status === 'pending').length})
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!productId && images.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Images will be uploaded after you create the product
          </AlertDescription>
        </Alert>
      )}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
          >
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setPreviewImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
