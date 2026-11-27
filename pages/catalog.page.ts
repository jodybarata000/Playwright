import type { Locator, Page } from '@playwright/test';

export type CatalogSort = 'Name (A to Z)' | 'Name (Z to A)' |
  'Price (low to high)' | 'Price (high to low)';

export class CatalogPage {
  readonly title: Locator;
  readonly names: Locator;
  readonly prices: Locator;
  private readonly cards: Locator;
  private readonly sortControl: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByText('Products', { exact: true });
    this.cards = page.getByRole('main').getByTestId('inventory-item');
    this.names = this.cards.getByTestId('inventory-item-name');
    this.prices = this.cards.getByTestId('inventory-item-price');
    this.sortControl = page.getByRole('combobox', { name: 'Sort products', exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  async refresh(): Promise<void> {
    await this.page.reload();
  }

  async sortBy(order: CatalogSort): Promise<void> {
    await this.sortControl.selectOption({ label: order });
  }

  async viewProduct(product: string): Promise<void> {
    // The image and product title share an accessible name. Match the title button.
    await this.page.getByRole('button', { name: `View details for ${product}`, exact: true })
      .filter({ hasText: product }).click();
  }

  availableToAdd(product: string): Locator {
    return this.productCard(product).getByRole('button', { name: 'Add to cart', exact: true });
  }

  selected(product: string): Locator {
    return this.productCard(product).getByRole('button', { name: 'Remove', exact: true });
  }

  async addProduct(product: string): Promise<void> {
    await this.availableToAdd(product).click();
  }

  async removeProduct(product: string): Promise<void> {
    await this.selected(product).click();
  }

  async sortedNames(): Promise<string[]> {
    return (await this.names.allTextContents()).sort();
  }

  productPrice(product: string): Locator {
    return this.productCard(product).getByTestId('inventory-item-price');
  }

  private productCard(product: string): Locator {
    return this.cards.filter({ has: this.page.getByText(product, { exact: true }) });
  }
}
