import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';

test.describe('Login Tests', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.loginAs('standard_user', 'tta_secret');
    await expect(page).toHaveURL('https://app.thetestingacademy.com/playwright/ttacart/inventory');
  });

});