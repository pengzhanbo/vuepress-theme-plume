import { isLinkHttp } from 'vuepress/shared'

/**
 * Supported repository types
 * Represents the type of code hosting platform
 *
 * 支持的仓库类型
 * 表示代码托管平台的类型
 */
export type RepoType = 'GitHub' | 'GitLab' | 'Gitee' | 'Bitbucket' | null

/**
 * Resolve the repository type from a repository URL
 * Detects the platform based on URL patterns
 *
 * 从仓库 URL 解析仓库类型
 * 基于 URL 模式检测平台
 *
 * @param repo - Repository URL or path / 仓库 URL 或路径
 * @returns The detected repository type or null if unknown / 检测到的仓库类型，如果未知则返回 null
 */
export function resolveRepoType(repo: string): RepoType {
  if (!isLinkHttp(repo) || /github\.com/.test(repo))
    return 'GitHub'
  if (/bitbucket\.org/.test(repo))
    return 'Bitbucket'
  if (/gitlab\.com/.test(repo))
    return 'GitLab'
  if (/gitee\.com/.test(repo))
    return 'Gitee'
  return null
}
