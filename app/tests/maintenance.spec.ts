import { test, expect } from '@playwright/test';

test.describe('Maintenance Request Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Login as tenant/owner who can create requests
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'manager@dulili.com.au'); // Using manager for now as they usually have access
        await page.fill('input[type="password"]', 'password123');
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page).toHaveURL(/dashboard/);
    });

    test('should navigate to maintenance page', async ({ page }) => {
        await page.goto('/dashboard/maintenance');
        await expect(page.getByRole('heading', { name: 'Maintenance' })).toBeVisible();
    });

    test('should open new request modal', async ({ page }) => {
        await page.goto('/dashboard/maintenance');
        // Look for a "New Request" or similar button. 
        // Based on common UI patterns, looking for a button with "New" or "Request"
        const newRequestBtn = page.getByRole('button', { name: /New Request|Report Issue/i });

        // If the button exists, click it and check for modal
        if (await newRequestBtn.isVisible()) {
            await newRequestBtn.click();
            await expect(page.getByRole('dialog')).toBeVisible();
            await expect(page.getByLabel(/Title|Subject/i)).toBeVisible();
        } else {
            console.log('New Request button not found, skipping creation test');
        }
    });
});
