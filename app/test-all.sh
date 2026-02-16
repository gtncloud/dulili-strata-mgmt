#!/bin/bash

# Complete Dulili Platform Test Runner
# Runs all end-to-end tests for the entire platform

echo "🧪 Running Complete Dulili Platform Tests..."
echo ""
echo "This will test all features across the entire platform:"
echo "  ✓ Authentication & Authorization"
echo "  ✓ Dashboard & Navigation"
echo "  ✓ Maintenance Management"
echo "  ✓ Announcements"
echo "  ✓ Community Features (Chat, Marketplace, Neighbors)"
echo "  ✓ Amenities Booking"
echo "  ✓ Surveys & Polls"
echo "  ✓ Sustainability"
echo "  ✓ Smart Building (Emergency, Predictive, IoT)"
echo "  ✓ Fire Safety Compliance"
echo "  ✓ Debt Recovery"
echo "  ✓ Finance Management"
echo "  ✓ Document Library"
echo "  ✓ Building Profile"
echo "  ✓ Member Directory"
echo "  ✓ Meeting Scheduler"
echo "  ✓ User Profile"
echo "  ✓ Global Search"
echo "  ✓ Responsive Design"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Run all tests
echo -e "${BLUE}Running all test suites...${NC}"
echo ""

# 1. Authentication tests
echo -e "${YELLOW}1/6 Authentication Tests${NC}"
npx playwright test tests/auth.spec.ts --reporter=list

# 2. Dashboard tests
echo ""
echo -e "${YELLOW}2/6 Dashboard Tests${NC}"
npx playwright test tests/dashboard.spec.ts --reporter=list

# 3. Maintenance tests
echo ""
echo -e "${YELLOW}3/6 Maintenance Tests${NC}"
npx playwright test tests/maintenance.spec.ts --reporter=list

# 4. Fire Safety tests
echo ""
echo -e "${YELLOW}4/6 Fire Safety Compliance Tests${NC}"
npx playwright test tests/fire-safety.spec.ts --reporter=list

# 5. Debt Recovery tests
echo ""
echo -e "${YELLOW}5/6 Debt Recovery Tests${NC}"
npx playwright test tests/debt-recovery.spec.ts --reporter=list

# 6. Complete E2E tests
echo ""
echo -e "${YELLOW}6/6 Complete Platform E2E Tests${NC}"
npx playwright test tests/complete-e2e.spec.ts --reporter=list

# Generate HTML report
echo ""
echo -e "${GREEN}✅ All tests complete! Generating HTML report...${NC}"
npx playwright test --reporter=html

echo ""
echo "📊 Test Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Test Files:"
echo "    • tests/auth.spec.ts - Authentication & Login"
echo "    • tests/dashboard.spec.ts - Dashboard Navigation"
echo "    • tests/maintenance.spec.ts - Maintenance Requests"
echo "    • tests/fire-safety.spec.ts - Fire Safety Compliance"
echo "    • tests/debt-recovery.spec.ts - Debt Recovery Module"
echo "    • tests/complete-e2e.spec.ts - Complete Platform (19 test suites)"
echo ""
echo "  View detailed HTML report:"
echo "    npx playwright show-report"
echo ""
echo "  Run specific test file:"
echo "    npx playwright test tests/[filename].spec.ts"
echo ""
echo "  Run tests in headed mode (see browser):"
echo "    npx playwright test --headed"
echo ""
echo "  Run tests in debug mode:"
echo "    npx playwright test --debug"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

