import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
  ignores: ['node_modules', 'build'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
    'no-var': 'error',
    'prefer-const': 'error',
    eqeqeq: ['error', 'always'],
    'no-implicit-coercion': 'error',
  },
});
