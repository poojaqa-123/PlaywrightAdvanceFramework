import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutSecondPage extends BasePage {
  static readonly PATH = '/playwright/ttacart/checkout-step-two';

  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly itemTotal: Locator;
  readonly taxAmount: Locator;
  readonly productName: Locator;
  readonly productPrice: Locator;

  constructor(page: Page) {
    super(page, 'CheckoutSecondPage');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.itemTotal = page.locator('[data-test="subtotal-label"]');
    this.taxAmount = page.locator('[data-test="tax-label"]');
    this.productName = page.locator('[data-test="inventory-item-name"]').first();
    this.productPrice = page.locator('[data-test="inventory-item-price"]').first();
  }

  async open(): Promise<void> {
    this.log.info(`Navigating to ${CheckoutSecondPage.PATH}`);
    await this.page.goto(CheckoutSecondPage.PATH);
  }

  async finish(): Promise<void> {
    await this.el.click(this.finishButton);
  }

  async cancel(): Promise<void> {
    await this.el.click(this.cancelButton);
  }

  async getItemTotal(): Promise<string> {
    return (await this.itemTotal.textContent()) ?? '';
  }

  async getTaxAmount(): Promise<string> {
    return (await this.taxAmount.textContent()) ?? '';
  }

  async getProductName(): Promise<string> {
    return (await this.productName.textContent()) ?? '';
  }

  async getProductPrice(): Promise<string> {
    return (await this.productPrice.textContent()) ?? '';
  }
}
