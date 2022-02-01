module.exports = {
  extends: ['next', 'next/core-web-vitals', 'prettier'],
  plugins: ['testing-library'],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
  },
  overrides: [
    // Only uses Testing Library lint rules in test files
    {
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
  },
}
