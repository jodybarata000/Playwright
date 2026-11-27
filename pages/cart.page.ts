import type { Locator, Page } from '@playwright/test';
import { CheckoutItems } from '@components/checkout-items.component';

export class CartPage {
  readonly title: Locator;
  readonly items: CheckoutItems;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByText('Your Cart', { exact: true });
    this.items = new CheckoutItems(page);
    this.checkoutButton = page.getByRole('button', { name: 'Checkout', exact: true });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping', exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto('/cart.html');
  }

  async refresh(): Promise<void> {
    await this.page.reload();
  }

  async removeProduct(product: string): Promise<void> {
    await this.items.row(product).getByRole('button', { name: 'Remove', exact: true }).click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async startCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
