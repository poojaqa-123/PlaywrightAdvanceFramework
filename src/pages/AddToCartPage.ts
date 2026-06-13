import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AddToCartPage extends BasePage {
  static readonly PATH = '/playwright/ttacart/cart';

  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    super(page, 'AddToCartPage');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
  }

  async open(): Promise<void> {
    this.log.info(`Navigating to ${AddToCartPage.PATH}`);
    await this.page.goto(AddToCartPage.PATH);
  }

  async checkout(): Promise<void> {
    await this.el.click(this.checkoutButton);
  }

  async continueShopping(): Promise<void> {
    await this.el.click(this.continueShoppingButton);
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }
}
