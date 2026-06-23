import { test, expect } from '@playwright/test';
import { testData } from '../testData';
import { AdminPage } from '../pages/admin';
import { HomePage } from '../pages/home';

let adminPage: AdminPage;
let homePage: HomePage;

test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page);
    homePage = new HomePage(page);

    await page.goto(`${testData.url}/admin`);
});

test.describe('Admin Authentication & Dashboard Suite', () => {

    test('should successfully log in via admin portal and verify session views', async ({ page }) => {
        await adminPage.login(
            testData.users.admin.username,
            testData.users.admin.password
        );

        await expect(page).toHaveURL(/admin/);

        await expect(adminPage.logoutButton()).toBeVisible();
    });
    // still in progress
    test('(Bonus) admin rooms panel matches public room types', async ({ page }) => {
        // Step 1: grab first room type from public homepage
        await page.goto(testData.url);
        const homePageRoom = await homePage.roomsFirstRoom().innerText();

        // Step 2: log in to admin (already on /admin from beforeEach)
        await page.goto(`${testData.url}/admin`);
        await adminPage.login(
            testData.users.admin.username,
            testData.users.admin.password
        );

        // Step 3: already on /admin/rooms after login - verify room type appears in the table
        await expect(page).toHaveURL(/admin\/rooms/);
        await expect(page.locator(`p#type${homePageRoom}`)).toBeVisible();

    });
});