import { Page } from '@playwright/test';

export class HomePage {
    constructor(private page: Page) { }

    navSection() {
        return this.page.locator('nav');
    }

    navSectionLogo() {
        return this.navSection().getByText('Shady Meadows B&B');
    }

    navSectionLink(text: string) {
        return this.navSection().getByRole('link', { name: text });
    }

    bookingSection() {
        return this.page.locator('#booking');
    }

    bookingSectionHeader() {
        return this.bookingSection().getByRole('heading');
    }

    bookingSectionCheckIn() {
        return this.bookingSection().locator('input').first();
    }

    bookingSectionCheckOut() {
        return this.bookingSection().locator('input').last();
    }

    bookingSectionButton() {
        return this.bookingSection().getByRole('button', { name: 'Check Availability' });
    }

    bookingSectionAlert() {
        return this.bookingSection()
            .filter({ has: this.page.getByRole('alert') })
    }
    amenitiesSection() {
        return this.page.locator('#amenities');
    }

    roomsSection() {
        return this.page.locator('#rooms');
    }
    roomsFirstRoom() {
        return this.roomsSection().locator('h5.card-title').first();
    }
    bookNowButton() {
        return this.page.getByRole('link', { name: 'Book now' });
    }
    contactSection() {
        return this.page.locator('#contact');
    }
    contactForm() {
        return this.page.locator('#contact form').or(this.page.locator('form').filter({ has: this.page.getByRole('button', { name: 'Submit' }) }));
    }
    footer() {
        return this.page.locator('footer');
    }
    footerLinks() {
        return this.footer().locator('.container')
            .filter({ has: this.page.getByRole('heading', { name: 'Quick Links' }) });
    }
    footerLink(text: string) {
        return this.footerLinks().getByRole('link', { name: text });
    }
}