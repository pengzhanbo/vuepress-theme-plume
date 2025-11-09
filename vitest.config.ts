import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/__test__/**/*.spec.[tj]s'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/lib/**',
    ],
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['text', 'clover', 'json'],
    },
  },
})
