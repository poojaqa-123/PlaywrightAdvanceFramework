import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutOnePage extends BasePage {
  static readonly PATH = '/playwright/ttacart/checkout-step-one';

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page, 'CheckoutOnePage');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async open(): Promise<void> {
    this.log.info(`Navigating to ${CheckoutOnePage.PATH}`);
    await this.page.goto(CheckoutOnePage.PATH);
  }

  async fillCustomerInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.el.fill(this.firstNameInput, firstName);
    await this.el.fill(this.lastNameInput, lastName);
    await this.el.fill(this.postalCodeInput, postalCode);
  }

  async continue(): Promise<void> {
    await this.el.click(this.continueButton);
  }

  async cancel(): Promise<void> {
    await this.el.click(this.cancelButton);
  }
}
