import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly form: Locator;
  readonly error: Locator;
  private readonly username: Locator;
  private readonly password: Locator;
  private readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.form = page.getByRole('form', { name: 'Login', exact: true });
    this.username = this.form.getByRole('textbox', { name: 'Username', exact: true });
    // Password inputs have no implicit textbox role.
    this.password = this.form.getByPlaceholder('Password', { exact: true });
    this.submitButton = this.form.getByRole('button', { name: 'Login', exact: true });
    this.error = this.form.getByRole('alert');
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async signIn(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.retryPassword(password);
  }

  async retryPassword(password: string): Promise<void> {
    await this.password.fill(password);
    await this.submitButton.click();
  }
}
