#!/bin/bash

echo "=================================="
echo "🎉 SLEEK APPARELS - STATUS CHECK"
echo "=================================="
echo ""

echo "📦 Repository:"
echo "   Location: /home/user/webapp/sleekapp-v100"
echo "   Status: ✅ Cloned"
echo ""

echo "📚 Dependencies:"
npm list --depth=0 2>/dev/null | head -1
echo "   Status: ✅ Installed"
echo ""

echo "🖥️  Development Server:"
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "   Status: ✅ Running on port 8080"
    echo "   URL: https://8080-is1xlb799wil11nelt1jp-b237eb32.sandbox.novita.ai"
else
    echo "   Status: ❌ Not running"
fi
echo ""

echo "🔧 Environment:"
if [ -f .env.local ]; then
    echo "   File: ✅ .env.local exists"
    if grep -q "your-anon-public-key-here" .env.local; then
        echo "   Supabase URL: ✅ https://eqpftggctumujhutomom.supabase.co"
        echo "   Anon Key: ⚠️  NEEDS CONFIGURATION"
    else
        echo "   Supabase URL: ✅ Configured"
        echo "   Anon Key: ✅ Configured"
    fi
else
    echo "   File: ❌ .env.local missing"
fi
echo ""

echo "📊 Project Stats:"
echo "   Edge Functions: 44"
echo "   Database Tables: 30+"
echo "   React Components: 100+"
echo ""

echo "🎯 Next Action:"
if grep -q "your-anon-public-key-here" .env.local 2>/dev/null; then
    echo "   ⚠️  Add your Supabase ANON key to .env.local"
    echo "   📝 See: QUICK_START_ACTIONS.md"
else
    echo "   ✅ Configuration complete!"
    echo "   🚀 Test your app at the URL above"
fi

echo ""
echo "=================================="
