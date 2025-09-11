export default [
  {
    ignores: [
      '**/node_modules/**',
      'code/frontend/dist/**',
      'code/frontend/public/**',
      'code/tmp/**',
      'tmp/**',
      'test-results/**',
      'playwright-report/**',
      'coverage/**',
      '__tests__/**',
    ],
  },
  {
    files: ['code/frontend/src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
      },
    },
    rules: {
      no-unused-vars: ['error', { varsIgnorePattern: '^[A-Z_]' }],
      no-undef: 'off',
      semi: ['error', 'always'],

      '@stylistic/semi': 'off',
      '@stylistic/indent': 'off',
      '@stylistic/no-trailing-spaces': 'off',
      '@stylistic/jsx-one-expression-per-line': 'off',
      '@stylistic/jsx-closing-tag-location': 'off',
      '@stylistic/brace-style': 'off',
      '@stylistic/arrow-parens': 'off',
      '@stylistic/multiline-ternary': 'off',
      '@stylistic/jsx-first-prop-new-line': 'off',
      '@stylistic/jsx-max-props-per-line': 'off',
      '@stylistic/operator-linebreak': 'off',
      '@stylistic/comma-dangle': 'off',
    },
  },
];