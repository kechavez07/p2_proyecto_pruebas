import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import stylistic from '@stylistic/eslint-plugin';

export default [
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
  '@typescript-eslint': tseslint,
  react: reactPlugin,
  '@stylistic': stylistic
    },
    rules: {
      // Para JS y TS: comillas simples
      quotes: ['error', 'single'],
      // Para TS: punto y coma obligatorio usando la regla importada del plugin
  '@stylistic/semi': ['error', 'always'],
      // Para JS puro (opcional, puedes dejarlo o quitarlo)
      semi: ['error', 'always']
    }
  }
];