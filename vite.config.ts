import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import removeConsole from "vite-plugin-remove-console";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
    strictPort: false,
    hmr: {
      clientPort: 8081,
    },
    allowedHosts: [
      '.sandbox.novita.ai',
      '8082-is1xlb799wil11nelt1jp-b237eb32.sandbox.novita.ai',
      '8081-is1xlb799wil11nelt1jp-b237eb32.sandbox.novita.ai',
      '8080-is1xlb799wil11nelt1jp-b237eb32.sandbox.novita.ai',
    ],
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Remove console logs in production for performance
    mode === "production" && removeConsole(),
    // Image optimization
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|webp|svg)$/i,
      includePublic: true,
      cache: true,
      cacheLocation: '.cache/image-optimizer',
    }),
    // Compression for production builds
    mode === "production" && viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
    }),
    mode === "production" && viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
    }),
    // Bundle analyzer
    mode === "production" && visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  define: {
    // LOVABLE CLOUD VERSION - Uses Lovable-managed Supabase
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL ?? 'https://eqpftggctumujhutomom.supabase.co'),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxcGZ0Z2djdHVtdWpodXRvbW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjc5NzAsImV4cCI6MjA3ODc0Mzk3MH0.7KkuzAPJlU7PR6lOIKi_zZi31oUhWk_MGUzYhxGYehw'),
    'import.meta.env.VITE_BUILD_ID': JSON.stringify(Date.now().toString()),
  },
  build: {
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    cssCodeSplit: true,
    minify: 'esbuild',
    target: 'es2020', // Modern target for better tree-shaking
    reportCompressedSize: false,
    cssMinify: 'lightningcss', // Faster CSS minification
    assetsInlineLimit: 4096, // Inline small assets < 4KB
    rollupOptions: {
      treeshake: {
        preset: 'recommended',
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        annotations: true,
      },
      output: {
        manualChunks: (id) => {
          // Core React - Critical initial bundle
          if (id.includes('node_modules/react/') && !id.includes('react-dom')) {
            return 'react-core';
          }
          if (id.includes('node_modules/react-dom')) {
            return 'react-dom';
          }
          if (id.includes('node_modules/scheduler')) {
            return 'react-core';
          }
          
          // Router - Critical for navigation
          if (id.includes('react-router-dom') || id.includes('react-router')) {
            return 'router';
          }
          
          // React Query - Essential state management
          if (id.includes('@tanstack/react-query')) {
            return 'query';
          }
          
          // Supabase - Backend critical, split by usage
          if (id.includes('@supabase/auth')) {
            return 'supabase-auth';
          }
          if (id.includes('@supabase')) {
            return 'supabase-client';
          }
          
          // Heavy Libraries - Lazy loaded
          // Framer Motion - Animation library (lazy)
          if (id.includes('framer-motion')) {
            return 'animation';
          }
          
          // Charts - Admin only (lazy)
          if (id.includes('recharts')) {
            return 'charts';
          }
          
          // PDF Generation - On-demand (lazy)
          if (id.includes('jspdf')) {
            return 'pdf-lib';
          }
          
          // UI Components - Group by frequency of use
          // Dialog/Modal - Used frequently
          if (id.includes('@radix-ui/react-dialog') || id.includes('@radix-ui/react-alert-dialog')) {
            return 'ui-dialogs';
          }
          // Dropdown/Select/Popover - Used frequently
          if (id.includes('@radix-ui/react-dropdown') || id.includes('@radix-ui/react-select') || id.includes('@radix-ui/react-popover')) {
            return 'ui-menus';
          }
          // Base UI - Common components
          if (id.includes('@radix-ui')) {
            return 'ui-base';
          }
          
          // Form libraries - Heavy, used on specific pages
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
            return 'forms';
          }
          
          // Icons - Separate for tree-shaking
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          
          // Date utilities - Used in specific features
          if (id.includes('date-fns')) {
            return 'date-utils';
          }
          
          // Stripe - Payment specific (lazy)
          if (id.includes('@stripe')) {
            return 'payment';
          }
          
          // All other node_modules - Generic vendor
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        compact: true,
        generatedCode: {
          preset: 'es2015',
          arrowFunctions: true,
          constBindings: true,
          objectShorthand: true,
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.');
          const ext = info?.[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext || '')) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/woff|woff2|eot|ttf|otf/i.test(ext || '')) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        experimentalMinChunkSize: 20000, // Merge small chunks for fewer HTTP requests
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
    exclude: ['@lovable-dev/tagger'],
  },
}));
