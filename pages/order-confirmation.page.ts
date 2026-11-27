import type { Locator, Page } from '@playwright/test';

export class OrderConfirmationPage {
  readonly message: Locator;

  constructor(private readonly page: Page) {
    this.message = page.getByRole('heading', { name: 'Thank you for your order!', exact: true });
  }

  async refresh(): Promise<void> {
    await this.page.reload();
  }
}
