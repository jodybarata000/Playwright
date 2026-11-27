import { test } from '@fixtures/base.fixture';
import { authStatePath, standardUser } from '@config/saucedemo';
import { CatalogPage } from '@pages/catalog.page';
import { LoginPage } from '@pages/login.page';

test('save a clean SauceDemo standard-user session', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.signIn(standardUser.username, standardUser.password);
  await new CatalogPage(page).title.waitFor();
  await page.context().storageState({ path: authStatePath });
});
