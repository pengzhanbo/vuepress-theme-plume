import { attemptAsync, isString } from '@pengzhanbo/utils'
import spawn from 'nano-spawn'

/**
 * Cache of package manager version lookups, keyed by package manager name.
 *
 * 包管理器版本查询结果的缓存，以包管理器名称为键。
 */
const versionCache = new Map<string, Promise<string | null>>()

/**
 * Get the version of a package manager.
 *
 * The result is cached per process so that the version is probed only once,
 * even when several steps need it.
 *
 * 获取包管理器的版本。
 *
 * 结果按进程缓存，即使多个步骤都需要版本号，也只会探测一次。
 *
 * @param pm - Package manager name (npm, yarn, pnpm) / 包管理器名称
 * @returns Version string, or `null` when the command fails / 版本字符串，命令失败时返回 `null`
 */
export function getPackageManagerVersion(pm: string): Promise<string | null> {
  let cached = versionCache.get(pm)
  if (!cached) {
    cached = attemptAsync(async () => {
      const { output } = await spawn(pm, ['--version'])
      return output.trim()
    }).then(([error, version]) => (error || !isString(version) ? null : version))
    versionCache.set(pm, cached)
  }

  return cached
}

/**
 * Get the major version of pnpm.
 *
 * @returns Major version number, or `0` when pnpm cannot be probed / 主版本号，无法探测时返回 `0`
 */
export async function getPnpmMajorVersion(): Promise<number> {
  const version = await getPackageManagerVersion('pnpm')
  const major = version ? Number.parseInt(version.split('.')[0], 10) : Number.NaN

  return Number.isNaN(major) ? 0 : major
}
