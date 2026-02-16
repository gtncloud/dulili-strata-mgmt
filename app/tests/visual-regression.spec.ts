import { test, expect } from '@playwright/test';
import percySnapshot from '@percy/playwright';

/**
 * Visual Regression Testing with Percy
 * Captures visual snapshots of all pages to detect UI changes
 */

test.describe('Visual Regression Tests - Complete Platform', () => {
    // Login helper
    test.beforeEach(async ({ page }) => {
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'manager@dulili.com.au');
        await page.fill('input[type="password"]', 'password123');
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });
    });

    test.describe('Authentication & Landing', () => {
        test('Login page', async ({ page }) => {
            await page.goto('/auth/login');
            await percySnapshot(page, 'Login Page');
        });

        test('Register page', async ({ page }) => {
            await page.goto('/auth/register');
            await percySnapshot(page, 'Register Page');
        });
    });

    test.describe('Dashboard & Navigation', () => {
        test('Main dashboard', async ({ page }) => {
            await page.goto('/dashboard');
            await percySnapshot(page, 'Dashboard - Main');
        });
    });

    test.describe('Maintenance Management', () => {
        test('Maintenance requests list', async ({ page }) => {
            await page.goto('/dashboard/maintenance');
            await percySnapshot(page, 'Maintenance - Requests List');
        });

        test('New maintenance request', async ({ page }) => {
            await page.goto('/dashboard/maintenance/new');
            await percySnapshot(page, 'Maintenance - New Request Form');
        });

        test('Work orders list', async ({ page }) => {
            await page.goto('/dashboard/work-orders');
            await percySnapshot(page, 'Work Orders - List');
        });
    });

    test.describe('Announcements', () => {
        test('Announcements list', async ({ page }) => {
            await page.goto('/dashboard/announcements');
            await percySnapshot(page, 'Announcements - List');
        });

        test('New announcement', async ({ page }) => {
            await page.goto('/dashboard/announcements/new');
            await percySnapshot(page, 'Announcements - New Form');
        });
    });

    test.describe('Community Features', () => {
        test('Community chat', async ({ page }) => {
            await page.goto('/dashboard/community');
            await percySnapshot(page, 'Community - Chat Channels');
        });

        test('Marketplace', async ({ page }) => {
            await page.goto('/dashboard/marketplace');
            await percySnapshot(page, 'Marketplace - Listings');
        });

        test('New marketplace listing', async ({ page }) => {
            await page.goto('/dashboard/marketplace/new');
            await percySnapshot(page, 'Marketplace - New Listing Form');
        });

        test('Local businesses', async ({ page }) => {
            await page.goto('/dashboard/local-businesses');
            await percySnapshot(page, 'Local Businesses - Directory');
        });

        test('Neighbors directory', async ({ page }) => {
            await page.goto('/dashboard/neighbors');
            await percySnapshot(page, 'Neighbors - Directory');
        });

        test('My neighbor profile', async ({ page }) => {
            await page.goto('/dashboard/neighbors/my-profile');
            await percySnapshot(page, 'Neighbors - My Profile');
        });
    });

    test.describe('Amenities Booking', () => {
        test('Amenities list', async ({ page }) => {
            await page.goto('/dashboard/amenities');
            await percySnapshot(page, 'Amenities - List');
        });

        test('My bookings', async ({ page }) => {
            await page.goto('/dashboard/amenities/my-bookings');
            await percySnapshot(page, 'Amenities - My Bookings');
        });
    });

    test.describe('Surveys & Polls', () => {
        test('Surveys list', async ({ page }) => {
            await page.goto('/dashboard/surveys');
            await percySnapshot(page, 'Surveys - List');
        });

        test('New survey', async ({ page }) => {
            await page.goto('/dashboard/surveys/new');
            await percySnapshot(page, 'Surveys - New Form');
        });
    });

    test.describe('Sustainability', () => {
        test('Sustainability dashboard', async ({ page }) => {
            await page.goto('/dashboard/sustainability');
            await percySnapshot(page, 'Sustainability - Dashboard');
        });
    });

    test.describe('Smart Building', () => {
        test('Emergency response', async ({ page }) => {
            await page.goto('/dashboard/emergency');
            await percySnapshot(page, 'Smart Building - Emergency Response');
        });

        test('Predictive maintenance', async ({ page }) => {
            await page.goto('/dashboard/predictive-maintenance');
            await percySnapshot(page, 'Smart Building - Predictive Maintenance');
        });

        test('IoT dashboard', async ({ page }) => {
            await page.goto('/dashboard/iot');
            await percySnapshot(page, 'Smart Building - IoT Dashboard');
        });
    });

    test.describe('Fire Safety Compliance', () => {
        test('Fire safety overview', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety');
            await percySnapshot(page, 'Fire Safety - Overview');
        });

        test('Fire safety measures', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/measures');
            await percySnapshot(page, 'Fire Safety - Measures List');
        });

        test('AFSS management', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/afss');
            await percySnapshot(page, 'Fire Safety - AFSS Management');
        });

        test('Fire safety inspections', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/inspections');
            await percySnapshot(page, 'Fire Safety - Inspections');
        });

        test('Emergency plan', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/emergency-plan');
            await percySnapshot(page, 'Fire Safety - Emergency Plan');
        });
    });

    test.describe('Debt Recovery', () => {
        test('Debt recovery overview', async ({ page }) => {
            await page.goto('/dashboard/finance/debt-recovery');
            await percySnapshot(page, 'Debt Recovery - Overview');
        });

        test('Overdue levies', async ({ page }) => {
            await page.goto('/dashboard/finance/debt-recovery/overdue');
            await percySnapshot(page, 'Debt Recovery - Overdue Levies');
        });

        test('Payment plans list', async ({ page }) => {
            await page.goto('/dashboard/finance/debt-recovery/payment-plans');
            await percySnapshot(page, 'Debt Recovery - Payment Plans');
        });

        test('Payment plan request form', async ({ page }) => {
            await page.goto('/dashboard/finance/debt-recovery/payment-plans/new');
            await percySnapshot(page, 'Debt Recovery - Payment Plan Request');
        });

        test('Recovery actions', async ({ page }) => {
            await page.goto('/dashboard/finance/debt-recovery/actions');
            await percySnapshot(page, 'Debt Recovery - Actions History');
        });
    });

    test.describe('Finance Management', () => {
        test('Levy management', async ({ page }) => {
            await page.goto('/dashboard/finance');
            await percySnapshot(page, 'Finance - Levy Management');
        });

        test('New levy', async ({ page }) => {
            await page.goto('/dashboard/finance/levies/new');
            await percySnapshot(page, 'Finance - New Levy Form');
        });
    });

    test.describe('Document Library', () => {
        test('Documents list', async ({ page }) => {
            await page.goto('/dashboard/documents');
            await percySnapshot(page, 'Documents - Library');
        });

        test('Upload document', async ({ page }) => {
            await page.goto('/dashboard/documents/new');
            await percySnapshot(page, 'Documents - Upload Form');
        });
    });

    test.describe('Building & Members', () => {
        test('Building profile', async ({ page }) => {
            await page.goto('/dashboard/building');
            await percySnapshot(page, 'Building - Profile');
        });

        test('Member directory', async ({ page }) => {
            await page.goto('/dashboard/members');
            await percySnapshot(page, 'Members - Directory');
        });
    });

    test.describe('Meeting Scheduler', () => {
        test('Meetings list', async ({ page }) => {
            await page.goto('/dashboard/meetings');
            await percySnapshot(page, 'Meetings - List');
        });

        test('New meeting', async ({ page }) => {
            await page.goto('/dashboard/meetings/new');
            await percySnapshot(page, 'Meetings - New Form');
        });
    });

    test.describe('User Profile', () => {
        test('Profile settings', async ({ page }) => {
            await page.goto('/dashboard/profile');
            await percySnapshot(page, 'Profile - Settings');
        });
    });

    test.describe('Responsive Design', () => {
        test('Mobile - Dashboard', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/dashboard');
            await percySnapshot(page, 'Mobile - Dashboard', {
                widths: [375]
            });
        });

        test('Tablet - Dashboard', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto('/dashboard');
            await percySnapshot(page, 'Tablet - Dashboard', {
                widths: [768]
            });
        });

        test('Desktop - Dashboard', async ({ page }) => {
            await page.setViewportSize({ width: 1920, height: 1080 });
            await page.goto('/dashboard');
            await percySnapshot(page, 'Desktop - Dashboard', {
                widths: [1920]
            });
        });
    });
});
