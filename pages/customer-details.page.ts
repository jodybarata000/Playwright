import type { Locator, Page } from '@playwright/test';
import type { CustomerDetails } from '@utils/random.utils';

export class CustomerDetailsPage {
  readonly form: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly error: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    this.form = page.getByRole('form', { name: 'Checkout information', exact: true });
    this.firstName = this.form.getByRole('textbox', { name: 'First Name', exact: true });
    this.lastName = this.form.getByRole('textbox', { name: 'Last Name', exact: true });
    this.postalCode = this.form.getByRole('textbox', { name: 'Zip/Postal Code', exact: true });
    this.error = this.form.getByRole('alert');
    this.continueButton = this.form.getByRole('button', { name: 'Continue', exact: true });
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
  }

  async enter(details: CustomerDetails): Promise<void> {
    await this.firstName.fill(details.firstName);
    await this.lastName.fill(details.lastName);
    await this.postalCode.fill(details.postalCode);
  }

  async submit(details: CustomerDetails): Promise<void> {
    await this.enter(details);
    await this.continueButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
