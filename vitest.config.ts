// import process from 'node:process'
import { defineConfig } from 'vitest/config'

/**
 * Coverage thresholds are only enforced on a full run, which is what CI does
 * (`CI=true` is set by GitHub Actions).
 *
 * The pre-commit hook runs `vitest related --run`, i.e. a subset of the tests. The
 * coverage collected from that subset is only meaningful for the files it actually
 * touched, so an aggregate threshold would report a misleading drop on every commit.
 *
 * 覆盖率阈值仅在完整运行时校验，CI 会设置 `CI=true`。
 *
 * pre-commit 钩子执行的是 `vitest related --run`，只运行部分测试；
 * 由此得到的覆盖率只对被执行到的文件有意义，聚合阈值会在每次提交时误报覆盖率下降。
 *
 * The values sit a few points below the current numbers, so a real regression is
 * caught while small fluctuations do not break the build.
 * 阈值略低于当前实测值：既能拦住实际的覆盖率下降，又不会被小幅波动误伤。
 */
// const thresholds = process.env.CI
//   ? {
//       // Whole repository floor / 全仓库下限
//       'statements': 85,
//       'branches': 75,
//       'functions': 82,
//       'lines': 85,
//       // Core build pipeline and client runtime of the theme / 主题的核心构建管线与客户端运行时
//       'theme/src/node/**': { statements: 60, branches: 45, functions: 60, lines: 60 },
//       'theme/src/client/**': { statements: 68, branches: 64, functions: 74, lines: 68 },
//     }
//   : undefined

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
      provider: 'v8',
      reporter: ['text', 'clover', 'json'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/lib/**',
        '**/demo/**',
        '**/demo/supports/**',
      ],
      // thresholds,
    },
  },
})
