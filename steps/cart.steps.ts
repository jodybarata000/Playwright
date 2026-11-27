import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '@fixtures/base.fixture';

const { Given, When, Then } = createBdd(test);

Given('the user added a {string} from its product details', ({ shop }, product: string) =>
  shop.addFromDetails(product));
Given('the user is signed in with an empty cart', ({ shop }) => shop.openCatalog());
Given('the user is reviewing a cart with one {string}', ({ shop }, product: string) =>
  shop.reviewProducts(product));
Given('the user is reviewing a cart with one {string} and one {string}', ({ shop }, first: string, second: string) =>
  shop.reviewProducts(first, second));
Given('the user has one {string} and one {string} in the cart', ({ shop }, first: string, second: string) =>
  shop.addProducts(first, second));
Given('the user is reviewing a cart with one {string} in two tabs', ({ shop }, product: string) =>
  shop.openCartInTwoTabs(product));

When('the user reloads the cart', ({ shop }) => shop.cart.refresh());
When('the user adds a {string} from the catalog', ({ shop }, product: string) => shop.catalog.addProduct(product));
When('the user reviews the cart', ({ shop }) => shop.header.reviewCart());
When('the user removes the {string} from the cart', ({ shop }, product: string) => shop.cart.removeProduct(product));
When('the user continues shopping', ({ shop }) => shop.cart.continueShopping());
When('the user removes the {string} from the catalog', ({ shop }, product: string) =>
  shop.catalog.removeProduct(product));
When('the user goes back using the browser', ({ shop }) => shop.goBack());
When('the user reloads the catalog', ({ shop }) => shop.catalog.refresh());
When('the user removes the {string} in one tab', ({ shop }, product: string) => shop.cart.removeProduct(product));
When('the user reloads the cart in the other tab', ({ shop }) => shop.secondTab.cart.refresh());

Then('the cart contains one {string}', async ({ shop }, product: string) => {
  await expect(shop.cart.title).toBeVisible();
  await expect(shop.cart.items.quantity(product)).toHaveText('1');
});
Then('the cart contains one {string} and one {string}', async ({ shop }, first: string, second: string) => {
  await expect(shop.cart.title).toBeVisible();
  await expect(shop.cart.items.names).toHaveCount(2);
  await expect(shop.cart.items.quantity(first)).toHaveText('1');
  await expect(shop.cart.items.quantity(second)).toHaveText('1');
});
Then('the cart contains only one {string}', async ({ shop }, product: string) => {
  await expect(shop.cart.title).toBeVisible();
  await expect(shop.cart.items.names).toHaveText([product]);
  await expect(shop.cart.items.quantity(product)).toHaveText('1');
});
Then('the cart is empty', async ({ shop }) => {
  await expect(shop.header.cart).toHaveAccessibleName('Cart, empty');
  await shop.header.reviewCart();
  await expect(shop.cart.title).toBeVisible();
  await expect(shop.cart.items.names).toHaveCount(0);
});
Then('the cart indicator shows no item count', async ({ shop }) => {
  await expect(shop.header.cart).toHaveAccessibleName('Cart, empty');
  await expect(shop.header.cart).toHaveText('');
});
Then('the cart count is {int}', async ({ shop }, count: number) => {
  await expect(shop.header.cart).toHaveText(String(count));
});
Then('the user returns to the cart', async ({ shop }) => {
  await expect(shop.cart.title).toBeVisible();
});
Then('the user returns to the product catalog', async ({ shop }) => {
  await expect(shop.catalog.title).toBeVisible();
});
Then('the catalog shows the {string} as selected', async ({ shop }, product: string) => {
  await expect(shop.catalog.selected(product)).toBeVisible();
});
Then('the catalog lets the user add the {string}', async ({ shop }, product: string) => {
  const addButton = shop.catalog.availableToAdd(product);
  await expect(addButton).toBeVisible();
  await expect(addButton).toBeEnabled();
});
Then('the second tab cart contains one {string}', async ({ shop }, product: string) => {
  await expect(shop.secondTab.cart.title).toBeVisible();
  await expect(shop.secondTab.cart.items.names).toHaveText([product]);
  await expect(shop.secondTab.cart.items.quantity(product)).toHaveText('1');
});
Then('the reloaded cart is empty', async ({ shop }) => {
  await expect(shop.secondTab.cart.title).toBeVisible();
  await expect(shop.secondTab.cart.items.names).toHaveCount(0);
});
Then('the cart indicator in the reloaded tab shows no item count', async ({ shop }) => {
  await expect(shop.secondTab.header.cart).toHaveAccessibleName('Cart, empty');
  await expect(shop.secondTab.header.cart).toHaveText('');
});
