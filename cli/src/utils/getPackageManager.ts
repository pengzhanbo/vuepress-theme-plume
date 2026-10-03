import type { PackageManager } from '../types.js'
import process from 'node:process'
import { t } from '../translate.js'

/**
 * Detect the current package manager from environment variables.
 *
 * The CLI only supports npm, yarn and pnpm. Any other value (e.g. `bun`) would
 * produce incorrect npm scripts and command hints, so it falls back to npm and
 * warns the user instead of silently pretending to support it.
 *
 * 从环境变量检测当前使用的包管理器。
 *
 * CLI 仅支持 npm、yarn 与 pnpm。其余取值（如 `bun`）会生成错误的 npm scripts
 * 与命令提示，因此回退为 npm 并给出警告，而不是静默地假装支持。
 *
 * @returns The detected package manager name / 检测到的包管理器名称
 * @example
 * // When using pnpm
 * const pm = getPackageManager() // returns 'pnpm'
 *
 * // When using npm
 * const pm = getPackageManager() // returns 'npm'
 */
export function getPackageManager(): PackageManager {
  const name = process.env?.npm_config_user_agent || 'npm'
  const pm = name.split('/')[0]

  if (pm === 'npm' || pm === 'yarn' || pm === 'pnpm')
    return pm

  console.warn(`${t('hint.packageManager.unsupported')} (${pm})`)
  return 'npm'
}
