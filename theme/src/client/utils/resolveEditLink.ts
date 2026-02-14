import type { RepoType } from './resolveRepoType.js'
import {
  isLinkHttp,
  removeEndingSlash,
  removeLeadingSlash,
} from 'vuepress/shared'
import { resolveRepoType } from './resolveRepoType.js'

/**
 * Edit link patterns for different repository platforms
 * Maps repository types to their respective edit URL patterns
 *
 * 不同仓库平台的编辑链接模式
 * 将仓库类型映射到各自的编辑 URL 模式
 */
export const editLinkPatterns: Record<Exclude<RepoType, null>, string> = {
  GitHub: ':repo/edit/:branch/:path',
  GitLab: ':repo/-/edit/:branch/:path',
  Gitee: ':repo/edit/:branch/:path',
  Bitbucket:
    ':repo/src/:branch/:path?mode=edit&spa=0&at=:branch&fileviewer=file-view-default',
}

/**
 * Resolve the edit link pattern based on repository configuration
 *
 * 根据仓库配置解析编辑链接模式
 *
 * @param params - Parameters object / 参数对象
 * @param params.docsRepo - Repository URL / 仓库 URL
 * @param params.editLinkPattern - Custom edit link pattern / 自定义编辑链接模式
 * @returns The resolved edit link pattern or null / 解析后的编辑链接模式，如果没有则返回 null
 */
function resolveEditLinkPatterns({
  docsRepo,
  editLinkPattern,
}: {
  docsRepo: string
  editLinkPattern?: string
}): string | null {
  if (editLinkPattern)
    return editLinkPattern

  const repoType = resolveRepoType(docsRepo)
  if (repoType !== null)
    return editLinkPatterns[repoType]

  return null
}

/**
 * Resolve the complete edit link URL for a file
 * Generates an edit link based on repository configuration and file path
 *
 * 解析文件的完整编辑链接 URL
 * 根据仓库配置和文件路径生成编辑链接
 *
 * @param params - Parameters object / 参数对象
 * @param params.docsRepo - Repository URL / 仓库 URL
 * @param params.docsBranch - Branch name / 分支名称
 * @param params.docsDir - Documentation directory / 文档目录
 * @param params.filePathRelative - Relative file path / 相对文件路径
 * @param params.editLinkPattern - Custom edit link pattern / 自定义编辑链接模式
 * @returns The complete edit link URL or null / 完整的编辑链接 URL，如果无法生成则返回 null
 */
export function resolveEditLink({
  docsRepo,
  docsBranch,
  docsDir,
  filePathRelative,
  editLinkPattern,
}: {
  docsRepo: string
  docsBranch: string
  docsDir: string
  filePathRelative: string | null
  editLinkPattern?: string
}): string | null {
  if (!filePathRelative)
    return null

  const pattern = resolveEditLinkPatterns({ docsRepo, editLinkPattern })
  if (!pattern)
    return null

  return pattern
    .replace(
      /:repo/,
      isLinkHttp(docsRepo) ? docsRepo : `https://github.com/${docsRepo}`,
    )
    .replace(/:branch/, docsBranch)
    .replace(
      /:path/,
      removeLeadingSlash(`${removeEndingSlash(docsDir)}/${filePathRelative}`),
    )
}
