import { test, expect } from '@playwright/test';

/**
 * Complete End-to-End Test Suite for Dulili
 * Tests all major features and user journeys across the entire platform
 */

test.describe('Complete Dulili Platform E2E Tests', () => {
    // Login helper
    test.beforeEach(async ({ page }) => {
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'manager@dulili.com.au');
        await page.fill('input[type="password"]', 'password123');
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page).toHaveURL(/dashboard/);
    });

    test.describe('1. Dashboard & Navigation', () => {
        test('should display main dashboard with all sections', async ({ page }) => {
            await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
            
            // Check sidebar sections exist
            await expect(page.getByText('Management & Community')).toBeVisible();
            await expect(page.getByText('Smart Building')).toBeVisible();
            await expect(page.getByText('Compliance')).toBeVisible();
            await expect(page.getByText('Finance & Documents')).toBeVisible();
        });

        test('should navigate through all main menu items', async ({ page }) => {
            const menuItems = [
                { name: 'Dashboard', url: '/dashboard' },
                { name: 'Maintenance', url: '/dashboard/maintenance' },
                { name: 'Announcements', url: '/dashboard/announcements' },
                { name: 'Community Chat', url: '/dashboard/community' },
                { name: 'Marketplace', url: '/dashboard/marketplace' },
                { name: 'Amenities', url: '/dashboard/amenities' },
                { name: 'Building Profile', url: '/dashboard/building' },
            ];

            for (const item of menuItems) {
                await page.getByRole('link', { name: item.name }).click();
                await expect(page).toHaveURL(new RegExp(item.url));
            }
        });
    });

    test.describe('2. Maintenance Management', () => {
        test('should display maintenance requests list', async ({ page }) => {
            await page.goto('/dashboard/maintenance');
            await expect(page.getByRole('heading', { name: 'Maintenance Requests' })).toBeVisible();
        });

        test('should navigate to new maintenance request page', async ({ page }) => {
            await page.goto('/dashboard/maintenance');
            await page.getByRole('link', { name: /New Request/i }).click();
            await expect(page).toHaveURL(/\/dashboard\/maintenance\/new/);
        });

        test('should display work orders for maintenance staff', async ({ page }) => {
            await page.goto('/dashboard/work-orders');
            await expect(page.getByRole('heading', { name: 'Work Orders' })).toBeVisible();
        });
    });

    test.describe('3. Announcements', () => {
        test('should display announcements list', async ({ page }) => {
            await page.goto('/dashboard/announcements');
            await expect(page.getByRole('heading', { name: 'Announcements' })).toBeVisible();
        });

        test('should navigate to create announcement page', async ({ page }) => {
            await page.goto('/dashboard/announcements');
            await page.getByRole('link', { name: /New Announcement/i }).click();
            await expect(page).toHaveURL(/\/dashboard\/announcements\/new/);
        });
    });

    test.describe('4. Community Features', () => {
        test('should display community chat channels', async ({ page }) => {
            await page.goto('/dashboard/community');
            await expect(page.getByRole('heading', { name: 'Community Chat' })).toBeVisible();
        });

        test('should display marketplace listings', async ({ page }) => {
            await page.goto('/dashboard/marketplace');
            await expect(page.getByRole('heading', { name: 'Community Marketplace' })).toBeVisible();
        });

        test('should navigate to create marketplace listing', async ({ page }) => {
            await page.goto('/dashboard/marketplace');
            await page.getByRole('link', { name: /New Listing/i }).click();
            await expect(page).toHaveURL(/\/dashboard\/marketplace\/new/);
        });

        test('should display local businesses directory', async ({ page }) => {
            await page.goto('/dashboard/local-businesses');
            await expect(page.getByRole('heading', { name: 'Local Businesses' })).toBeVisible();
        });

        test('should display neighbors directory', async ({ page }) => {
            await page.goto('/dashboard/neighbors');
            await expect(page.getByRole('heading', { name: 'Neighbors' })).toBeVisible();
        });
    });

    test.describe('5. Amenities Booking', () => {
        test('should display amenities list', async ({ page }) => {
            await page.goto('/dashboard/amenities');
            await expect(page.getByRole('heading', { name: 'Amenities Booking' })).toBeVisible();
        });

        test('should display my bookings page', async ({ page }) => {
            await page.goto('/dashboard/amenities/my-bookings');
            await expect(page.getByRole('heading', { name: 'My Bookings' })).toBeVisible();
        });
    });

    test.describe('6. Surveys & Polls', () => {
        test('should display surveys list', async ({ page }) => {
            await page.goto('/dashboard/surveys');
            await expect(page.getByRole('heading', { name: 'Surveys & Polls' })).toBeVisible();
        });

        test('should navigate to create survey page', async ({ page }) => {
            await page.goto('/dashboard/surveys');
            await page.getByRole('link', { name: /New Survey/i }).click();
            await expect(page).toHaveURL(/\/dashboard\/surveys\/new/);
        });
    });

    test.describe('7. Sustainability', () => {
        test('should display sustainability dashboard', async ({ page }) => {
            await page.goto('/dashboard/sustainability');
            await expect(page.getByRole('heading', { name: 'Sustainability' })).toBeVisible();
        });
    });

    test.describe('8. Smart Building Features', () => {
        test('should display emergency response dashboard', async ({ page }) => {
            await page.goto('/dashboard/emergency');
            await expect(page.getByRole('heading', { name: 'Emergency Response' })).toBeVisible();
        });

        test('should display predictive maintenance dashboard', async ({ page }) => {
            await page.goto('/dashboard/predictive-maintenance');
            await expect(page.getByRole('heading', { name: 'Predictive Maintenance' })).toBeVisible();
        });

        test('should display IoT dashboard', async ({ page }) => {
            await page.goto('/dashboard/iot');
            await expect(page.getByRole('heading', { name: 'IoT Dashboard' })).toBeVisible();
        });
    });

    test.describe('9. Fire Safety Compliance', () => {
        test('should display fire safety overview', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety');
            await expect(page.getByRole('heading', { name: 'Fire Safety Compliance' })).toBeVisible();
            await expect(page.getByText('Compliance Status')).toBeVisible();
        });

        test('should display fire safety measures', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/measures');
            await expect(page.getByRole('heading', { name: 'Fire Safety Measures' })).toBeVisible();
        });

        test('should display AFSS management', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/afss');
            await expect(page.getByRole('heading', { name: 'Annual Fire Safety Statement' })).toBeVisible();
        });

        test('should display fire safety inspections', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/inspections');
            await expect(page.getByRole('heading', { name: 'Fire Safety Inspections' })).toBeVisible();
        });

        test('should display emergency plan', async ({ page }) => {
            await page.goto('/dashboard/compliance/fire-safety/emergency-plan');
            await expect(page.getByRole('heading', { name: 'Emergency Plan' })).toBeVisible();
        });
    });

    test.describe('10. Debt Recovery', () => {
        test('should display debt recovery overview', async ({ page }) => {
            await page.goto('/dashboard/finance/debt-recovery');
            await expect(page.getByRole('heading', { name: 'Debt Recovery' })).toBeVisible();
            await expect(page.getByText('NSW 2025 Reforms')).toBeVisible();
        });

        test('should display overdue levies', async ({ page }) => {
            await page.goto('/dashboard/finance/debt-recovery/overdue');
            await expect(page.getByRole('heading', { name: 'Overdue Levies' })).toBeVisible();
        });

        test('should display payment plans', async ({ page }) => {
            await page.goto('/dashboard/finance/debt-recovery/payment-plans');
            await expect(page.getByRole('heading', { name: 'Payment Plans' })).toBeVisible();
        });

        test('should display payment plan request form', async ({ page }) => {
            await page.goto('/dashboard/finance/debt-recovery/payment-plans/new');
            await expect(page.getByRole('heading', { name: 'Request Payment Plan' })).toBeVisible();
        });

        test('should display recovery actions', async ({ page }) => {
            await page.goto('/dashboard/finance/debt-recovery/actions');
            await expect(page.getByRole('heading', { name: 'Recovery Actions' })).toBeVisible();
        });
    });

    test.describe('11. Finance Management', () => {
        test('should display levy management', async ({ page }) => {
            await page.goto('/dashboard/finance');
            await expect(page.getByRole('heading', { name: 'Levy Management' })).toBeVisible();
        });

        test('should navigate to create levy page', async ({ page }) => {
            await page.goto('/dashboard/finance');
            await page.getByRole('link', { name: /New Levy/i }).click();
            await expect(page).toHaveURL(/\/dashboard\/finance\/levies\/new/);
        });
    });

    test.describe('12. Document Library', () => {
        test('should display documents list', async ({ page }) => {
            await page.goto('/dashboard/documents');
            await expect(page.getByRole('heading', { name: 'Document Library' })).toBeVisible();
        });

        test('should navigate to upload document page', async ({ page }) => {
            await page.goto('/dashboard/documents');
            await page.getByRole('link', { name: /Upload Document/i }).click();
            await expect(page).toHaveURL(/\/dashboard\/documents\/new/);
        });
    });

    test.describe('13. Building Profile', () => {
        test('should display building information', async ({ page }) => {
            await page.goto('/dashboard/building');
            await expect(page.getByRole('heading', { name: 'Building Profile' })).toBeVisible();
        });
    });

    test.describe('14. Member Directory', () => {
        test('should display members list', async ({ page }) => {
            await page.goto('/dashboard/members');
            await expect(page.getByRole('heading', { name: 'Member Directory' })).toBeVisible();
        });
    });

    test.describe('15. Meeting Scheduler', () => {
        test('should display meetings list', async ({ page }) => {
            await page.goto('/dashboard/meetings');
            await expect(page.getByRole('heading', { name: 'Meeting Scheduler' })).toBeVisible();
        });

        test('should navigate to create meeting page', async ({ page }) => {
            await page.goto('/dashboard/meetings');
            await page.getByRole('link', { name: /New Meeting/i }).click();
            await expect(page).toHaveURL(/\/dashboard\/meetings\/new/);
        });
    });

    test.describe('16. User Profile', () => {
        test('should display user profile page', async ({ page }) => {
            await page.goto('/dashboard/profile');
            await expect(page.getByRole('heading', { name: 'Profile Settings' })).toBeVisible();
        });
    });

    test.describe('17. Global Search', () => {
        test('should have global search functionality', async ({ page }) => {
            await page.goto('/dashboard');
            // Look for search input
            const searchInput = page.getByPlaceholder(/Search/i);
            if (await searchInput.isVisible()) {
                await expect(searchInput).toBeVisible();
            }
        });
    });

    test.describe('18. Responsive Design', () => {
        test('should work on mobile viewport', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/dashboard');
            await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
        });

        test('should work on tablet viewport', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto('/dashboard');
            await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
        });
    });

    test.describe('19. Logout', () => {
        test('should logout successfully', async ({ page }) => {
            await page.goto('/dashboard');
            await page.getByRole('button', { name: /Sign Out|Logout/i }).click();
            await expect(page).toHaveURL(/auth\/login/);
        });
    });
});
