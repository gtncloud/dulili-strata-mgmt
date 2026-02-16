import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should navigate to login page', async ({ page }) => {
        await page.goto('/auth/login');
        await expect(page).toHaveTitle(/Dulili/);
        await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
    });

    test('should show error with invalid credentials', async ({ page }) => {
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'wrong@example.com');
        await page.fill('input[type="password"]', 'wrongpassword');
        await page.getByRole('button', { name: 'Log In' }).click();
        // Assuming there's an error message. Adjust selector based on actual implementation.
        // Start with broad check if specific selector unknown
        await expect(page.getByText('Invalid email or password')).toBeVisible();
    });

    test('should login successfully with valid credentials', async ({ page }) => {
        // Using the seeded manager credentials from README
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'manager@dulili.com.au');
        await page.fill('input[type="password"]', 'password123');
        await page.getByRole('button', { name: 'Log In' }).click();

        // Should redirect to dashboard
        await expect(page).toHaveURL(/dashboard/);
        await expect(page.getByText('Welcome back')).toBeVisible(); // Adjust based on actual dashboard text
    });
});
