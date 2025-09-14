import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: ['**/dist/**', '**/build/**', '**/node_modules/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    ignores: ['**/dist/**', '**/build/**', '**/node_modules/**'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.browser,
      sourceType: 'module',
      ecmaVersion: 'latest',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    ignores: ['**/dist/**', '**/build/**', '**/node_modules/**'],
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-vars': 'error',
    },
  },
])
