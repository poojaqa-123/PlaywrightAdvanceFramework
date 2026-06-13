# Rule Folder

This folder documents the rule for adding new test cases.

## Rule
Whenever a new test case is added, run both of the following checks:

- `npm run type-check`
- `npm run lint`

## Recommended command

Use the combined verification command:

```bash
npm run verify
```

This ensures new tests are type-safe and follow lint rules.
