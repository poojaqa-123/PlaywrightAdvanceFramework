const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
module.exports = [
  // Ignore node_modules and build artifacts by default
  {
    ignores: ["node_modules/**", "dist/**", "test-results/**"]
  },
  // Lint JS and TS files using the TypeScript ESLint parser/plugin
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      // keep strictness minimal here; projects can enable more rules later
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn']
    }
  }
];
