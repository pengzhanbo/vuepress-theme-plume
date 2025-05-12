import type { ComputedRef } from 'vue'
import type {
  CopyrightFrontmatter,
  CopyrightLicense,
  CopyrightOptions,
  GitContributor,
  KnownCopyrightLicense,
} from '../../shared/index.js'
import { computed } from 'vue'
import { useRouteLocale } from 'vuepress/client'
import { useContributors } from './contributors.js'
import { useData } from './data.js'
import { getPresetLocaleData } from './preset-locales.js'

const LICENSE_URL: Record<KnownCopyrightLicense, { url: string, icons: string[] }> = {
  'CC0': {
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    icons: ['zero'],
  },
  'CC-BY-4.0': {
    url: 'https://creativecommons.org/licenses/by/4.0/',
    icons: ['cc', 'by'],
  },
  'CC-BY-NC-4.0': {
    url: 'https://creativecommons.org/licenses/by-nc/4.0/',
    icons: ['cc', 'by', 'nc'],
  },
  'CC-BY-NC-SA-4.0': {
    url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    icons: ['cc', 'by', 'nc', 'sa'],
  },
  'CC-BY-NC-ND-4.0': {
    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    icons: ['cc', 'by', 'nc', 'nd'],
  },
  'CC-BY-ND-4.0': {
    url: 'https://creativecommons.org/licenses/by-nd/4.0/',
    icons: ['cc', 'by', 'nd'],
  },
  'CC-BY-SA-4.0': {
    url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    icons: ['cc', 'by', 'sa'],
  },
}

interface useCopyrightResult {
  license: ComputedRef<License>
  author: ComputedRef<Exclude<CopyrightFrontmatter['author'], string>>
  hasCopyright: ComputedRef<boolean>
  creation: ComputedRef<CopyrightFrontmatter['creation']>
  creationText: ComputedRef<string>
  sourceUrl: ComputedRef<string | undefined>
}

export function useCopyright(
  copyright: ComputedRef<CopyrightFrontmatter>,
): useCopyrightResult {
  const { theme } = useData<'post'>()
  const routeLocale = useRouteLocale()
  const { contributors } = useContributors()

  const hasCopyright = computed(() => Boolean(copyright.value))

  const creation = computed(() => copyright.value.creation || 'original')

  const license = computed(() => resolveLicense(copyright.value.license, routeLocale.value))

  const author = computed(() => resolveAuthor(copyright.value.author, creation.value, contributors.value))

  const sourceUrl = computed(() => {
    if (creation.value === 'original') {
      if (__VUEPRESS_SSR__)
        return ''
      const url = new URL(location.href.split('#')[0])
      // When using giscus for comments, the redirect link after
      // logging in contains additional parameters.
      url.searchParams.delete('giscus')

      return url.toString()
    }

    return copyright.value.source
  })

  const creationText = computed(() => {
    const creation = copyright.value.creation
    if (creation === 'translate') {
      return theme.value.copyrightCreationTranslateText || 'This article is translated from'
    }
    else if (creation === 'reprint') {
      return theme.value.copyrightCreationReprintText || 'This article is reprint from'
    }
    return theme.value.copyrightCreationOriginalText || 'This article link: '
  })

  return { license, author, hasCopyright, creation, creationText, sourceUrl }
}

interface License {
  name: string
  url?: string
  icons?: string[]
}

function resolveLicense(
  license: CopyrightOptions['license'] = 'CC-BY-4.0',
  locale: string,
): License {
  const result: License = typeof license === 'string' ? { name: license } : { ...license }
  const fallback = LICENSE_URL[result.name]
  const name = getPresetLocaleData(locale, result.name as CopyrightLicense)
  if (name) {
    result.name = `${name} (${result.name})`
  }
  result.url ||= fallback?.url
  result.icons = fallback?.icons
  return result
}

function resolveAuthor(
  author: CopyrightFrontmatter['author'],
  creation: CopyrightFrontmatter['creation'],
  contributors: GitContributor[],
): { name: string, url?: string } | undefined {
  const contributor = contributors[0]

  if (!author && contributor && creation === 'original')
    return contributor

  const options = typeof author === 'string' ? { name: author } : author

  if (options && !options.url) {
    const contributor = contributors.find(c => c.name === options.name)
    if (contributor)
      options.url = contributor.url
  }

  return options
}
