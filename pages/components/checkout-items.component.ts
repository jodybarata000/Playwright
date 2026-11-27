import type { Locator, Page } from '@playwright/test';

export class CheckoutItems {
  private readonly rows: Locator;
  readonly names: Locator;

  constructor(private readonly page: Page) {
    this.rows = page.getByTestId('cart-list').getByTestId('inventory-item');
    this.names = this.rows.getByTestId('inventory-item-name');
  }

  row(product: string): Locator {
    return this.rows.filter({ has: this.page.getByText(product, { exact: true }) });
  }

  quantity(product: string): Locator {
    return this.row(product).getByTestId('item-quantity');
  }
}
