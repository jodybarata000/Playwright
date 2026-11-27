import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { standardUser } from '@config/saucedemo';
import { test } from '@fixtures/base.fixture';

const { Given, When, Then } = createBdd(test);

Given('the user is signed out', ({ shop }) => shop.login.open());
Given('the user signed out after viewing a cart containing an item', ({ shop }) =>
  shop.signOutAfterViewingCart());
Given('the user received a sign-in error for an invalid password', async ({ shop }) => {
  await shop.attemptInvalidPassword();
  await expect(shop.login.error).toContainText('Username and password do not match any user in this service');
});

When('the user signs in with the active account', ({ shop }) => shop.signIn());
When('the user signs in with username {string} and password {string}', ({ shop }, username: string, password: string) =>
  shop.login.signIn(username, password));
When('the user retries with the correct password', ({ shop }) => shop.login.retryPassword(standardUser.password));
When('the user returns to the cart', ({ shop }) => shop.cart.open());
When('the user opens a bookmark to the product catalog', ({ shop }) => shop.catalog.open());

Then('the product catalog is available', async ({ shop }) => {
  await expect(shop.catalog.title).toBeVisible();
});
Then('the user sees the sign-in error {string}', async ({ shop }, message: string) => {
  await expect(shop.login.error).toContainText(message);
});
Then('the product catalog remains unavailable', async ({ shop }) => {
  await expect(shop.login.form).toBeVisible();
  await expect(shop.catalog.title).toBeHidden();
});
Then('the application prompts the user to sign in', async ({ shop }) => {
  await expect(shop.login.form).toBeVisible();
});
Then('the cart contents remain unavailable', async ({ shop }) => {
  await expect(shop.cart.title).toBeHidden();
  await expect(shop.cart.items.names).toHaveCount(0);
});
