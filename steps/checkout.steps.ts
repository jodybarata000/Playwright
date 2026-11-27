import { expect } from '@playwright/test';
import { createBdd, defineParameterType } from 'playwright-bdd';
import { customerDetails, customerFields } from '@utils/random.utils';
import type { CustomerField } from '@utils/random.utils';
import { test } from '@fixtures/base.fixture';

const { Given, When, Then } = createBdd(test);

defineParameterType({
  name: 'customerField',
  regexp: /first name|last name|postal code/,
  transformer: (field): CustomerField => field as CustomerField,
});

Given('the user started checkout with one {string}', ({ shop }, product: string) => shop.beginCheckout(product));
Given('the user started checkout with those products', ({ shop }) => shop.startCheckout());
Given('the user is reviewing an order for one {string}', ({ shop }, product: string) => shop.startOrderReview(product));
Given('the user has entered customer details without submitting them', ({ shop }) =>
  shop.details.enter(customerDetails()));
Given('the user completed an order containing one {string} and one {string}', ({ shop }, first: string, second: string) =>
  shop.completeOrder(first, second));

When('the user cancels checkout', ({ shop }) => shop.cancelCheckout());
When('the user submits otherwise valid details with a blank {customerField}', ({ shop }, field: CustomerField) =>
  shop.enterInvalidDetails(field, ''));
When('the user submits customer details for {string} {string} with postal code {string}',
  ({ shop }, firstName: string, lastName: string, postalCode: string) =>
    shop.details.submit({ firstName, lastName, postalCode }));
When('the user submits valid customer details', ({ shop }) => shop.details.submit(customerDetails()));
When('the user places the order', ({ shop }) => shop.review.placeOrder());
When('the user refreshes the page', ({ shop }) => shop.refresh());
When('the user refreshes the order confirmation', ({ shop }) => shop.confirmation.refresh());

Then('the user remains at the customer details step', async ({ shop }) => {
  await expect(shop.details.form).toBeVisible();
});
Then('the user sees a validation message stating that {customerField} is required', async ({ shop }, field: CustomerField) => {
  await expect(shop.details.error).toContainText(`${customerFields[field].errorLabel} is required`);
});
Then('the order review shows a subtotal of {string}, tax of {string}, and a total of {string}',
  async ({ shop }, subtotal: string, tax: string, total: string) => {
    await expect(shop.review.title).toBeVisible();
    await expect(shop.review.subtotal).toHaveText(`Item total: ${subtotal}`);
    await expect(shop.review.tax).toHaveText(`Tax: ${tax}`);
    await expect(shop.review.total).toHaveText(`Total: ${total}`);
  });
Then('the order review contains one {string} and one {string}', async ({ shop }, first: string, second: string) => {
  await expect(shop.review.title).toBeVisible();
  await expect(shop.review.items.names).toHaveCount(2);
  await expect(shop.review.items.quantity(first)).toHaveText('1');
  await expect(shop.review.items.quantity(second)).toHaveText('1');
});
Then('the order review still contains one {string}', async ({ shop }, product: string) => {
  await expect(shop.review.title).toBeVisible();
  await expect(shop.review.items.quantity(product)).toHaveText('1');
});
Then('the user sees an order confirmation', async ({ shop }) => {
  await expect(shop.confirmation.message).toBeVisible();
});
Then('the user still sees the order confirmation', async ({ shop }) => {
  await expect(shop.confirmation.message).toBeVisible();
});
