import { test, expect } from '@fixtures/test-base';
import dotenv from 'dotenv';
import userData from '../testdata/user-data.json';

dotenv.config();

const TEST_USER = process.env.TEST_USER || 'standard_user';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'tta_secret';
const FIRST_NAME = userData.standardUser.firstName;
const LAST_NAME = userData.standardUser.lastName;
const POSTAL_CODE = userData.standardUser.postalCode;

test('E2E checkout flow for standard user', async ({
  loginPage,
  inventoryPage,
  addToCartPage,
  checkoutOnePage,
  checkoutSecondPage,
  page,
}) => {
  await loginPage.open();
  await loginPage.loginAs(TEST_USER, TEST_PASSWORD);

  await expect(page).toHaveURL(/inventory(?:\.html)?$/);

  const productName = await inventoryPage.getFirstProductName();
  await inventoryPage.addFirstProductToCart();
  await inventoryPage.goToCart();

  const cartItemCount = await addToCartPage.getCartItemCount();
  expect(cartItemCount).toBeGreaterThan(0);

  await addToCartPage.checkout();
  await checkoutOnePage.fillCustomerInformation(FIRST_NAME, LAST_NAME, POSTAL_CODE);
  await checkoutOnePage.continue();

  const productNameOnCheckout = await checkoutSecondPage.getProductName();
  const productPrice = await checkoutSecondPage.getProductPrice();

  expect(productNameOnCheckout).toContain(productName);
  expect(productPrice).toMatch(/^\$/);

  await checkoutSecondPage.finish();
});
