import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation', () => {
    // Helper to login before each test
    test.beforeEach(async ({ page }) => {
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'manager@dulili.com.au');
        await page.fill('input[type="password"]', 'password123');
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page).toHaveURL(/dashboard/);
    });

    test('should display dashboard overview', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
        // Check for common widgets
        await expect(page.getByText('Quick Actions')).toBeVisible();
    });

    test('should navigate to maintenance page', async ({ page }) => {
        await page.getByRole('link', { name: 'Maintenance' }).click();
        await expect(page).toHaveURL(/maintenance/);
        await expect(page.getByRole('heading', { name: 'Maintenance' })).toBeVisible();
    });

    test('should navigate to announcements page', async ({ page }) => {
        await page.getByRole('link', { name: 'Announcements' }).click();
        await expect(page).toHaveURL(/announcements/);
        await expect(page.getByRole('heading', { name: 'Announcements' })).toBeVisible();
    });
});
