import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderCompletePage extends BasePage {
  static readonly PATH = '/playwright/ttacart/checkout-complete';

  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page, 'OrderCompletePage');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async open(): Promise<void> {
    this.log.info(`Navigating to ${OrderCompletePage.PATH}`);
    await this.page.goto(OrderCompletePage.PATH);
  }

  async getCompletionMessage(): Promise<string> {
    return (await this.completeText.textContent()) ?? '';
  }

  async goBackHome(): Promise<void> {
    await this.el.click(this.backHomeButton);
  }
}
