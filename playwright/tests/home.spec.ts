import { test, expect } from '@playwright/test';
import { testData } from '../testData';
import { HomePage } from '../pages/home';

let home: HomePage;

function getFormattedDate(daysOffset = 0) {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toLocaleDateString('en-GB');
}

test.beforeEach(async ({ page }) => {
    await page.goto(testData.url as string);
    home = new HomePage(page);
});

test.describe('Homepage Sanity Assignment Suite', () => {


    test('verify the contact form is visible on the landing page', async () => {
        await expect(home.contactForm()).toBeVisible();
    });

    test.fail('verify "Book this room" buttons are present for listed rooms', async () => {
        await expect(home.roomsSection()).toBeVisible();
        await expect(home.bookNowButton().first()).toBeVisible();
        // BUG #1: Buttons say 'Book now' insted of 'Book this room'
        const buttonCount = await home.bookNowButton().count();
        expect(buttonCount).toBeGreaterThan(0);
    });

});

test.describe('Test coverage for the found bugs', () => {

    test.fail('amenities link has target section', async ({ page }) => {
        // BUG #2: Amenities section does not exist on the page
        await home.navSectionLink('Amenities').click();
        await expect(home.amenitiesSection()).toBeInViewport();
    });

    test.fail('booking with past dates', async ({ page }) => {
        // BUG #3: No validation on past check in/out dates
        await home.bookingSectionCheckIn().fill(getFormattedDate(-5));
        await home.bookingSectionCheckOut().fill(getFormattedDate(-10));
        await home.bookingSectionButton().click();
        await expect(home.bookingSectionAlert()).toBeVisible();
    });

    test.fail('footer links lead to correct destinations', async ({ page }) => {
        // BUG #4: Footer links are broken
        await home.footerLink('Home').click();
        await expect(page).toHaveURL(/#/);

        await home.footerLink('Rooms').click();
        await expect(home.roomsSection()).toBeInViewport();
        await expect(page).toHaveURL(/#rooms/);

        await home.footerLink('Booking').click();
        await expect(home.bookingSection()).toBeInViewport();
        await expect(page).toHaveURL(/#booking/);

        await home.footerLink('Contact').click();
        await expect(home.contactSection()).toBeInViewport();
        await expect(page).toHaveURL(/#contact/);
    });
});