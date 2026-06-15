---
name: scaffold-playwright-framework
description: >-
  Scaffold a Playwright + TypeScript end-to-end test automation framework using
  this project's conventions: Page Object Model with a BasePage, a UtilElementLocator
  action wrapper, custom test fixtures, scoped Winston logging, TS path aliases,
  Allure + HTML reporting, tag-based test selection, and ESLint/Prettier. Use when
  the user asks to create a new Playwright framework, bootstrap a similar test
  automation project, add a Page Object / fixture / util, or replicate this
  repository's structure.
disable-model-invocation: true
---

# Scaffold Playwright Framework

Recreate this repository's Playwright + TypeScript architecture. The framework is
a layered Page Object Model: tests call Page Objects, Page Objects call a shared
`UtilElementLocator` wrapper, and everything logs through a scoped Winston logger.

## Architecture (layers, top to bottom)

```
tests (*.spec.ts)        -> orchestrate flow + assertions only
fixtures (test-base.ts)  -> inject ready-to-use Page Objects
pages (*Page.ts)         -> one class per screen, extend BasePage
BasePage                 -> holds page, el (UtilElementLocator), log (Logger)
UtilElementLocator       -> the ONLY place that touches Playwright actions
Logger                   -> scoped Winston child loggers
```

Rule of thumb: tests never use raw `page.locator(...)` actions; Page Objects
declare `Locator` fields and delegate clicks/fills/reads to `this.el`.

## Directory layout

```
<project>/
├── package.json                 # scripts + devDeps (commonjs)
├── tsconfig.json                # strict, path aliases, noEmit
├── playwright.config.ts         # baseURL resolver, projects, reporters
├── eslint.config.cjs            # flat config, ts parser
├── .env                         # TTA_ENV / BASE_URL / LOG_LEVEL (gitignored)
├── .github/workflows/playwright.yml
├── rules/README.md              # "run verify when adding tests" rule
├── logs/                        # combined.log (CI artifact)
└── src/
    ├── fixtures/test-base.ts    # extends base test with Page Object fixtures
    ├── pages/
    │   ├── BasePage.ts          # abstract base for all Page Objects
    │   └── <Screen>Page.ts      # one per screen
    ├── utils/
    │   ├── UtilElementLocator.ts# action/getter/assert wrapper
    │   └── Logger.ts            # winston root + createLogger(scope)
    ├── testdata/*.json          # static fixtures (users, etc.)
    └── tests/*.spec.ts          # specs, tagged with @e2e/@p0/@ui...
```

## Setup steps

1. Create `package.json` (`"type": "commonjs"`) with the scripts and devDeps below.
2. Add `tsconfig.json` with strict mode + path aliases (mirror `paths` in Playwright config via the same alias names).
3. Add `playwright.config.ts` with an env-driven `baseURL`, `html` + `allure-playwright` reporters, and `actionTimeout`/`navigationTimeout`.
4. Add `src/utils/Logger.ts`, then `src/utils/UtilElementLocator.ts`, then `src/pages/BasePage.ts` (dependency order).
5. Add Page Objects extending `BasePage`, then `src/fixtures/test-base.ts` exposing them.
6. Write specs in `src/tests/`, tagging titles for selective runs.
7. Run `npm run verify` (type-check + lint) before finishing.

## Key file templates

### `src/utils/Logger.ts` — scoped logging

```typescript
import winston from 'winston';
const { combine, timestamp, printf, colorize, errors } = winston.format;
const LOG_LEVEL = process.env.LOG_LEVEL ?? 'info';

const lineFormat = printf(({ level, message, timestamp: ts, scope }) => {
  const tag = scope ? ` [${scope as string}]` : '';
  return `${ts as string} [${level}]${tag} ${message as string}`;
});

export const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), lineFormat),
  transports: [
    new winston.transports.Console({ format: combine(colorize({ level: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), lineFormat) }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

export function createLogger(scope: string): winston.Logger {
  return logger.child({ scope });
}
export type Logger = winston.Logger;
export default logger;
```

### `src/utils/UtilElementLocator.ts` — action wrapper (only file using raw actions)

Accepts a `Flex = string | Locator` so call sites can pass a CSS string or a
prebuilt `Locator`. Provides actions (`click`, `fill`, `hover`, `clear`),
getters (`getText`, `getValue`, `getAttribute`, `count`), state checks
(`isVisible`, `isEnabled`...), assertions (`expectVisible`, `expectText`),
waits (`waitForVisible`, `waitForHidden`, `waitForPageLoad`) and select helpers.
Every method logs via the scoped logger and accepts a `timeout` (default
`DEFAULT_ACTION_TIMEOUT_MS = 15_000`).

```typescript
import { expect, Locator, Page } from '@playwright/test';
import { createLogger, type Logger } from '@utils/Logger';

export const DEFAULT_ACTION_TIMEOUT_MS = 15_000;
export type Flex = string | Locator;

export class UtilElementLocator {
  private readonly page: Page;
  private readonly log: Logger;
  constructor(page: Page, scope = 'UtilElementLocator') {
    this.page = page;
    this.log = createLogger(scope);
  }
  private toLocator(t: Flex): Locator { return typeof t === 'string' ? this.page.locator(t) : t; }
  private describe(t: Flex): string { return typeof t === 'string' ? t : t.toString(); }

  async click(t: Flex, timeout = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
    this.log.info(`Clicking ${this.describe(t)}`);
    await this.toLocator(t).click({ timeout });
  }
  async fill(t: Flex, value: string, timeout = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
    this.log.info(`Filling ${this.describe(t)} with "${value}"`);
    await this.toLocator(t).fill(value, { timeout });
  }
  async getText(t: Flex, timeout = DEFAULT_ACTION_TIMEOUT_MS): Promise<string> {
    return (await this.toLocator(t).textContent({ timeout })) ?? '';
  }
  async expectVisible(t: Flex, timeout = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
    await expect(this.toLocator(t)).toBeVisible({ timeout });
  }
  // ...add hover, clear, getValue, getAttribute, count, isVisible/Enabled/Disabled,
  //    expectText, waitForVisible/Hidden, waitForPageLoad, selectBy* following this pattern.
}
```

### `src/pages/BasePage.ts` — shared scaffolding

```typescript
import { Page } from '@playwright/test';
import { UtilElementLocator } from '@utils/UtilElementLocator';
import { createLogger, type Logger } from '@utils/Logger';

export abstract class BasePage {
  protected readonly page: Page;
  protected readonly el: UtilElementLocator;
  protected readonly log: Logger;
  protected constructor(page: Page, scope: string) {
    this.page = page;
    this.el = new UtilElementLocator(page, scope);
    this.log = createLogger(scope);
  }
  protected async goto(relativePath: string): Promise<void> {
    await this.page.goto(relativePath);
    await this.page.waitForLoadState('domcontentloaded');
  }
}
```

### Page Object pattern (`src/pages/<Screen>Page.ts`)

- Declare `readonly` `Locator` fields; build them in the constructor.
- Pass the class name as the scope to `super(page, 'LoginPage')`.
- Expose a `static readonly PATH`, an `open()`, and intent methods (`loginAs`, etc.).
- Prefer stable selectors: `[data-test="..."]`, `#id`, role-based locators. Avoid brittle XPath.
- Delegate all interactions to `this.el`.

```typescript
import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  static readonly PATH = '/login';
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page, 'LoginPage');
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
  }

  async open(): Promise<void> {
    this.log.info(`Navigating to ${LoginPage.PATH}`);
    await this.page.goto(LoginPage.PATH);
  }

  async loginAs(username: string, password: string): Promise<void> {
    await this.el.fill(this.usernameInput, username);
    await this.el.fill(this.passwordInput, password);
    await this.el.click(this.loginButton);
  }
}
```

### `src/fixtures/test-base.ts` — Page Object fixtures

```typescript
import { test as baseTest, expect, type Page } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';

export type AppFixtures = {
  loginPage: LoginPage;
  // one entry per Page Object
};

export const test = baseTest.extend<AppFixtures>({
  loginPage: async ({ page }: { page: Page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect };
```

Specs import from `@fixtures/test-base` (not `@playwright/test`) to get injected Page Objects:
`import { test, expect } from '@fixtures/test-base';`

### `playwright.config.ts` essentials

- `testDir: './src/tests'`, `fullyParallel: true`.
- Env-driven `baseURL` via a `resolveBaseURL()` switch on `TTA_ENV` (qa/dev/stg/prod) with `BASE_URL` override; load `.env` with `dotenv`.
- `reporter: [['html', { open: 'never' }], ['allure-playwright']]`.
- `use`: `screenshot: 'only-on-failure'`, `video: 'on'`, `trace: 'on-first-retry'`, `actionTimeout: 15_000`, `navigationTimeout: 30_000`.
- `retries: process.env.CI ? 2 : 0`, `workers: process.env.CI ? 1 : undefined`.
- Projects: chromium enabled; firefox/webkit commented out as opt-in.

### `tsconfig.json` path aliases (keep names in sync with imports)

```json
"paths": {
  "@fixtures/*": ["./src/fixtures/*"],
  "@pages/*": ["./src/pages/*"],
  "@testdata/*": ["./src/testdata/*"],
  "@tests/*": ["./src/tests/*"],
  "@utils/*": ["./src/utils/*"],
  "@config/*": ["./src/config/*"]
}
```
Also set `"strict": true`, `"module"/"moduleResolution": "Node16"`, `"resolveJsonModule": true`, `"noEmit": true`.

## package.json scripts & dependencies

```json
"scripts": {
  "test": "npx playwright test",
  "test:e2e": "npx playwright test --grep @e2e",
  "test:p0": "npx playwright test --grep @p0",
  "test:chromium": "npx playwright test --project=chromium",
  "test:debug": "npx playwright test --debug",
  "test:report": "npx playwright show-report",
  "lint": "npx eslint . --ext .ts,.js",
  "type-check": "npx tsc --noEmit",
  "verify": "npm run type-check && npm run lint",
  "format": "npx prettier --write ."
}
```

Dev dependencies: `@playwright/test`, `typescript`, `@types/node`, `winston`,
`dotenv`, `allure-playwright`, `eslint` + `@typescript-eslint/*` +
`typescript-eslint` + `globals`, `prettier` + `eslint-config-prettier`,
`@faker-js/faker`, `csv-parse`, `xlsx`.

## Conventions

- **Tags**: put `@e2e`, `@p0`, `@ui`, etc. in test titles; select with `--grep @tag`.
- **Test data**: static JSON in `src/testdata/`, imported via `@testdata/*`.
- **Logging scope**: always the class name, so log lines read `[LoginPage] Clicking ...`.
- **Selectors**: stable first — `data-test`, `#id`, role/text. No xpath-only.
- **Verify rule** (`rules/README.md`): after adding/changing tests, run `npm run verify`.

## CI (`.github/workflows/playwright.yml`)

Trigger on push/PR to `main`/`master`: `npm ci` → `npx playwright install --with-deps`
→ `npx playwright test` → upload `playwright-report/` artifact.

## Verification checklist

- [ ] `npm run type-check` passes (aliases resolve, no implicit any).
- [ ] `npm run lint` passes.
- [ ] Tests import from `@fixtures/test-base`, not `@playwright/test`.
- [ ] Page Objects extend `BasePage` and delegate actions to `this.el`.
- [ ] Each Page Object passes its class name as the logger scope.
```
