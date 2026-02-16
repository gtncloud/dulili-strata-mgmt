#!/bin/bash

# Compliance Modules Test Runner
# Tests Fire Safety and Debt Recovery modules

echo "🧪 Running Compliance Module Tests..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Run Fire Safety tests
echo -e "${BLUE}Testing Fire Safety Compliance Module...${NC}"
npx playwright test tests/fire-safety.spec.ts

# Run Debt Recovery tests
echo ""
echo -e "${BLUE}Testing Debt Recovery Module...${NC}"
npx playwright test tests/debt-recovery.spec.ts

# Generate report
echo ""
echo -e "${GREEN}✅ Tests complete! Generating report...${NC}"
npx playwright show-report

echo ""
echo "📊 Test Summary:"
echo "- Fire Safety: tests/fire-safety.spec.ts"
echo "- Debt Recovery: tests/debt-recovery.spec.ts"
echo ""
echo "View detailed report: npx playwright show-report"
