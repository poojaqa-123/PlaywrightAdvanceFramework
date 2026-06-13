import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';


export class LoginPage extends BasePage {

  static readonly PATH = '/playwright/ttacart/index.html';

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  private readonly errorBox: Locator;
  private readonly loginCredentialsHint: Locator;

  constructor(page: Page) {
    super(page, 'LoginPage');
    this.usernameInput = page.locator("#user-name")
    this.passwordInput = page.locator("#password")
    this.loginButton = page.locator("#login-button")
    this.errorBox = page.locator("#login-error")
    this.loginCredentialsHint = page.locator(".login-credentials-hint")
  }

  async open(): Promise<void> {
    this.log.info(`Navigating to ${LoginPage.PATH}`);
    await this.page.goto(LoginPage.PATH);
  }

async loginAs(username: string, password: string) {
    this.log.info(`Logged In As ${username}`)
    await this.el.fill(this.usernameInput, username);
    await this.el.fill(this.passwordInput, password);
    await this.el.click(this.loginButton);
}


}
