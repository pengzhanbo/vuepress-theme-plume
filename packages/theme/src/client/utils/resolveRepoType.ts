import { isLinkHttp } from '@vuepress/shared'

export type RepoType = 'Github' | 'GitLab' | 'Gitee' | 'Bitbucket' | null

export const resolveRepoType = (repo: string): RepoType => {
  if (isLinkHttp(repo) || /github\.com/.test(repo)) return 'Github'
  if (/bitbucket\.org/.test(repo)) return 'Bitbucket'
  if (/gitlab\.com/.test(repo)) return 'GitLab'
  if (/gitee\.com/.test(repo)) return 'Gitee'
  return null
}
