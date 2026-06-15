# Phase 1 Commands

## Git and Jenkins Troubleshooting
- `sudo -u jenkins which git`
- `brew install git`
- `sudo chown -R jenkins:jenkins /Users/techverito/.jenkins/workspace/`
- Restart Jenkins service if needed

## Playwright Jenkins Build Steps
- `npm ci`
- `npx playwright install --with-deps`
- `npm run test`
- `npm run test -- src/tests/e2e.spec.ts`

## Report Publishing
- `npx allure generate allure-results --clean -o allure-report`

## Notes
- Use Jenkins **Execute shell** instead of **Execute NodeJS script** for npm commands
- Publish `playwright-report` with `index.html`
- Publish `allure-results` via Allure plugin or generate `allure-report`
