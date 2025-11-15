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
      "@/integrations/supabase/client": path.resolve(__dirname, "./src/integrations/supabase/client.injected.ts"),
    },
    dedupe: ["react", "react-dom"],
  },
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL ?? 'https://zedbqixgrcvomgooqudd.supabase.co'),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplZGJxaXhncmN2b21nb29xdWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NDM3MDQsImV4cCI6MjA3NTIxOTcwNH0.3Z_fdeG3NBebuXBKLyFm4Pz7DbzNfILhMc1Lvg8TD_0'),
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
    assetsInlineLimit: 0,
    rollupOptions: {
      treeshake: {
        preset: 'recommended',
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        annotations: true,
      },
      output: {
        manualChunks: (id) => {
          // Core React - split into smaller chunks
          if (id.includes('node_modules/react/') && !id.includes('react-dom')) {
            return 'react-core';
          }
          if (id.includes('node_modules/react-dom')) {
            return 'react-dom';
          }
          if (id.includes('node_modules/scheduler')) {
            return 'react-core';
          }
          
          // Router - separate chunk
          if (id.includes('react-router-dom') || id.includes('react-router')) {
            return 'router';
          }
          
          // Three.js - heavy library, split further
          if (id.includes('node_modules/three/')) {
            return 'three-core';
          }
          if (id.includes('@react-three')) {
            return 'three-react';
          }
          
          // Radix UI - split by component group
          if (id.includes('@radix-ui/react-dialog') || id.includes('@radix-ui/react-alert-dialog')) {
            return 'ui-dialogs';
          }
          if (id.includes('@radix-ui/react-dropdown') || id.includes('@radix-ui/react-select') || id.includes('@radix-ui/react-popover')) {
            return 'ui-menus';
          }
          if (id.includes('@radix-ui')) {
            return 'ui-base';
          }
          
          // React Query
          if (id.includes('@tanstack/react-query')) {
            return 'query';
          }
          
          // Supabase - split auth and client
          if (id.includes('@supabase/auth')) {
            return 'supabase-auth';
          }
          if (id.includes('@supabase')) {
            return 'supabase-client';
          }
          
          // Framer Motion - animation library
          if (id.includes('framer-motion')) {
            return 'animation';
          }
          
          // Charts - admin only
          if (id.includes('recharts')) {
            return 'charts';
          }
          
          // Form libraries
          if (id.includes('react-hook-form') || id.includes('@hookform')) {
            return 'forms';
          }
          
          // Icons - separate chunk
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          
          // Date utilities
          if (id.includes('date-fns')) {
            return 'date-utils';
          }
          
          // All other node_modules
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
        experimentalMinChunkSize: 20000, // Merge small chunks
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
    exclude: ['@lovable-dev/tagger'],
  },
}));
