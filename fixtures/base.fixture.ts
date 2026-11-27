import type { Page } from '@playwright/test';
import { test as base } from 'playwright-bdd';
import { standardUser } from '@config/saucedemo';
import { customerDetails, customerFields } from '@utils/random.utils';
import type { CustomerField } from '@utils/random.utils';
import { installBrowserDiagnostics } from '@utils/logging/browser-diagnostics';
import { CartPage } from '@pages/cart.page';
import { CatalogPage } from '@pages/catalog.page';
import type { CatalogSort } from '@pages/catalog.page';
import { CustomerDetailsPage } from '@pages/customer-details.page';
import { LoginPage } from '@pages/login.page';
import { OrderConfirmationPage } from '@pages/order-confirmation.page';
import { OrderReviewPage } from '@pages/order-review.page';
import { ProductPage } from '@pages/product.page';
import { ShopHeader } from '@components/shop-header.component';

class ShopScenario {
  readonly login: LoginPage;
  readonly catalog: CatalogPage;
  readonly product: ProductPage;
  readonly cart: CartPage;
  readonly details: CustomerDetailsPage;
  readonly review: OrderReviewPage;
  readonly confirmation: OrderConfirmationPage;
  readonly header: ShopHeader;

  private otherCart?: { cart: CartPage; header: ShopHeader };

  constructor(private readonly page: Page) {
    this.login = new LoginPage(page);
    this.catalog = new CatalogPage(page);
    this.product = new ProductPage(page);
    this.cart = new CartPage(page);
    this.details = new CustomerDetailsPage(page);
    this.review = new OrderReviewPage(page);
    this.confirmation = new OrderConfirmationPage(page);
    this.header = new ShopHeader(page);
  }

  async openCatalog(order?: CatalogSort): Promise<void> {
    await this.catalog.open();
    if (order) await this.catalog.sortBy(order);
  }

  async signIn(): Promise<void> {
    await this.login.signIn(standardUser.username, standardUser.password);
  }

  async signOutAfterViewingCart(): Promise<void> {
    await this.login.open();
    await this.signIn();
    await this.catalog.addProduct('Sauce Labs Backpack');
    await this.header.reviewCart();
    await this.header.signOut();
  }

  async attemptInvalidPassword(): Promise<void> {
    await this.login.open();
    await this.login.signIn(standardUser.username, `${standardUser.password}-invalid`);
  }

  async addProducts(...products: string[]): Promise<void> {
    await this.openCatalog();
    for (const product of products) await this.catalog.addProduct(product);
  }

  async addFromDetails(product: string): Promise<void> {
    await this.openCatalog();
    await this.catalog.viewProduct(product);
    await this.product.addToCart();
    await this.header.reviewCart();
  }

  async reviewProducts(...products: string[]): Promise<void> {
    await this.addProducts(...products);
    await this.header.reviewCart();
  }

  async openCartInTwoTabs(product: string): Promise<void> {
    await this.reviewProducts(product);
    const secondPage = await this.page.context().newPage();
    this.otherCart = { cart: new CartPage(secondPage), header: new ShopHeader(secondPage) };
    await this.otherCart.cart.open();
  }

  get secondTab() {
    if (!this.otherCart) throw new Error('The second cart tab has not been opened.');
    return this.otherCart;
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  async refresh(): Promise<void> {
    await this.page.reload();
  }

  async beginCheckout(...products: string[]): Promise<void> {
    await this.addProducts(...products);
    await this.startCheckout();
  }

  async startCheckout(): Promise<void> {
    await this.header.reviewCart();
    await this.cart.startCheckout();
  }

  async startOrderReview(...products: string[]): Promise<void> {
    await this.beginCheckout(...products);
    await this.details.submit(customerDetails());
  }

  async completeOrder(...products: string[]): Promise<void> {
    await this.startOrderReview(...products);
    await this.review.placeOrder();
    await this.confirmation.message.waitFor();
  }

  async cancelCheckout(): Promise<void> {
    if (await this.review.title.isVisible()) {
      await this.review.cancel();
      return;
    }
    await this.details.cancel();
  }

  async enterInvalidDetails(field: CustomerField, value: string): Promise<void> {
    await this.details.submit({ ...customerDetails(), [customerFields[field].key]: value });
  }
}

export const test = base.extend<{ shop: ShopScenario; browserDiagnostics: void }>({
  browserDiagnostics: [async ({ context }, use, testInfo) => {
    const attachDiagnostics = installBrowserDiagnostics(context);
    try {
      await use();
    } finally {
      await attachDiagnostics(testInfo);
    }
  }, { auto: true }],
  shop: async ({ page }, use) => {
    await use(new ShopScenario(page));
  },
});
