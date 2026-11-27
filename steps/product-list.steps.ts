import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '@fixtures/base.fixture';

const { Given, When, Then } = createBdd(test);

const names = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
  'Test.allTheThings() T-Shirt (Red)',
];
const prices = ['$7.99', '$9.99', '$15.99', '$15.99', '$29.99', '$49.99'];

Given('the user is signed in and the product catalog is available', ({ shop }) => shop.openCatalog());
Given('the user is viewing the product catalog from lowest to highest price', ({ shop }) =>
  shop.openCatalog('Price (low to high)'));
Given('the user is viewing the product catalog from highest to lowest price', ({ shop }) =>
  shop.openCatalog('Price (high to low)'));

When('the user sorts products from lowest to highest price', ({ shop }) => shop.catalog.sortBy('Price (low to high)'));
When('the user sorts products from highest to lowest price', ({ shop }) => shop.catalog.sortBy('Price (high to low)'));
When('the user sorts products by name from Z to A', ({ shop }) => shop.catalog.sortBy('Name (Z to A)'));
When('the user sorts products by name from A to Z', ({ shop }) => shop.catalog.sortBy('Name (A to Z)'));
When('the user views the {string} details', ({ shop }, product: string) => shop.catalog.viewProduct(product));
When('the user returns to the catalog', ({ shop }) => shop.product.returnToCatalog());

Then('the catalog lists all six products from lowest to highest price', async ({ shop }) => {
  await expect(shop.catalog.prices).toHaveText(prices);
  await expect.poll(() => shop.catalog.sortedNames()).toEqual(names);
});
Then('the catalog lists all six products from highest to lowest price', async ({ shop }) => {
  await expect(shop.catalog.prices).toHaveText([...prices].reverse());
  await expect.poll(() => shop.catalog.sortedNames()).toEqual(names);
});
Then('the catalog lists all six products by name from A to Z', async ({ shop }) => {
  await expect(shop.catalog.names).toHaveText(names);
});
Then('the catalog lists all six products by name from Z to A', async ({ shop }) => {
  await expect(shop.catalog.names).toHaveText([...names].reverse());
});
Then('{string} and {string} each appear once at $15.99', async ({ shop }, first: string, second: string) => {
  await expect(shop.catalog.productPrice(first)).toHaveText(['$15.99']);
  await expect(shop.catalog.productPrice(second)).toHaveText(['$15.99']);
});
