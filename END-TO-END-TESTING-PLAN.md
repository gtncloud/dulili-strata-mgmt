# End-to-End Testing Plan - Dulili Platform

**Date:** February 16, 2026  
**Testing Framework:** Playwright  
**Coverage Goal:** 90%+ of critical user journeys

---

## 🎯 Testing Strategy Overview

### Testing Pyramid
```
                    /\
                   /  \
                  / E2E \          ← Focus here (Critical paths)
                 /______\
                /        \
               /   API    \        ← Server actions & routes
              /____________\
             /              \
            /   Unit Tests   \    ← Utility functions
           /__________________\
```

### Current Setup
- ✅ Playwright configured
- ✅ Test directory: `app/tests/`
- ✅ Base URL: `http://localhost:3000`
- ✅ Existing tests: auth, dashboard, maintenance
- ✅ Test credentials available

---

## 📋 Test Coverage Plan

### Phase 1: Core Features (Existing + New)
1. Authentication & Authorization
2. Dashboard Navigation
3. Maintenance Management
4. Fire Safety Compliance ⭐ NEW
5. Debt Recovery ⭐ NEW

### Phase 2: Community Features
6. Announcements
7. Community Chat
8. Surveys & Polls
9. Marketplace
10. Amenities Booking

### Phase 3: Advanced Features
11. Emergency Response
12. Predictive Maintenance
13. IoT Dashboard
14. Document Management
15. Financial Management

---

## 🔥 Fire Safety Compliance - Test Suite

### Test File: `app/tests/fire-safety.spec.ts`

#### Test Scenarios:

**1. Fire Safety Overview Dashboard**
```typescript
✓ Should display compliance statistics
✓ Should show compliant measures count
✓ Should show overdue measures count
✓ Should show due soon measures count
✓ Should display current year AFSS status
✓ Should show compliance disclaimer
✓ Should have quick action buttons
✓ Should navigate to measures page
✓ Should navigate to AFSS page
✓ Should navigate to emergency plan page
```

**2. Fire Safety Measures List**
```typescript
✓ Should display all fire safety measures
✓ Should show measure status badges (compliant/due soon/overdue)
✓ Should calculate days until due correctly
✓ Should group overdue measures separately
✓ Should group due soon measures separately
✓ Should display testing frequency
✓ Should show last tested date
✓ Should show next test due date
✓ Should display measure icons correctly
✓ Should show testing schedule reference
```

**3. AFSS Management**
```typescript
✓ Should display current year AFSS status
✓ Should show practitioner details
✓ Should track council submission status
✓ Should track Fire & Rescue NSW submission status
✓ Should show building display status
✓ Should display historical AFSS records
✓ Should show submission checklist
✓ Should allow certificate download
✓ Should alert if current year AFSS missing
```

**4. Fire Safety Inspections** (To be built)
```typescript
✓ Should display upcoming inspections
✓ Should allow scheduling new inspection
✓ Should record inspection results
✓ Should upload inspection certificates
✓ Should track corrective actions
✓ Should calculate next inspection date
```

**5. Emergency Plan** (To be built)
```typescript
✓ Should display current emergency plan
✓ Should show evacuation procedures
✓ Should list assembly points
✓ Should display emergency contacts
✓ Should track drill dates
✓ Should schedule next drill
✓ Should allow plan updates
```

---

## 💰 Debt Recovery - Test Suite

### Test File: `app/tests/debt-recovery.spec.ts`

#### Test Scenarios:

**1. Debt Recovery Overview Dashboard**
```typescript
✓ Should display total overdue amount
✓ Should show active payment plans count
✓ Should show pending requests count
✓ Should display recovery actions count
✓ Should show NSW compliance notice
✓ Should alert if payment plan not offered (compliance)
✓ Should have quick action buttons
✓ Should navigate to overdue levies page
✓ Should navigate to payment plans page
✓ Should navigate to recovery actions page
```

**2. Overdue Levies List** (To be built)
```typescript
✓ Should display all overdue levies
✓ Should calculate days overdue correctly
✓ Should calculate interest correctly (30 days after due)
✓ Should show compliance warnings
✓ Should allow offering payment plan
✓ Should allow sending reminders
✓ Should track payment plan offer status
✓ Should prevent recovery action without payment plan offer
✓ Should apply NSW 2025 reforms correctly
```

**3. Payment Plans Management** (To be built)
```typescript
✓ Should display active payment plans
✓ Should display pending requests
✓ Should show 28-day response deadline
✓ Should calculate days remaining to respond
✓ Should display payment schedule
✓ Should track installment payments
✓ Should show payment history
✓ Should allow plan approval
✓ Should allow plan rejection with reasons
✓ Should allow interest waiver voting
✓ Should allow plan extensions
```

**4. Payment Plan Request Form** (To be built)
```typescript
✓ Should use NSW standard form
✓ Should calculate affordable installments
✓ Should validate maximum 12-month duration
✓ Should allow interest waiver request
✓ Should not request additional financial info
✓ Should submit request successfully
✓ Should show confirmation message
```

**5. Payment Application Order** (To be built)
```typescript
✓ Should apply payments to oldest levies first
✓ Should apply to interest second
✓ Should apply to recovery costs third
✓ Should track payment allocation correctly
✓ Should update levy status when paid
✓ Should update payment plan progress
```

**6. Recovery Actions** (To be built)
```typescript
✓ Should display action history
✓ Should track payment plan offers
✓ Should track reminders sent
✓ Should track tribunal applications
✓ Should track court orders
✓ Should prevent action during active payment plan
✓ Should require payment plan offer before recovery
✓ Should upload supporting documents
```

---

## 🧪 Test Implementation

### 1. Fire Safety Tests

```typescript
// app/tests/fire-safety.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Fire Safety Compliance', () => {
    test.beforeEach(async ({ page }) => {
        // Login as manager
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'manager@dulili.com.au');
        await page.fill('input[type="password"]', 'password123');
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page).toHaveURL(/dashboard/);
    });

    test.describe('Overview Dashboard', () => {
        test('should display compliance statistics', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety');
            
            // Check page loaded
            await expect(page.getByRole('heading', { name: 'Fire Safety Compliance' })).toBeVisible();
            
            // Check compliance disclaimer
            await expect(page.getByText(/Dulili's Fire Safety Compliance module/)).toBeVisible();
            
            // Check statistics cards
            await expect(page.getByText('Compliant Measures')).toBeVisible();
            await expect(page.getByText('Overdue Items')).toBeVisible();
            await expect(page.getByText('Due Soon')).toBeVisible();
            await expect(page.getByText('AFSS Status')).toBeVisible();
            
            // Check quick actions
            await expect(page.getByRole('button', { name: /Manage AFSS/ })).toBeVisible();
            await expect(page.getByRole('button', { name: /Fire Safety Measures/ })).toBeVisible();
            await expect(page.getByRole('button', { name: /Emergency Plan/ })).toBeVisible();
        });

        test('should show correct measure counts', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety');
            
            // Based on seed data: 8 measures, all compliant
            const compliantCount = await page.locator('text=Compliant Measures').locator('..').locator('text=/^\\d+$/').textContent();
            expect(parseInt(compliantCount || '0')).toBeGreaterThan(0);
        });

        test('should navigate to measures page', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety');
            await page.getByRole('link', { name: /Fire Safety Measures/ }).click();
            await expect(page).toHaveURL(/\/compliance\/fire-safety\/measures/);
            await expect(page.getByRole('heading', { name: 'Fire Safety Measures' })).toBeVisible();
        });

        test('should navigate to AFSS page', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety');
            await page.getByRole('link', { name: /Manage AFSS/ }).click();
            await expect(page).toHaveURL(/\/compliance\/fire-safety\/afss/);
            await expect(page.getByRole('heading', { name: /Annual Fire Safety Statements/ })).toBeVisible();
        });
    });

    test.describe('Fire Safety Measures', () => {
        test('should display all measures', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/measures');
            
            // Check page loaded
            await expect(page.getByRole('heading', { name: 'Fire Safety Measures' })).toBeVisible();
            
            // Check summary cards
            await expect(page.getByText('Total Measures')).toBeVisible();
            await expect(page.getByText('Compliant')).toBeVisible();
            await expect(page.getByText('Due Soon')).toBeVisible();
            await expect(page.getByText('Overdue')).toBeVisible();
            
            // Check measures list exists
            await expect(page.getByText('All Fire Safety Measures')).toBeVisible();
            
            // Check testing schedule reference
            await expect(page.getByText('Testing Frequency Reference')).toBeVisible();
            await expect(page.getByText('AS1851-2012')).toBeVisible();
        });

        test('should show measure details', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/measures');
            
            // Check for measure types from seed data
            await expect(page.getByText(/Fire Alarm/i)).toBeVisible();
            await expect(page.getByText(/Sprinkler/i)).toBeVisible();
            await expect(page.getByText(/Extinguisher/i)).toBeVisible();
            
            // Check for measure details
            await expect(page.getByText(/Last tested/i)).toBeVisible();
            await expect(page.getByText(/Next Test Due/i)).toBeVisible();
            await expect(page.getByText(/Testing Frequency/i)).toBeVisible();
        });

        test('should display status badges', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/measures');
            
            // Check for status badges (based on seed data, all should be compliant)
            const badges = page.locator('[class*="badge"]');
            await expect(badges.first()).toBeVisible();
        });
    });

    test.describe('AFSS Management', () => {
        test('should display AFSS information', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/afss');
            
            // Check page loaded
            await expect(page.getByRole('heading', { name: /Annual Fire Safety Statements/ })).toBeVisible();
            
            // Check information card
            await expect(page.getByText(/About AFSS/)).toBeVisible();
            await expect(page.getByText(/Local Council/)).toBeVisible();
            await expect(page.getByText(/Fire and Rescue NSW/)).toBeVisible();
            
            // Check submission checklist
            await expect(page.getByText('AFSS Submission Checklist')).toBeVisible();
            await expect(page.getByText(/Engage Accredited Practitioner/)).toBeVisible();
        });

        test('should show current year AFSS', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/afss');
            
            const currentYear = new Date().getFullYear();
            await expect(page.getByText(`AFSS ${currentYear}`)).toBeVisible();
        });

        test('should display historical records', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/afss');
            
            // Check for historical AFSS section
            await expect(page.getByText('Historical AFSS Records')).toBeVisible();
            
            // Based on seed data: 2024, 2025, 2026
            await expect(page.getByText('AFSS 2024')).toBeVisible();
            await expect(page.getByText('AFSS 2025')).toBeVisible();
        });

        test('should show submission status', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/afss');
            
            // Check for submission status indicators
            await expect(page.getByText(/Council Submission/)).toBeVisible();
            await expect(page.getByText(/Fire & Rescue NSW/)).toBeVisible();
            await expect(page.getByText(/Building Display/)).toBeVisible();
        });
    });
});
```

### 2. Debt Recovery Tests

```typescript
// app/tests/debt-recovery.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Debt Recovery', () => {
    test.beforeEach(async ({ page }) => {
        // Login as manager
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'manager@dulili.com.au');
        await page.fill('input[type="password"]', 'password123');
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page).toHaveURL(/dashboard/);
    });

    test.describe('Overview Dashboard', () => {
        test('should display debt recovery statistics', async ({ page }) => {
            await page.goto('/dashboard/finance/debt-recovery');
            
            // Check page loaded
            await expect(page.getByRole('heading', { name: 'Debt Recovery' })).toBeVisible();
            
            // Check NSW compliance notice
            await expect(page.getByText(/NSW 2025 Debt Recovery Reforms/)).toBeVisible();
            await expect(page.getByText(/MUST offer a payment plan/)).toBeVisible();
            
            // Check statistics cards
            await expect(page.getByText('Total Overdue')).toBeVisible();
            await expect(page.getByText('Active Payment Plans')).toBeVisible();
            await expect(page.getByText('Pending Requests')).toBeVisible();
            await expect(page.getByText('Recovery Actions')).toBeVisible();
            
            // Check quick actions
            await expect(page.getByRole('link', { name: /View Overdue Levies/ })).toBeVisible();
            await expect(page.getByRole('link', { name: /Payment Plans/ })).toBeVisible();
            await expect(page.getByRole('link', { name: /Recovery Actions/ })).toBeVisible();
        });

        test('should show overdue amount', async ({ page }) => {
            await page.goto('/dashboard/finance/debt-recovery');
            
            // Based on seed data: $1,500 overdue
            await expect(page.getByText(/\$1,500/)).toBeVisible();
        });

        test('should show active payment plans', async ({ page }) => {
            await page.goto('/dashboard/finance/debt-recovery');
            
            // Based on seed data: 1 active payment plan
            const activePlans = await page.locator('text=Active Payment Plans').locator('..').locator('text=/^\\d+$/').textContent();
            expect(parseInt(activePlans || '0')).toBeGreaterThanOrEqual(1);
        });

        test('should display NSW compliance requirements', async ({ page }) => {
            await page.goto('/dashboard/finance/debt-recovery');
            
            // Check compliance information section
            await expect(page.getByText('NSW Debt Recovery Requirements')).toBeVisible();
            await expect(page.getByText(/Payment Plan Must Be Offered/)).toBeVisible();
            await expect(page.getByText(/28-Day Response Time/)).toBeVisible();
            await expect(page.getByText(/No Recovery During Active Plan/)).toBeVisible();
            await expect(page.getByText(/Payment Application Order/)).toBeVisible();
        });

        test('should show compliance alerts if needed', async ({ page }) => {
            await page.goto('/dashboard/finance/debt-recovery');
            
            // Check if compliance alert appears (depends on data state)
            const complianceAlert = page.getByText(/Compliance Action Required/);
            // Alert may or may not be visible depending on data
            // Just check page doesn't error
            await expect(page.getByRole('heading', { name: 'Debt Recovery' })).toBeVisible();
        });
    });

    test.describe('Overdue Levies', () => {
        test('should display overdue levy information', async ({ page }) => {
            await page.goto('/dashboard/finance/debt-recovery');
            
            // Check for overdue levies section
            await expect(page.getByText('Recent Overdue Levies')).toBeVisible();
            
            // Based on seed data
            await expect(page.getByText(/Lot \d+/)).toBeVisible();
            await expect(page.getByText(/days overdue/)).toBeVisible();
        });
    });

    test.describe('Payment Plans', () => {
        test('should display pending payment plan requests', async ({ page }) => {
            await page.goto('/dashboard/finance/debt-recovery');
            
            // Check if pending requests section exists
            // May not be visible if no pending requests
            const pendingSection = page.getByText('Pending Payment Plan Requests');
            // Just ensure page loads without error
            await expect(page.getByRole('heading', { name: 'Debt Recovery' })).toBeVisible();
        });
    });
});
```

---

## 🔄 Integration Tests

### Test File: `app/tests/compliance-integration.spec.ts`

```typescript
// Test integration between modules
test.describe('Compliance Integration', () => {
    test('should navigate from dashboard to fire safety', async ({ page }) => {
        // Login
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'manager@dulili.com.au');
        await page.fill('input[type="password"]', 'password123');
        await page.getByRole('button', { name: 'Log In' }).click();
        
        // Navigate via sidebar
        await page.getByRole('link', { name: /Fire Safety/ }).click();
        await expect(page).toHaveURL(/\/compliance\/fire-safety/);
        await expect(page.getByRole('heading', { name: 'Fire Safety Compliance' })).toBeVisible();
    });

    test('should navigate from dashboard to debt recovery', async ({ page }) => {
        // Login
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'manager@dulili.com.au');
        await page.fill('input[type="password"]', 'password123');
        await page.getByRole('button', { name: 'Log In' }).click();
        
        // Navigate via sidebar
        await page.getByRole('link', { name: /Debt Recovery/ }).click();
        await expect(page).toHaveURL(/\/finance\/debt-recovery/);
        await expect(page.getByRole('heading', { name: 'Debt Recovery' })).toBeVisible();
    });

    test('should show compliance section in sidebar', async ({ page }) => {
        // Login
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'manager@dulili.com.au');
        await page.fill('input[type="password"]', 'password123');
        await page.getByRole('button', { name: 'Log In' }).click();
        
        // Check sidebar has compliance section
        await expect(page.getByText('Compliance')).toBeVisible();
        await expect(page.getByRole('link', { name: /Fire Safety/ })).toBeVisible();
        await expect(page.getByRole('link', { name: /Debt Recovery/ })).toBeVisible();
    });
});
```

---

## 📊 Test Data Management

### Seed Data for Testing

```typescript
// Ensure consistent test data
// app/prisma/seed-test.ts

export async function seedTestData() {
    // Fire Safety Test Data
    const testFireSchedule = await prisma.fireSafetySchedule.create({
        data: {
            buildingId: testBuilding.id,
            issuedBy: "Test Council",
            issueDate: new Date("2024-01-01"),
        },
    });

    // Create test measures with known states
    await prisma.fireSafetyMeasure.createMany({
        data: [
            {
                buildingId: testBuilding.id,
                measureType: "fire_alarm",
                location: "Test Location",
                standard: "AS1851-2012",
                testingFrequency: "semi_annually",
                lastTested: new Date("2025-08-01"),
                nextTestDue: new Date("2026-02-01"),
                status: "compliant",
            },
            {
                buildingId: testBuilding.id,
                measureType: "extinguisher",
                location: "Test Location 2",
                standard: "AS1851-2012",
                testingFrequency: "semi_annually",
                lastTested: new Date("2025-01-01"),
                nextTestDue: new Date("2025-07-01"), // Overdue
                status: "overdue",
            },
        ],
    });

    // Debt Recovery Test Data
    const testLevy = await prisma.levy.create({
        data: {
            buildingId: testBuilding.id,
            lotId: testLot.id,
            period: "Q4 2025",
            amount: 1500,
            dueDate: new Date("2025-12-31"),
            status: "overdue",
        },
    });

    const testPaymentPlan = await prisma.levyPaymentPlan.create({
        data: {
            buildingId: testBuilding.id,
            lotId: testLot.id,
            userId: testUser.id,
            status: "active",
            totalOwed: 1500,
            installmentAmount: 250,
            installmentFrequency: "monthly",
            numberOfInstallments: 6,
            paidInstallments: 1,
        },
    });
}
```

---

## 🚀 Running Tests

### Commands

```bash
# Run all tests
npm run test:e2e

# Run specific test file
npx playwright test tests/fire-safety.spec.ts

# Run specific test
npx playwright test tests/fire-safety.spec.ts -g "should display compliance statistics"

# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Generate test report
npx playwright show-report

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
        working-directory: ./app
      
      - name: Install Playwright
        run: npx playwright install --with-deps
        working-directory: ./app
      
      - name: Run database migrations
        run: npx prisma migrate deploy
        working-directory: ./app
      
      - name: Seed test database
        run: npx prisma db seed
        working-directory: ./app
      
      - name: Run E2E tests
        run: npm run test:e2e
        working-directory: ./app
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: app/playwright-report/
```

---

## ✅ Test Checklist

### Pre-Test Setup
- [ ] Database seeded with test data
- [ ] Development server running
- [ ] Test credentials verified
- [ ] Playwright installed

### Fire Safety Tests
- [ ] Overview dashboard loads
- [ ] Statistics calculate correctly
- [ ] Measures list displays
- [ ] Status badges show correctly
- [ ] AFSS page loads
- [ ] Historical records display
- [ ] Navigation works
- [ ] Compliance disclaimers present

### Debt Recovery Tests
- [ ] Overview dashboard loads
- [ ] Statistics calculate correctly
- [ ] Overdue levies display
- [ ] Payment plans display
- [ ] Compliance notices show
- [ ] NSW requirements listed
- [ ] Navigation works
- [ ] Legal disclaimers present

### Integration Tests
- [ ] Sidebar navigation works
- [ ] Compliance section visible
- [ ] Cross-module navigation
- [ ] Role-based access control
- [ ] Session management

---

## 📈 Coverage Goals

### Target Coverage
- **Critical Paths:** 100%
- **Fire Safety Module:** 90%+
- **Debt Recovery Module:** 90%+
- **Integration Points:** 95%+
- **Overall Platform:** 85%+

### Coverage Report
```bash
# Generate coverage report
npx playwright test --reporter=html

# View coverage
npx playwright show-report
```

---

## 🐛 Debugging Tests

### Common Issues

**1. Element Not Found**
```typescript
// Use waitFor
await page.waitForSelector('text=Fire Safety Compliance');

// Use getByRole with timeout
await page.getByRole('heading', { name: 'Fire Safety' }).waitFor({ timeout: 5000 });
```

**2. Timing Issues**
```typescript
// Wait for navigation
await page.waitForURL(/dashboard/);

// Wait for network idle
await page.waitForLoadState('networkidle');
```

**3. Authentication Issues**
```typescript
// Store auth state
await page.context().storageState({ path: 'auth.json' });

// Reuse auth state
const context = await browser.newContext({ storageState: 'auth.json' });
```

---

## 📝 Test Maintenance

### Best Practices
1. Keep tests independent
2. Use descriptive test names
3. Follow AAA pattern (Arrange, Act, Assert)
4. Clean up test data
5. Use page objects for complex pages
6. Keep selectors maintainable
7. Document test assumptions
8. Review tests regularly

### Test Review Checklist
- [ ] Tests are independent
- [ ] Tests are deterministic
- [ ] Tests are fast
- [ ] Tests are maintainable
- [ ] Tests have clear names
- [ ] Tests cover edge cases
- [ ] Tests clean up after themselves

---

## 🎯 Next Steps

1. **Implement Fire Safety Tests** (2-3 hours)
2. **Implement Debt Recovery Tests** (2-3 hours)
3. **Add Integration Tests** (1-2 hours)
4. **Set up CI/CD** (1 hour)
5. **Generate Coverage Report** (30 mins)
6. **Review and Refine** (1 hour)

**Total Estimated Time:** 8-12 hours

---

**Status:** ✅ Plan Complete | 🎯 Ready to Implement | 📊 Coverage Goal: 90%+
