import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: ['**/build/*,', '**/node_modules/*']
  },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]
