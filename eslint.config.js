import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  { ignores: ['**/dist/**', '**/build/**', '**/node_modules/**'] },
  {
    files: ['frontend/src/**/*.{js,jsx}'],
    languageOptions: {
      globals: globals.browser,
      sourceType: 'module',
      ecmaVersion: 'latest',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react, '@stylistic': stylistic },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.flat.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-vars': 'error',

      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/brace-style': ['error', 'stroustrup'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/jsx-one-expression-per-line': 'error',
      '@stylistic/jsx-curly-newline': ['error', { multiline: 'consistent', singleline: 'consistent' }],
      '@stylistic/padded-blocks': ['error', 'never'],
      '@stylistic/multiline-ternary': ['error', 'always-multiline'],
      '@stylistic/semi': ['error', 'never'],
    },
    settings: { react: { version: 'detect' } },
  },
])

