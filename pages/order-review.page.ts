import type { Locator, Page } from '@playwright/test';
import { CheckoutItems } from '@components/checkout-items.component';

export class OrderReviewPage {
  readonly title: Locator;
  readonly items: CheckoutItems;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    this.title = page.getByText('Checkout: Overview', { exact: true });
    this.items = new CheckoutItems(page);
    this.subtotal = page.getByText(/^Item total: /);
    this.tax = page.getByText(/^Tax: /);
    this.total = page.getByText(/^Total: /);
    this.finishButton = page.getByRole('button', { name: 'Finish', exact: true });
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
  }

  async placeOrder(): Promise<void> {
    await this.finishButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
