import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ItemDetailsPage extends BasePage {
  static readonly PATH = '/playwright/ttacart/inventory-item?id=test-allthethings-tshirt-red';

  readonly addToCartButton: Locator;
  readonly backButton: Locator;
  readonly itemTitle: Locator;
  readonly itemDescription: Locator;
  readonly itemPrice: Locator;

  constructor(page: Page) {
    super(page, 'ItemDetailsPage');
    this.addToCartButton = page.locator('#add-to-cart');
    this.backButton = page.locator('[data-test="back-to-products"]');
    this.itemTitle = page.locator('[data-test="inventory-item-name"]');
    this.itemDescription = page.locator('[data-test="inventory-item-desc"]');
    this.itemPrice = page.locator('[data-test="inventory-item-price"]');
  }

  async open(): Promise<void> {
    this.log.info(`Navigating to ${ItemDetailsPage.PATH}`);
    await this.page.goto(ItemDetailsPage.PATH);
  }

  async addToCart(): Promise<void> {
    await this.el.click(this.addToCartButton);
  }

  async goBack(): Promise<void> {
    await this.el.click(this.backButton);
  }

  async getTitle(): Promise<string> {
    return (await this.itemTitle.textContent()) ?? '';
  }
}
