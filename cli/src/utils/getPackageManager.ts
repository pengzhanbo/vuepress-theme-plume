import process from 'node:process'
import type { PackageManager } from '../types.js'

export function getPackageManager(): PackageManager {
  const name = process.env?.npm_config_user_agent || 'npm'
  return name.split('/')[0] as PackageManager
}
