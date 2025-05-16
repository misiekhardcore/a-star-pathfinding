import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import nextPlugin from '@next/eslint-plugin-next';
import globals from 'globals';

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: ['tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier,
      '@next/next': nextPlugin,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
    ignores: [
      'node_modules/**',
      '.next/**',
      'next.config.js',
      'tailwind.config.js',
      'postcss.config.js',
      '.lintstagedrc.js',
    ],
  },
];
