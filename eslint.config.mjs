import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  // Reglas personalizadas
  {
    rules: {
      // Variables e imports sin usar: error
      '@typescript-eslint/no-unused-vars': 'error',
      'no-unused-vars': 'error',
      // Console logs: advertencia
      'no-console': 'warn',
    },
  },
]);

export default eslintConfig;
