import globals from 'globals';

export default [
  {
    ignores: [
      '**/node_modules/**',
      'frontend/dist/**',
      'frontend/public/**',
      'tmp/**',
      'test-results/**',
      'playwright-report/**',
      'coverage/**',
      '__tests__/**',
    ],
  },
  {
  files: ['frontend/src/**/*.{js,jsx}'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
    globals: globals.browser,
  },
  rules: {
    // убрать сыпь стилистики
    '@stylistic/semi': 'off',
    '@stylistic/indent': 'off',
    '@stylistic/indent-binary-ops': 'off',
    '@stylistic/no-trailing-spaces': 'off',
    '@stylistic/no-multi-spaces': 'off',
    '@stylistic/comma-dangle': 'off',
    '@stylistic/operator-linebreak': 'off',
    '@stylistic/padded-blocks': 'off',
    '@stylistic/brace-style': 'off',
    '@stylistic/arrow-parens': 'off',
    '@stylistic/multiline-ternary': 'off',
    '@stylistic/jsx-wrap-multilines': 'off',
    '@stylistic/jsx-first-prop-new-line': 'off',
    '@stylistic/jsx-max-props-per-line': 'off',
    '@stylistic/jsx-one-expression-per-line': 'off',
    '@stylistic/jsx-closing-tag-location': 'off',
    '@stylistic/jsx-closing-bracket-location': 'off',
    '@stylistic/jsx-indent-props': 'off',

    'no-unused-vars': ['off'],
    'semi': 'off',
  },
},
];