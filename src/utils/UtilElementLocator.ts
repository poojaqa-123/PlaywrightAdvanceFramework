// Whatever the common utilities are there, it will be present in the util element locator. 

/**
 * This is UtilElementLocators - Contains all the util we can reuse direclty
 * 
 **/

import { expect, Locator, Page } from '@playwright/test';
import { createLogger, type Logger } from '@utils/Logger';



export const DEFAULT_ACTION_TIMEOUT_MS = 15_000;


/**
 * Flex - a selector can be a CSS string or an already-built Locator.
 *
 * The TTACart suite uses `data-test` attributes everywhere, so most call sites
 * pass either:
 *   - `'[data-test="username"]'`  (a CSS string), or
 *   - `page.getByTestId('username')` (a Locator object).
 */

export type Flex = string | Locator;

export class UtilElementLocator {
    private readonly page: Page;
    private readonly log: Logger;

    constructor(page: Page, scope: string = 'UtilElementLocator') {
        this.page = page;
        this.log = createLogger(scope);

    }
    /* --------------------- Private helpers --------------------- */
    private toLocator(target: Flex): Locator {
       return typeof target === 'string' ? this.page.locator(target) : target;
    }

    private describe(target: Flex): string {
        return typeof target === 'string' ? target : target.toString();
    }

    /* --------------------- Actions (user interactions) --------------------- */
    async click(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS) : Promise<void>{
        const locator = this.toLocator(target);
        this.log.info(`Clicking ${this.describe(target)}`);
        await locator.click({ timeout });
    }

    async hover(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS   ) : Promise<void> {
        const locator = this.toLocator(target);
        this.log.info(`Hovering over ${this.describe(target)}`);
        await locator.hover({ timeout });
    }

    async doubleClick(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS) : Promise<void> {
        const locator = this.toLocator(target);
        this.log.info(`Double-clicking ${this.describe(target)}`);
        await locator.dblclick({ timeout });
    }

    async rightClick(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS) : Promise<void> {
        const locator = this.toLocator(target);
        this.log.info(`Right-clicking ${this.describe(target)}`);
        await locator.click({ button: 'right', timeout });
    }

    async fill(target: Flex, value: string, timeout: number = DEFAULT_ACTION_TIMEOUT_MS ) : Promise<void> {
        const locator = this.toLocator(target);
        this.log.info(`Filling ${this.describe(target)} with "${value}"`);
        await locator.fill(value, { timeout });
    }

    async pressSequentially(target: Flex, keys: string, timeout: number = DEFAULT_ACTION_TIMEOUT_MS) : Promise<void> {
        const locator = this.toLocator(target);
        await locator.pressSequentially(keys, { timeout });
    }

    async clear(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS) : Promise<void> {
        const locator = this.toLocator(target);
        this.log.info(`Clearing ${this.describe(target)}`);
        await locator.clear({ timeout });
    }

    /* --------------------- Getters (read-only queries) --------------------- */
    async getText(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS) : Promise<string> {
        const locator = this.toLocator(target);
        this.log.info(`Getting text from ${this.describe(target)}`);
        return await locator.textContent({ timeout }) ?? '';
    }
    
    async getinnerText(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS) : Promise<string> {
        const locator = this.toLocator(target);
        this.log.info(`Getting innerText from ${this.describe(target)}`);
        return (await locator.innerText({ timeout })).trim();
    }

    async getAllTexts(target: Flex) : Promise<string[]> {
        const locator = this.toLocator(target);
        const texts = await locator.allTextContents();
        return texts.map((t) => t.trim());
    }

    async getValue(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS) : Promise<string> {
        const locator = this.toLocator(target);
        this.log.info(`Getting value from ${this.describe(target)}`);
        return await locator.inputValue({ timeout });
    }

    async getAttribute(target: Flex, attributeName: string, timeout: number = DEFAULT_ACTION_TIMEOUT_MS) : Promise<string | null> {
        const locator = this.toLocator(target);
        this.log.info(`Getting attribute "${attributeName}" from ${this.describe(target)}`);
        return await locator.getAttribute(attributeName, { timeout });
    }   

    async count(target: Flex) : Promise<number> {
        const locator = this.toLocator(target);
        this.log.info(`Counting elements matching ${this.describe(target)}`);
        return await locator.count();
    }

    /* --------------------- State queries (booleans) --------------------- */
    async isChecked(target: Flex) : Promise<boolean> {
        const locator = this.toLocator(target);
        this.log.info(`Checking if ${this.describe(target)} is checked`);
        return await locator.isChecked();
    }

    async isDisabled(target: Flex) : Promise<boolean> {
        const locator = this.toLocator(target);
        this.log.info(`Checking if ${this.describe(target)} is disabled`);
        return await locator.isDisabled();
    }

    async isEnabled(target: Flex) : Promise<boolean> {
        const locator = this.toLocator(target);
        this.log.info(`Checking if ${this.describe(target)} is enabled`);
        return await locator.isEnabled();
    }

    async isVisible(target: Flex) : Promise<boolean> {
        const locator = this.toLocator(target);
        this.log.info(`Checking if ${this.describe(target)} is visible`);
        return await locator.isVisible();
    }

    /* --------------------- Assertions / Expectations --------------------- */
    async expectVisible(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS) : Promise<void> {
        const locator = this.toLocator(target);
        this.log.info(`Expecting ${this.describe(target)} to be visible`);
        await expect(locator).toBeVisible({ timeout });
    }

    async expectText(target: Flex, text: string, timeout: number = DEFAULT_ACTION_TIMEOUT_MS) : Promise<void> {
        const locator = this.toLocator(target);
        this.log.info(`Expecting ${this.describe(target)} to have text "${text}"`);
        await expect(locator).toHaveText(text, { timeout });
    }

    /* --------------------- Waits / Navigation --------------------- */
    async waitForVisible(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS) : Promise<void> {
        const loc = this.toLocator(target);
        await expect(loc).toBeVisible({ timeout });
    }

    async waitForHidden(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS) : Promise<void> {
        const loc = this.toLocator(target);
        await expect(loc).toBeHidden({ timeout });
    }   

    async waitForPageLoad(timeout: number = DEFAULT_ACTION_TIMEOUT_MS) : Promise<void> {
        this.log.debug('waitForPageLoad');
        await this.page.waitForLoadState('domcontentloaded', { timeout });
         await this.page.waitForLoadState('networkidle').catch(() => {
            // TTACart is static + localStorage so networkidle is fast,
            // but we swallow the rare timeout so the test isn't punished
            // by background analytics calls on the demo origin.
        });
    }

    /* --------------------- Select helpers --------------------- */
    async selectByText(target: Flex, text: string): Promise<void> {
        const loc = this.toLocator(target);
        await loc.selectOption({ label: text });
    }

    async selectByValue(target: Flex, value: string): Promise<void> {
        const loc = this.toLocator(target);
        await loc.selectOption({ value });
    }

    async selectByIndex(target: Flex, index: number): Promise<void> {
        const loc = this.toLocator(target);
        await loc.selectOption({ index });
    }


}