import type { Locator, Page } from '@playwright/test';

export class ProductPage {
  private readonly addButton: Locator;
  private readonly backButton: Locator;

  constructor(page: Page) {
    this.backButton = page.getByRole('button', { name: 'Back to products', exact: true });
    this.addButton = page.getByRole('main').getByRole('button', { name: 'Add to cart', exact: true });
  }

  async addToCart(): Promise<void> {
    await this.backButton.waitFor();
    await this.addButton.click();
  }

  async returnToCatalog(): Promise<void> {
    await this.backButton.click();
  }
}
