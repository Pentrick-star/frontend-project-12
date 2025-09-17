import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  // игнор
  { ignores: ['**/dist/**', '**/build/**', '**/node_modules/**'] },

  // общие настройки + правила JS
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

      // важно: чтобы JSX помечал импорты как использованные
      ...react.configs.flat.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-vars': 'error',
    },
    settings: { react: { version: 'detect' } },
  },

  // базовый стиль, чтобы автофикс убрать пробелы/скобки/запятые и т.п.
  {
    files: ['frontend/src/**/*.{js,jsx}'],
    plugins: { '@stylistic': stylistic },
    rules: {
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/padded-blocks': ['error', 'never'],
      '@stylistic/multiline-ternary': ['error', 'always-multiline'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/jsx-one-expression-per-line': ['error', { allow: 'none' }],
      '@stylistic/jsx-curly-newline': ['error', { multiline: 'consistent', singleline: 'consistent' }],
      '@stylistic/eol-last': ['error', 'always'],
    },
  },
])