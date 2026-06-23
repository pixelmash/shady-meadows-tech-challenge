import { test, expect } from '@playwright/test';
import { testData } from '../testData';
import { AdminPage } from '../pages/admin';
import { HomePage } from '../pages/home';

let adminPage: AdminPage;
let homePage: HomePage;

test.beforeEach(async ({ page }) => {
    await page.goto(`${testData.url}/admin`);
    adminPage = new AdminPage(page);
    homePage = new HomePage(page);
});

test.describe('Admin Authentication & Dashboard Suite', () => {

    test.fail('should successfully log in via admin and verify the content', async ({ page }) => {
        // Admin login
        await adminPage.login(
            testData.users.admin.username,
            testData.users.admin.password
        );

        await expect(page).toHaveURL(/admin/);
        // Check for logout button
        await expect(adminPage.logoutButton()).toBeVisible();
        // BUG #5: Navigating to admin page doesnt lead to 'Dashboard/Inboxes' view  
        await expect(adminPage.navSectionLink('Dashboard/Inboxes')).toBeVisible();
    });

    test('(Bonus) admin panel rooms matches front page rooms', async ({ page }) => {
        // Grab the first room from the from page
        await page.goto(testData.url);
        await expect(homePage.roomsSection()).toBeVisible();
        await expect(homePage.roomsFirstRoom()).toBeVisible();
        const homePageRoom = await homePage.roomsFirstRoom().innerText();

        // Admin login
        await page.goto(`${testData.url}/admin`);
        await adminPage.login(
            testData.users.admin.username,
            testData.users.admin.password
        );

        // Check that the room is present on the admin page
        await expect(page).toHaveURL(/admin\/rooms/);
        await expect(page.locator(`p#type${homePageRoom}`).first()).toBeVisible();
    });
});