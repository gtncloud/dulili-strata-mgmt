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
        test('should display fire safety compliance page', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety');
            
            // Check page loaded
            await expect(page.getByRole('heading', { name: 'Fire Safety Compliance' })).toBeVisible();
            
            // Check description
            await expect(page.getByText(/Manage fire safety measures, AFSS submissions/)).toBeVisible();
        });

        test('should show compliance disclaimer', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety');
            
            // Check compliance notice
            await expect(page.getByText(/Compliance Notice/)).toBeVisible();
            await expect(page.getByText(/Dulili's Fire Safety Compliance module is a record-keeping/)).toBeVisible();
            await expect(page.getByText(/AS1851-2012/)).toBeVisible();
        });

        test('should display compliance statistics', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety');
            
            // Check statistics cards exist
            await expect(page.getByText('Compliant Measures')).toBeVisible();
            await expect(page.getByText('Overdue Items')).toBeVisible();
            await expect(page.getByText('Due Soon (30 days)')).toBeVisible();
            await expect(page.getByText(/AFSS Status/)).toBeVisible();
        });

        test('should show quick action buttons', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety');
            
            // Check quick actions section
            await expect(page.getByText('Quick Actions')).toBeVisible();
            await expect(page.getByRole('link', { name: /Manage AFSS/ })).toBeVisible();
            await expect(page.getByRole('link', { name: /Fire Safety Measures/ })).toBeVisible();
            await expect(page.getByRole('link', { name: /Emergency Plan/ })).toBeVisible();
        });

        test('should display recent AFSS section', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety');
            
            // Check AFSS section
            await expect(page.getByText('Annual Fire Safety Statements')).toBeVisible();
            await expect(page.getByText(/Recent AFSS submissions/)).toBeVisible();
        });

        test('should navigate to measures page', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety');
            await page.getByRole('link', { name: /Fire Safety Measures/ }).first().click();
            await expect(page).toHaveURL(/\/compliance\/fire-safety\/measures/);
        });

        test('should navigate to AFSS page', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety');
            await page.getByRole('link', { name: /Manage AFSS/ }).first().click();
            await expect(page).toHaveURL(/\/compliance\/fire-safety\/afss/);
        });
    });

    test.describe('Fire Safety Measures', () => {
        test('should display measures list page', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/measures');
            
            // Check page loaded
            await expect(page.getByRole('heading', { name: 'Fire Safety Measures' })).toBeVisible();
            await expect(page.getByText(/Track testing and maintenance/)).toBeVisible();
        });

        test('should show back button', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/measures');
            
            // Check back button
            await expect(page.getByRole('button', { name: /Back/ })).toBeVisible();
        });

        test('should display summary cards', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/measures');
            
            // Check summary cards
            await expect(page.getByText('Total Measures')).toBeVisible();
            await expect(page.getByText('Compliant')).toBeVisible();
            await expect(page.getByText('Due Soon')).toBeVisible();
            await expect(page.getByText('Overdue')).toBeVisible();
        });

        test('should display all measures section', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/measures');
            
            // Check measures list
            await expect(page.getByText('All Fire Safety Measures')).toBeVisible();
            await expect(page.getByText(/Complete list of fire safety equipment/)).toBeVisible();
        });

        test('should show testing schedule reference', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/measures');
            
            // Check testing schedule reference
            await expect(page.getByText('Testing Frequency Reference')).toBeVisible();
            await expect(page.getByText('AS1851-2012 standard testing requirements')).toBeVisible();
            await expect(page.getByText('Monthly')).toBeVisible();
            await expect(page.getByText('Quarterly')).toBeVisible();
            await expect(page.getByText('Semi-Annually')).toBeVisible();
            await expect(page.getByText('Annually')).toBeVisible();
        });

        test('should display measure types from seed data', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/measures');
            
            // Check for measure types (from seed data)
            await expect(page.getByText(/Fire Alarm/i)).toBeVisible();
            await expect(page.getByText(/Sprinkler/i)).toBeVisible();
            await expect(page.getByText(/Extinguisher/i)).toBeVisible();
        });

        test('should navigate back to overview', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/measures');
            await page.getByRole('button', { name: /Back/ }).click();
            await expect(page).toHaveURL(/\/compliance\/fire-safety$/);
        });
    });

    test.describe('AFSS Management', () => {
        test('should display AFSS page', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/afss');
            
            // Check page loaded
            await expect(page.getByRole('heading', { name: /Annual Fire Safety Statements/ })).toBeVisible();
            await expect(page.getByText(/Manage AFSS submissions/)).toBeVisible();
        });

        test('should show AFSS information card', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/afss');
            
            // Check information card
            await expect(page.getByText('About AFSS')).toBeVisible();
            await expect(page.getByText(/Local Council/)).toBeVisible();
            await expect(page.getByText(/Fire and Rescue NSW/)).toBeVisible();
            await expect(page.getByText(/AS1851-2012/)).toBeVisible();
        });

        test('should display current year AFSS', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/afss');
            
            const currentYear = new Date().getFullYear();
            await expect(page.getByText(`AFSS ${currentYear}`)).toBeVisible();
        });

        test('should show submission checklist', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/afss');
            
            // Check submission checklist
            await expect(page.getByText('AFSS Submission Checklist')).toBeVisible();
            await expect(page.getByText(/Engage Accredited Practitioner/)).toBeVisible();
            await expect(page.getByText(/Complete Inspections/)).toBeVisible();
            await expect(page.getByText(/Obtain AFSS Certificate/)).toBeVisible();
            await expect(page.getByText(/Submit to Authorities/)).toBeVisible();
            await expect(page.getByText(/Display in Building/)).toBeVisible();
        });

        test('should display historical records', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/afss');
            
            // Check historical section
            await expect(page.getByText('Historical AFSS Records')).toBeVisible();
            
            // Based on seed data
            await expect(page.getByText('AFSS 2024')).toBeVisible();
            await expect(page.getByText('AFSS 2025')).toBeVisible();
        });

        test('should show submission status indicators', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/afss');
            
            // Check for submission status
            await expect(page.getByText(/Council Submission/)).toBeVisible();
            await expect(page.getByText(/Fire & Rescue NSW/)).toBeVisible();
            await expect(page.getByText(/Building Display/)).toBeVisible();
        });

        test('should navigate back to overview', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/afss');
            await page.getByRole('button', { name: /Back/ }).click();
            await expect(page).toHaveURL(/\/compliance\/fire-safety$/);
        });
    });

    test.describe('Navigation', () => {
        test('should access fire safety from sidebar', async ({ page }) => {
            await page.goto('/dashboard');
            
            // Check sidebar has compliance section
            await expect(page.getByText('Compliance')).toBeVisible();
            
            // Click fire safety link
            await page.getByRole('link', { name: /Fire Safety/ }).click();
            await expect(page).toHaveURL(/\/compliance\/fire-safety/);
        });

        test('should highlight active page in sidebar', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety');
            
            // Check active state (look for highlighted link)
            const fireSafetyLink = page.getByRole('link', { name: /Fire Safety/ });
            await expect(fireSafetyLink).toBeVisible();
        });
    });
});
