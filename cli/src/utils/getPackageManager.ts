import type { PackageManager } from '../types.js'
import process from 'node:process'

/**
 * Detect the current package manager from environment variables.
 *
 * 从环境变量检测当前使用的包管理器。
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
  return name.split('/')[0] as PackageManager
}
