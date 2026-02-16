#!/bin/bash

echo "🧪 Dulili End-to-End Testing"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if dev server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Dev server is not running!"
    echo ""
    echo "Please start the dev server first:"
    echo "  npm run dev"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ Dev server is running"
echo ""

# Ask which tests to run
echo "Which tests would you like to run?"
echo ""
echo "1. Smoke Tests (Quick - 29 pages, ~5 minutes)"
echo "2. Fire Safety Tests (20+ tests, ~3 minutes)"
echo "3. Debt Recovery Tests (15+ tests, ~3 minutes)"
echo "4. Complete E2E Tests (100+ tests, ~30 minutes)"
echo "5. Visual Regression Tests (50+ snapshots, ~10 minutes)"
echo "6. All Tests (Everything, ~45 minutes)"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Running Smoke Tests..."
        npx playwright test tests/smoke-test.spec.ts --reporter=list
        ;;
    2)
        echo ""
        echo "🔥 Running Fire Safety Tests..."
        npx playwright test tests/fire-safety.spec.ts --reporter=list
        ;;
    3)
        echo ""
        echo "💰 Running Debt Recovery Tests..."
        npx playwright test tests/debt-recovery.spec.ts --reporter=list
        ;;
    4)
        echo ""
        echo "🌐 Running Complete E2E Tests..."
        npx playwright test tests/complete-e2e.spec.ts --reporter=list
        ;;
    5)
        echo ""
        echo "🎨 Running Visual Regression Tests..."
        npx playwright test tests/visual-regression.spec.ts --reporter=list
        ;;
    6)
        echo ""
        echo "🚀 Running ALL Tests..."
        npx playwright test --reporter=list
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Please run again and select 1-6."
        exit 1
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Tests complete!"
echo ""
echo "📊 View detailed HTML report:"
echo "  npx playwright show-report"
echo ""
echo "📸 Screenshots saved in:"
echo "  test-results/"
echo ""
