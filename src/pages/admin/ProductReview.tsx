import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Image as ImageIcon,
  ZoomIn,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Send,
  Sparkles,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useMarketplaceProduct, useApproveProduct } from '@/hooks/useMarketplace';
import { useToast } from '@/hooks/use-toast';
import { pageTransition } from '@/lib/animations';
import type { ApprovalAction } from '@/types/marketplace';
import { Helmet } from 'react-helmet';

const REJECTION_REASONS = [
  'Poor image quality',
  'Incomplete product information',
  'Misleading description',
  'Pricing issues',
  'Copyright violation',
  'Prohibited item',
  'Duplicate listing',
  'Insufficient specifications',
  'Quality concerns',
  'Other',
];

const AI_QUALITY_CHECKS = [
  { name: 'Image Resolution', status: 'pass', score: 95, message: 'All images meet minimum resolution requirements' },
  { name: 'Image Clarity', status: 'pass', score: 88, message: 'Images are clear and well-lit' },
  { name: 'Background Quality', status: 'warning', score: 72, message: 'Some images have cluttered backgrounds' },
  { name: 'Product Visibility', status: 'pass', score: 92, message: 'Product is clearly visible in all images' },
  { name: 'Color Accuracy', status: 'pass', score: 85, message: 'Color representation appears accurate' },
  { name: 'Watermarks', status: 'pass', score: 100, message: 'No watermarks detected' },
];

export default function ProductReview() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: product, isLoading } = useMarketplaceProduct(productId || '');
  const approveProductMutation = useApproveProduct();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [adminFeedback, setAdminFeedback] = useState<string>('');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);

  const handleApprove = async () => {
    if (!productId) return;

    try {
      await approveProductMutation.mutateAsync({
        productId,
        action: 'approved' as ApprovalAction,
        feedback: adminFeedback || 'Product approved for marketplace',
      });

      toast({
        title: 'Product Approved',
        description: 'The product has been approved and is now live on the marketplace',
      });

      navigate('/admin/products/approval');
    } catch (error) {
      console.error('Error approving product:', error);
    }
  };

  const handleReject = async () => {
    if (!productId || !rejectionReason) {
      toast({
        title: 'Rejection Reason Required',
        description: 'Please select a reason for rejection',
        variant: 'destructive',
      });
      return;
    }

    try {
      await approveProductMutation.mutateAsync({
        productId,
        action: 'rejected' as ApprovalAction,
        reason: rejectionReason,
        feedback: adminFeedback || undefined,
      });

      toast({
        title: 'Product Rejected',
        description: 'The supplier has been notified of the rejection',
      });

      navigate('/admin/products/approval');
    } catch (error) {
      console.error('Error rejecting product:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Product Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/admin/products/approval')}>
              Back to Approval Queue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const averageQualityScore = AI_QUALITY_CHECKS.reduce((sum, check) => sum + check.score, 0) / AI_QUALITY_CHECKS.length;

  return (
    <>
      <Helmet>
        <title>Review: {product.title} - Admin Dashboard</title>
      </Helmet>

      <Navbar />

      <motion.div
        {...pageTransition}
        className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-24 pb-16"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/products/approval')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Queue
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
                <p className="text-muted-foreground">
                  Submitted by {product.suppliers?.company_name || 'Unknown Supplier'} on{' '}
                  {new Date(product.created_at || '').toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="lg"
                  onClick={() => setShowApprovalDialog(true)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={approveProductMutation.isPending}
                >
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Approve Product
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={() => setShowRejectionDialog(true)}
                  disabled={approveProductMutation.isPending}
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  Reject
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Product Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>
                    Review all uploaded images ({product.images?.length || 0} images)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {product.images?.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square relative group cursor-pointer rounded-lg overflow-hidden bg-gray-100"
                        onClick={() => setSelectedImage(image)}
                      >
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn className="h-8 w-8 text-white" />
                        </div>
                        {index === 0 && (
                          <Badge className="absolute top-2 left-2">Primary</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Product Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="mt-1">{product.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Category</Label>
                      <p className="mt-1 font-medium">{product.category}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Product Type</Label>
                      <p className="mt-1 font-medium">{product.product_type}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Material</Label>
                      <p className="mt-1 font-medium">{product.material || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">GSM</Label>
                      <p className="mt-1 font-medium">{product.gsm || 'Not specified'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Base Price</Label>
                      <p className="text-2xl font-bold mt-1">${product.base_price}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Platform Fee</Label>
                      <p className="text-2xl font-bold mt-1 text-primary">
                        ${product.platform_fee_amount || 0}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Final Price</Label>
                      <p className="text-2xl font-bold mt-1 text-green-600">
                        ${product.final_price}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">In Stock</Label>
                      <p className="text-2xl font-bold mt-1">{product.available_quantity}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label className="text-muted-foreground">MOQ</Label>
                      <p className="mt-1 font-medium">{product.moq} {product.unit}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Lead Time</Label>
                      <p className="mt-1 font-medium">{product.lead_time_days} days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key}>
                          <Label className="text-muted-foreground">{key}</Label>
                          <p className="mt-1 font-medium">
                            {typeof value === 'object'
                              ? `${(value as any).value} ${(value as any).unit || ''}`
                              : String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - AI Quality Check & Actions */}
            <div className="space-y-6">
              {/* AI Quality Check */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <CardTitle>AI Quality Check</CardTitle>
                  </div>
                  <CardDescription>
                    Automated quality analysis of product listing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Overall Score</span>
                      <span className="text-2xl font-bold text-primary">
                        {averageQualityScore.toFixed(0)}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${averageQualityScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {AI_QUALITY_CHECKS.map((check, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {check.status === 'pass' ? (
                          <ThumbsUp className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{check.name}</p>
                            <Badge
                              variant={check.status === 'pass' ? 'outline' : 'secondary'}
                              className={
                                check.status === 'pass'
                                  ? 'text-green-600 border-green-600'
                                  : 'text-orange-600 border-orange-600'
                              }
                            >
                              {check.score}%
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{check.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Supplier Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Supplier Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground">Company</Label>
                    <p className="mt-1 font-medium">
                      {product.suppliers?.company_name || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Tier</Label>
                    <Badge className="mt-1">{product.suppliers?.tier || 'BRONZE'}</Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Location</Label>
                    <p className="mt-1 font-medium">
                      {product.suppliers?.factory_location || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Overall Rating</Label>
                    <p className="mt-1 font-medium">
                      {product.suppliers?.supplier_ratings?.[0]?.overall_score || 0}/5.0
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Admin Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle>Admin Feedback</CardTitle>
                  <CardDescription>Optional feedback for the supplier</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter any feedback or notes for the supplier..."
                    value={adminFeedback}
                    onChange={(e) => setAdminFeedback(e.target.value)}
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approval Dialog */}
      <AnimatePresence>
        {showApprovalDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowApprovalDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="max-w-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    Approve Product
                  </CardTitle>
                  <CardDescription>
                    This product will be published to the marketplace
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      The supplier will be notified and the product will be visible to buyers
                      immediately.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleApprove}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={approveProductMutation.isPending}
                    >
                      {approveProductMutation.isPending ? 'Approving...' : 'Confirm Approval'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rejection Dialog */}
      <AnimatePresence>
        {showRejectionDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowRejectionDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="max-w-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="h-6 w-6 text-red-600" />
                    Reject Product
                  </CardTitle>
                  <CardDescription>
                    Provide a reason for rejecting this product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Rejection Reason *</Label>
                    <Select value={rejectionReason} onValueChange={setRejectionReason}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                      <SelectContent>
                        {REJECTION_REASONS.map((reason) => (
                          <SelectItem key={reason} value={reason}>
                            {reason}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      The supplier will be notified of this rejection and can resubmit after
                      making corrections.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={!rejectionReason || approveProductMutation.isPending}
                    >
                      {approveProductMutation.isPending ? 'Rejecting...' : 'Confirm Rejection'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
