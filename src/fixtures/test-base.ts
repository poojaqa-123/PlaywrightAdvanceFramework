import { test as baseTest, expect, type Page } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';
import { ItemDetailsPage } from '@pages/ItemDetailsPage';
import { AddToCartPage } from '@pages/AddToCartPage';
import { CheckoutOnePage } from '@pages/CheckoutOnePage';
import { CheckoutSecondPage } from '@pages/CheckoutSecondPage';
import { OrderCompletePage } from '@pages/OrderCompletePage';

export type AppFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  itemDetailsPage: ItemDetailsPage;
  addToCartPage: AddToCartPage;
  checkoutOnePage: CheckoutOnePage;
  checkoutSecondPage: CheckoutSecondPage;
  orderCompletePage: OrderCompletePage;
};

export const test = baseTest.extend<AppFixtures>({
  loginPage: async ({ page }: { page: Page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }: { page: Page }, use) => {
    await use(new InventoryPage(page));
  },

  itemDetailsPage: async ({ page }: { page: Page }, use) => {
    await use(new ItemDetailsPage(page));
  },

  addToCartPage: async ({ page }: { page: Page }, use) => {
    await use(new AddToCartPage(page));
  },

  checkoutOnePage: async ({ page }: { page: Page }, use) => {
    await use(new CheckoutOnePage(page));
  },

  checkoutSecondPage: async ({ page }: { page: Page }, use) => {
    await use(new CheckoutSecondPage(page));
  },

  orderCompletePage: async ({ page }: { page: Page }, use) => {
    await use(new OrderCompletePage(page));
  },
});

export { expect };
