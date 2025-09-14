import js from "@eslint/js"
import globals from "globals"
import pluginReact from "eslint-plugin-react"
import { defineConfig } from "eslint/config"

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ignores: ["**/dist/**", "**/build/**", "**/node_modules/**"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
  },
])
