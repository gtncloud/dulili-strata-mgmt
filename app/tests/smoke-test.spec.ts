import { test, expect } from '@playwright/test';

/**
 * Smoke Tests - Quick validation that all pages load
 * Run this first to ensure everything is working
 */

test.describe('Smoke Tests - All Pages Load', () => {
    test.beforeEach(async ({ page }) => {
        // Login once
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'manager@dulili.com.au');
        await page.fill('input[type="password"]', 'password123');
        await page.getByRole('button', { name: 'Log In' }).click();
        await page.waitForURL(/dashboard/, { timeout: 10000 });
    });

    const pages = [
        { name: 'Dashboard', url: '/dashboard' },
        { name: 'Maintenance', url: '/dashboard/maintenance' },
        { name: 'Work Orders', url: '/dashboard/work-orders' },
        { name: 'Announcements', url: '/dashboard/announcements' },
        { name: 'Community Chat', url: '/dashboard/community' },
        { name: 'Marketplace', url: '/dashboard/marketplace' },
        { name: 'Local Businesses', url: '/dashboard/local-businesses' },
        { name: 'Neighbors', url: '/dashboard/neighbors' },
        { name: 'Amenities', url: '/dashboard/amenities' },
        { name: 'Surveys', url: '/dashboard/surveys' },
        { name: 'Sustainability', url: '/dashboard/sustainability' },
        { name: 'Emergency Response', url: '/dashboard/emergency' },
        { name: 'Predictive Maintenance', url: '/dashboard/predictive-maintenance' },
        { name: 'IoT Dashboard', url: '/dashboard/iot' },
        { name: 'Fire Safety', url: '/dashboard/compliance/fire-safety' },
        { name: 'Fire Safety Measures', url: '/dashboard/compliance/fire-safety/measures' },
        { name: 'Fire Safety AFSS', url: '/dashboard/compliance/fire-safety/afss' },
        { name: 'Fire Safety Inspections', url: '/dashboard/compliance/fire-safety/inspections' },
        { name: 'Emergency Plan', url: '/dashboard/compliance/fire-safety/emergency-plan' },
        { name: 'Debt Recovery', url: '/dashboard/finance/debt-recovery' },
        { name: 'Overdue Levies', url: '/dashboard/finance/debt-recovery/overdue' },
        { name: 'Payment Plans', url: '/dashboard/finance/debt-recovery/payment-plans' },
        { name: 'Recovery Actions', url: '/dashboard/finance/debt-recovery/actions' },
        { name: 'Levy Management', url: '/dashboard/finance' },
        { name: 'Documents', url: '/dashboard/documents' },
        { name: 'Building Profile', url: '/dashboard/building' },
        { name: 'Members', url: '/dashboard/members' },
        { name: 'Meetings', url: '/dashboard/meetings' },
        { name: 'Profile', url: '/dashboard/profile' },
    ];

    for (const pageInfo of pages) {
        test(`${pageInfo.name} page loads`, async ({ page }) => {
            await page.goto(pageInfo.url);
            // Wait for page to be fully loaded
            await page.waitForLoadState('networkidle', { timeout: 30000 });
            // Check that we're on the right page
            await expect(page).toHaveURL(new RegExp(pageInfo.url));
            // Take a screenshot for visual verification
            await page.screenshot({ path: `test-results/smoke-${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}.png`, fullPage: false });
        });
    }
});
