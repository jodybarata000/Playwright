export const saucedemoUrl = process.env.BASE_URL || 'https://www.saucedemo.com';
export const authStatePath = 'playwright/.auth/standard-user.json';

// Public credentials displayed by SauceDemo. Overrides support isolated deployments.
export const standardUser = {
  username: process.env.SAUCEDEMO_USERNAME || 'standard_user',
  password: process.env.SAUCEDEMO_PASSWORD || 'secret_sauce',
};
