import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useWishlist = () => {
  const [wishlistedProducts, setWishlistedProducts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const sessionId = useRef(crypto.randomUUID());

  // Load user's wishlist on mount
  const loadWishlist = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setWishlistedProducts(new Set());
        setWishlistCount(0);
        return;
      }

      const { data, error } = await supabase.functions.invoke('wishlist-get');

      if (error) {
        console.error('Error loading wishlist:', error);
        return;
      }

      if (data?.items) {
        const productIds = new Set<string>(data.items.map((item: any) => item.product_id));
        setWishlistedProducts(productIds);
        setWishlistCount(productIds.size);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  useEffect(() => {
    loadWishlist();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        loadWishlist();
      } else if (event === 'SIGNED_OUT') {
        setWishlistedProducts(new Set());
        setWishlistCount(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const addToWishlist = async (productId: string) => {
    // Optimistic update
    setWishlistedProducts(prev => new Set([...prev, productId]));
    setWishlistCount(prev => prev + 1);

    try {
      const { data, error } = await supabase.functions.invoke('wishlist-add', {
        body: { productId }
      });

      if (error) {
        // Revert on error
        setWishlistedProducts(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        setWishlistCount(prev => prev - 1);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    // Optimistic update
    setWishlistedProducts(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
    setWishlistCount(prev => Math.max(0, prev - 1));

    try {
      const { data, error } = await supabase.functions.invoke('wishlist-remove', {
        body: { productId }
      });

      if (error) {
        // Revert on error
        setWishlistedProducts(prev => new Set([...prev, productId]));
        setWishlistCount(prev => prev + 1);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  };

  const isWishlisted = (productId: string) => {
    return wishlistedProducts.has(productId);
  };

  const toggleWishlist = async (productId: string) => {
    if (isWishlisted(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  return {
    wishlistedProducts,
    wishlistCount,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
    toggleWishlist,
    refetchWishlist: loadWishlist,
  };
};
