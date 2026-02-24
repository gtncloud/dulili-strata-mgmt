# Dulili Testing - Quick Start Guide

## 🚀 Run All Tests (Recommended)

```bash
cd app
./test-all.sh
```

This will test ALL 24 features across the entire platform!

---

## 📊 View Test Results

After tests complete:

```bash
npx playwright show-report
```

This opens an interactive HTML report in your browser showing:
- ✅ Pass/fail status for each test
- 📸 Screenshots of any failures
- ⏱️ Execution times
- 📝 Detailed error messages

---

## 🎯 What Gets Tested

### Complete Platform Coverage (100+ tests)

✅ **Management & Community**
- Dashboard, Maintenance, Announcements
- Community Chat, Marketplace, Neighbors
- Amenities Booking

✅ **Surveys & Engagement**
- Surveys & Polls, Meeting Scheduler

✅ **Sustainability**
- Sustainability Dashboard

✅ **Smart Building**
- Emergency Response, Predictive Maintenance, IoT

✅ **Compliance** (NEW!)
- Fire Safety (5 pages, 20+ tests)
- Debt Recovery (6 pages, 15+ tests)

✅ **Finance & Documents**
- Levy Management, Document Library, Building Profile

✅ **User Management**
- Member Directory, User Profile, Search, Auth

---

## 🔧 Run Specific Tests

```bash
# Just Fire Safety tests
npx playwright test tests/fire-safety.spec.ts

# Just Debt Recovery tests
npx playwright test tests/debt-recovery.spec.ts

# Complete E2E suite
npx playwright test tests/complete-e2e.spec.ts

# Authentication tests
npx playwright test tests/auth.spec.ts
```

---

## 👀 See Tests Running (Headed Mode)

```bash
npx playwright test --headed
```

This opens a browser so you can watch the tests run!

---

## 🐛 Debug Mode

```bash
npx playwright test --debug
```

Step through tests one by one with the Playwright Inspector.

---

## 📁 Test Files Location

```
app/tests/
├── auth.spec.ts              (Authentication)
├── dashboard.spec.ts          (Dashboard & Navigation)
├── maintenance.spec.ts        (Maintenance Requests)
├── fire-safety.spec.ts        (Fire Safety - 20+ tests)
├── debt-recovery.spec.ts      (Debt Recovery - 15+ tests)
└── complete-e2e.spec.ts       (All Features - 100+ tests)
```

---

## 🎨 Test Reports Location

After running tests, find reports here:

```
app/playwright-report/         (HTML reports)
app/test-results/              (Screenshots, videos)
```

---

## ✅ Before Running Tests

Make sure:
1. ✅ Dev server is running: `npm run dev`
2. ✅ Database is seeded: `npx prisma db seed`
3. ✅ You're in the app directory: `cd app`

---

## 🎯 Quick Commands

```bash
# Run all tests
./test-all.sh

# View report
npx playwright show-report

# Run with browser visible
npx playwright test --headed

# Debug tests
npx playwright test --debug

# Run specific test
npx playwright test -g "should display fire safety"

# Run on specific browser
npx playwright test --project=chromium
```

---

## 📈 Expected Results

When all tests pass, you should see:

```
✓ 100+ tests passing
✓ All 24 features tested
✓ All pages loading correctly
✓ Navigation working
✓ Data displaying correctly
```

---

## 🆘 If Tests Fail

1. Check dev server is running: `http://localhost:3000`
2. Check database is seeded
3. View the HTML report: `npx playwright show-report`
4. Look at failure screenshots in `test-results/`
5. Run failing test in debug mode: `npx playwright test -g "test name" --debug`

---

## 🎉 That's It!

You now have comprehensive end-to-end testing for the entire Dulili platform!

**Total Coverage:**
- 6 test files
- 100+ test cases
- 24 features
- 50+ pages

**Run tests:** `./test-all.sh`  
**View results:** `npx playwright show-report`

Happy testing! 🚀
