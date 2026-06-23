import { Page } from '@playwright/test';

export class AdminPage {
    constructor(private page: Page) { }

    navSection() {
        return this.page.locator('nav');
    }

    navSectionLogo() {
        return this.navSection().getByText('Restful Booker Platform Demo');
    }

    navSectionLink(text: string) {
        return this.navSection().getByRole('link', { name: text });
    }

    logoutButton() {
        return this.navSection().getByRole('button', { name: 'Logout' });
    }

    loginUsernameField() {
        return this.page.getByPlaceholder('Enter username');
    }

    loginPasswordField() {
        return this.page.getByPlaceholder('Password');
    }

    loginButton() {
        return this.page.getByRole('button', { name: 'Login' });
    }

    async login(user?: string, pass?: string) {
        if (user !== undefined) await this.loginUsernameField().fill(user);
        if (pass !== undefined) await this.loginPasswordField().fill(pass);
        await this.loginButton().click();
    }
}