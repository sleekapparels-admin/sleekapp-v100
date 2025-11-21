#!/bin/bash

# Script to easily update Supabase ANON key
# Usage: ./update-supabase-key.sh YOUR_ANON_KEY_HERE

echo "🔧 Supabase Key Update Script"
echo "=============================="
echo ""

if [ -z "$1" ]; then
    echo "❌ Error: No key provided"
    echo ""
    echo "Usage:"
    echo "  ./update-supabase-key.sh YOUR_ANON_KEY_HERE"
    echo ""
    echo "Example:"
    echo "  ./update-supabase-key.sh eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    echo ""
    echo "To get your key:"
    echo "  👉 https://supabase.com/dashboard/project/eqpftggctumujhutomom/settings/api"
    echo ""
    exit 1
fi

ANON_KEY="$1"

# Validate key format (should start with eyJ)
if [[ ! $ANON_KEY =~ ^eyJ ]]; then
    echo "⚠️  Warning: Key doesn't start with 'eyJ' - are you sure this is correct?"
    echo ""
fi

# Create the .env.local file
cat > .env.local << EOF
# Supabase Configuration
# Project ID: eqpftggctumujhutomom
# Last Updated: $(date)

VITE_SUPABASE_URL=https://eqpftggctumujhutomom.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=$ANON_KEY
EOF

echo "✅ Successfully updated .env.local"
echo ""
echo "📝 Configuration:"
echo "   Supabase URL: https://eqpftggctumujhutomom.supabase.co"
echo "   Anon Key: ${ANON_KEY:0:20}...${ANON_KEY: -10}"
echo ""
echo "🔄 Next steps:"
echo "   1. The development server should auto-reload"
echo "   2. If not, restart with: npm run dev"
echo "   3. Visit: https://8080-is1xlb799wil11nelt1jp-b237eb32.sandbox.novita.ai"
echo ""
echo "✅ All set! Your app should now connect to Supabase!"
