import { describe, expect, it } from 'vitest'
import { editLinkPatterns, resolveEditLink } from '../utils/resolveEditLink.js'
import { resolveRepoType } from '../utils/resolveRepoType.js'

describe('resolveRepoType', () => {
  it('detects the supported repository platforms', () => {
    expect(resolveRepoType('owner/repo')).toBe('GitHub')
    expect(resolveRepoType('https://github.com/owner/repo')).toBe('GitHub')
    expect(resolveRepoType('https://gitlab.com/group/repo')).toBe('GitLab')
    expect(resolveRepoType('https://gitee.com/owner/repo')).toBe('Gitee')
    expect(resolveRepoType('https://bitbucket.org/owner/repo')).toBe('Bitbucket')
  })

  it('returns null for an unknown http host', () => {
    expect(resolveRepoType('https://example.com/owner/repo')).toBeNull()
  })
})

describe('resolveEditLink', () => {
  it('returns null when the relative file path is missing', () => {
    expect(resolveEditLink({
      docsRepo: 'owner/repo',
      docsBranch: 'main',
      docsDir: 'docs',
      filePathRelative: undefined,
    })).toBeNull()
  })

  it('returns null when neither the repo type nor a custom pattern is known', () => {
    expect(resolveEditLink({
      docsRepo: 'https://example.com/owner/repo',
      docsBranch: 'main',
      docsDir: 'docs',
      filePathRelative: 'guide/a.md',
    })).toBeNull()
  })

  it('builds a GitHub edit link from a bare repo path', () => {
    expect(resolveEditLink({
      docsRepo: 'owner/repo',
      docsBranch: 'main',
      docsDir: 'docs',
      filePathRelative: 'guide/a.md',
    })).toBe('https://github.com/owner/repo/edit/main/docs/guide/a.md')
  })

  it('normalizes the leading and trailing slashes of the docs directory', () => {
    expect(resolveEditLink({
      docsRepo: 'owner/repo',
      docsBranch: 'main',
      docsDir: '/docs/',
      filePathRelative: 'guide/a.md',
    })).toBe('https://github.com/owner/repo/edit/main/docs/guide/a.md')
  })

  it('uses the platform-specific patterns', () => {
    expect(resolveEditLink({
      docsRepo: 'https://gitlab.com/group/repo',
      docsBranch: 'main',
      docsDir: 'docs',
      filePathRelative: 'a.md',
    })).toBe('https://gitlab.com/group/repo/-/edit/main/docs/a.md')

    // Bitbucket 模板中的两处 `:branch` 都必须被替换。
    expect(resolveEditLink({
      docsRepo: 'https://bitbucket.org/owner/repo',
      docsBranch: 'main',
      docsDir: 'docs',
      filePathRelative: 'a.md',
    })).toBe(
      'https://bitbucket.org/owner/repo/src/main/docs/a.md?mode=edit&spa=0&at=main&fileviewer=file-view-default',
    )
  })

  it('supports a custom pattern for an unknown repository', () => {
    expect(resolveEditLink({
      docsRepo: 'https://example.com/owner/repo',
      docsBranch: 'main',
      docsDir: 'docs',
      filePathRelative: 'a.md',
      editLinkPattern: ':repo/blob/:branch/:path',
    })).toBe('https://example.com/owner/repo/blob/main/docs/a.md')
  })

  it('handles an empty docs directory', () => {
    expect(resolveEditLink({
      docsRepo: 'owner/repo',
      docsBranch: 'main',
      docsDir: '',
      filePathRelative: 'a.md',
    })).toBe('https://github.com/owner/repo/edit/main/a.md')
  })

  it('exposes the default patterns for every supported platform', () => {
    expect(Object.keys(editLinkPatterns)).toEqual(['GitHub', 'GitLab', 'Gitee', 'Bitbucket'])
  })
})
