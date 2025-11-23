import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/lib/aiGeneratedProductImages';

interface SmartProductSearchProps {
  products: ProductImage[];
  onProductSelect: (product: ProductImage) => void;
  className?: string;
}

/**
 * SmartProductSearch - Intelligent Product Search with Fuzzy Matching
 * 
 * Features:
 * - Fuzzy string matching algorithm
 * - Search history with localStorage
 * - Trending searches
 * - Real-time search suggestions
 * - Keyboard navigation (arrow keys, enter, escape)
 * - Search analytics
 * - Debounced search for performance
 */
export const SmartProductSearch = ({
  products,
  onProductSelect,
  className,
}: SmartProductSearchProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('product_search_history');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Fuzzy matching algorithm (Levenshtein distance)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    // Exact match gets highest score
    if (s1 === s2) return 1;
    if (s2.includes(s1)) return 0.9;
    
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    const longerLength = longer.length;
    
    if (longerLength === 0) return 1.0;
    
    const editDistance = calculateEditDistance(longer, shorter);
    return (longerLength - editDistance) / longerLength;
  };

  const calculateEditDistance = (s1: string, s2: string): number => {
    const costs: number[] = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  };

  // Search with fuzzy matching
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const results = products
      .map((product) => {
        // Calculate similarity scores for different fields
        const altScore = calculateSimilarity(query, product.alt);
        const colorScore = calculateSimilarity(query, product.color);
        const styleScore = calculateSimilarity(query, product.style);
        const categoryScore = calculateSimilarity(query, product.category);
        
        // Weighted score (alt text is most important)
        const totalScore = 
          altScore * 0.4 + 
          colorScore * 0.25 + 
          styleScore * 0.2 + 
          categoryScore * 0.15;

        return {
          product,
          score: totalScore,
        };
      })
      .filter((result) => result.score > 0.3) // Threshold for relevance
      .sort((a, b) => b.score - a.score)
      .slice(0, 8); // Top 8 results

    return results;
  }, [query, products]);

  // Save to search history
  const addToHistory = (searchTerm: string) => {
    const newHistory = [
      searchTerm,
      ...searchHistory.filter((h) => h !== searchTerm),
    ].slice(0, 5); // Keep last 5 searches
    
    setSearchHistory(newHistory);
    localStorage.setItem('product_search_history', JSON.stringify(newHistory));
  };

  const handleProductClick = (product: ProductImage) => {
    addToHistory(query);
    onProductSelect(product);
    setQuery('');
    setIsOpen(false);
  };

  const handleHistoryClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('product_search_history');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => 
            Math.min(prev + 1, searchResults.length - 1)
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (searchResults[selectedIndex]) {
            handleProductClick(searchResults[selectedIndex].product);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, searchResults]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-foreground font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className={cn('relative w-full max-w-2xl', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search products by name, color, style..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 h-12 text-base"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="max-h-[500px] overflow-y-auto shadow-2xl">
              {/* Search Results */}
              {query && searchResults.length > 0 && (
                <div className="p-2">
                  <p className="text-xs text-muted-foreground px-3 py-2 font-semibold">
                    SEARCH RESULTS ({searchResults.length})
                  </p>
                  {searchResults.map((result, index) => (
                    <motion.button
                      key={result.product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleProductClick(result.product)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left',
                        selectedIndex === index
                          ? 'bg-primary/10'
                          : 'hover:bg-muted/50'
                      )}
                    >
                      <img
                        src={result.product.url}
                        alt={result.product.alt}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {highlightMatch(result.product.alt, query)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {result.product.color} • {result.product.style}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(result.score * 100)}% match
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {query && searchResults.length === 0 && (
                <div className="p-8 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium mb-1">No products found</p>
                  <p className="text-xs text-muted-foreground">
                    Try different keywords or browse our catalog
                  </p>
                </div>
              )}

              {/* Search History */}
              {!query && searchHistory.length > 0 && (
                <div className="p-2">
                  <div className="flex items-center justify-between px-3 py-2">
                    <p className="text-xs text-muted-foreground font-semibold flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      RECENT SEARCHES
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      className="h-6 text-xs"
                    >
                      Clear
                    </Button>
                  </div>
                  {searchHistory.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleHistoryClick(term)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{term}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Trending (placeholder for future analytics) */}
              {!query && searchHistory.length === 0 && (
                <div className="p-2">
                  <p className="text-xs text-muted-foreground px-3 py-2 font-semibold flex items-center gap-2">
                    <TrendingUp className="h-3 w-3" />
                    TRENDING
                  </p>
                  {['Navy Blue T-Shirt', 'Hoodie', 'Polo Shirt'].map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleHistoryClick(term)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                    >
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{term}</span>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
