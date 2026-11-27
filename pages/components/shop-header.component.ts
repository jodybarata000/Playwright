import type { Locator, Page } from '@playwright/test';

export class ShopHeader {
  readonly cart: Locator;
  private readonly menu: Locator;
  private readonly logoutOption: Locator;

  constructor(page: Page) {
    const banner = page.getByRole('banner');
    this.cart = banner.getByRole('button', { name: /^Cart, (?:empty|\d+ items?)$/ });
    this.menu = banner.getByRole('button', { name: 'Open Menu', exact: true });
    this.logoutOption = banner.getByText('Logout', { exact: true });
  }

  async reviewCart(): Promise<void> {
    await this.cart.click();
  }

  async signOut(): Promise<void> {
    await this.menu.click();
    await this.logoutOption.click();
  }
}
