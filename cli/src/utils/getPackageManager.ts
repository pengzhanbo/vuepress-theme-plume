import type { PackageManager } from '../types.js'
import process from 'node:process'

export function getPackageManager(): PackageManager {
  const name = process.env?.npm_config_user_agent || 'npm'
  return name.split('/')[0] as PackageManager
}
