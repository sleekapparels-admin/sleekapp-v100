#!/bin/bash

# Script to replace all supabaseInjected imports with standard supabase imports
# This is a one-time migration script

echo "🔧 Replacing Supabase client imports..."

# Find all TypeScript files and replace the import
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' \
  's/import { supabaseInjected as supabase } from "@\/integrations\/supabase\/client.injected";/import { supabase } from "@\/integrations\/supabase\/client";/g' {} +

echo "✓ Import replacement complete!"
echo "Files affected:"
grep -r "supabase.*from.*client" src --include="*.ts" --include="*.tsx" | wc -l
