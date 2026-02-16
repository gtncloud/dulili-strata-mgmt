#!/bin/bash

# Dulili Visual Testing with Percy
# Runs Playwright tests with Percy visual snapshots

echo "🎨 Running Visual Regression Tests with Percy..."
echo ""

# Check if PERCY_TOKEN is set
if [ -z "$PERCY_TOKEN" ]; then
    echo "⚠️  PERCY_TOKEN not set!"
    echo ""
    echo "To use Percy, you need to:"
    echo "1. Sign up at https://percy.io"
    echo "2. Create a new project"
    echo "3. Get your PERCY_TOKEN from project settings"
    echo "4. Set it: export PERCY_TOKEN=your_token_here"
    echo ""
    echo "Running tests WITHOUT Percy (local Playwright only)..."
    echo ""
    npx playwright test tests/visual-regression.spec.ts
else
    echo "✅ PERCY_TOKEN found!"
    echo "📸 Visual snapshots will be uploaded to Percy"
    echo ""
    
    # Run tests with Percy
    npx percy exec -- npx playwright test tests/visual-regression.spec.ts
fi

echo ""
echo "📊 View results:"
echo "  • Playwright report: npx playwright show-report"
echo "  • Percy dashboard: https://percy.io"
echo ""
