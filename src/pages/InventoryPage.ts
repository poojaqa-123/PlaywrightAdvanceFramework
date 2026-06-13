import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  static readonly PATH = '/playwright/ttacart/inventory.html';

  readonly cartButton: Locator;
  readonly productCards: Locator;
  readonly sortSelect: Locator;
  readonly firstProductName: Locator;
  readonly firstProductAddButton: Locator;

  constructor(page: Page) {
    super(page, 'InventoryPage');
    this.cartButton = page.locator('[data-test="shopping-cart-link"]');
    this.productCards = page.locator('[data-test="inventory-item"]');
    this.sortSelect = page.locator('[data-test="product-sort-container"]');
    this.firstProductName = page.locator('[data-test="inventory-item-name"]').first();
    this.firstProductAddButton = this.productCards.first().locator('button', { hasText: 'Add to cart' });
  }

  async open(): Promise<void> {
    this.log.info(`Navigating to ${InventoryPage.PATH}`);
    await this.page.goto(InventoryPage.PATH);
  }

  async addToCart(productName: string): Promise<void> {
    const product = this.page.locator('[data-test="inventory-item"]', { hasText: productName });
    const button = product.locator('button', { hasText: 'Add to cart' });
    await this.el.click(button);
  }

  async addFirstProductToCart(timeout: number = 15_000): Promise<void> {
    await this.firstProductAddButton.waitFor({ state: 'visible', timeout });
    await this.el.click(this.firstProductAddButton, timeout);
  }

  async getFirstProductName(timeout: number = 15_000): Promise<string> {
    await this.firstProductName.waitFor({ state: 'visible', timeout });
    return (await this.firstProductName.textContent()) ?? '';
  }

  async goToCart(): Promise<void> {
    await this.el.click(this.cartButton);
  }

  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }
}
