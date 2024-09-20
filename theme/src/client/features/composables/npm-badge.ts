import type { ComputedRef, InjectionKey, Ref } from 'vue'
import { computed, inject, provide, ref, toValue } from 'vue'

const DEFAULT_COLOR = '#32A9C3'
const DEFAULT_LABEL_COLOR = '#1B3C4A'
const BADGE_URL = 'https://img.shields.io'
const GITHUB_URL = 'https://github.com'
const NPM_URL = 'https://www.npmjs.com/package'

export type NpmBadgeType =
  // github
  | 'source' // github source
  | 'stars' // github stars
  | 'forks' // github forks
  | 'license' // github license
  // npm
  | 'version' // npm version
  | 'dt' // alias d18m
  | 'd18m' // npm downloads last 18 months
  | 'dw' // npm downloads weekly
  | 'dm' // npm downloads monthly
  | 'dy' // npm downloads yearly

export type NpmBadgeTheme = 'flat' | 'flat-square' | 'plastic' | 'for-the-badge' | 'social'

export interface NpmBadgeBaseOptions {
  // npm package name
  name?: string
  // github repo
  repo?: string
  // github branch
  branch?: string
  // github directory
  dir?: string
  // text color
  color?: string
  // label color
  labelColor?: string
  // badge style
  theme?: NpmBadgeTheme
}

export interface NpmBadgeOptions extends NpmBadgeBaseOptions {
  type: NpmBadgeType
  // label text
  label?: string
}

export interface NpmBadgeGroupOptions extends Omit<NpmBadgeBaseOptions, 'label'> {
  items?: string | NpmBadgeType | NpmBadgeType[]
}

export interface NpmBadgeInfo {
  badgeUrl: string
  link?: string
  alt?: string
}

type NpmBadgeBaseOptionsRef = Ref<NpmBadgeBaseOptions>

const NpmBadgeSymbol: InjectionKey<NpmBadgeBaseOptionsRef> = Symbol(__VUEPRESS_DEV__ ? 'NpmBadge' : '')

export function useNpmBadge(opt: Ref<NpmBadgeOptions>): ComputedRef<NpmBadgeInfo> {
  const parentOpt = inject(NpmBadgeSymbol, ref({}) as NpmBadgeBaseOptionsRef)

  return computed(() => {
    const po = toValue(parentOpt)
    const o = toValue(opt)
    const res: NpmBadgeOptions = {
      name: o.name || po.name,
      repo: o.repo || po.repo,
      branch: o.branch || po.branch,
      dir: o.dir || po.dir,
      type: o.type,
      color: o.color || po.color,
      label: o.label,
      labelColor: o.labelColor || po.labelColor,
      theme: o.theme || po.theme,
    }
    return resolveNpmBadgeOptions(res)
  })
}

export function useNpmBadgeGroup(opt: Ref<NpmBadgeGroupOptions>) {
  const baseOptions = computed<NpmBadgeBaseOptions>(() => {
    const o = toValue(opt)
    return {
      name: o.name,
      repo: o.repo,
      branch: o.branch,
      dir: o.dir,
      color: o.color,
      labelColor: o.labelColor,
      theme: o.theme,
    }
  })

  provide(NpmBadgeSymbol, baseOptions)
}

function resolveNpmBadgeOptions(options: NpmBadgeOptions): NpmBadgeInfo {
  let { name = '', repo = '', branch = 'main', dir = '', type, color, label, labelColor, theme = '' } = options
  name = name || repo.split('/')?.[1] || ''
  const normalizeName = encodeURIComponent(name)

  const githubLink = repo ? `${GITHUB_URL}/${repo}${dir ? `/tree/${branch}/${dir}` : ''}` : ''
  const npmLink = `${NPM_URL}/${name}`

  const params = new URLSearchParams()

  if (type !== 'source' && type !== 'stars' && type !== 'forks') {
    params.append('style', theme || 'flat')
    params.append('color', color || DEFAULT_COLOR)
    params.append('labelColor', labelColor || DEFAULT_LABEL_COLOR)
  }

  switch (type) {
    case 'source': {
      params.append('logo', 'github')
      params.append('color', labelColor || DEFAULT_LABEL_COLOR)
      return {
        badgeUrl: `${BADGE_URL}/badge/source-a?${params.toString()}`,
        link: githubLink,
        alt: 'github source',
      }
    }
    case 'stars':
    case 'forks': {
      params.append('style', theme || 'social')
      return {
        badgeUrl: `${BADGE_URL}/github/${type}/${repo}?${params.toString()}`,
        link: githubLink,
        alt: `github ${type}`,
      }
    }
    case 'license':
      return {
        badgeUrl: `${BADGE_URL}/github/license/${repo}?${params.toString()}`,
        link: githubLink,
        alt: 'license',
      }
    case 'version': {
      params.append('label', label || name || 'npm')
      return {
        badgeUrl: `${BADGE_URL}/npm/v/${normalizeName}?${params.toString()}`,
        link: npmLink,
        alt: 'npm version',
      }
    }
    case 'dt':
    case 'd18m': {
      params.append('label', label || 'downloads')
      return {
        badgeUrl: `${BADGE_URL}/npm/d18m/${normalizeName}?${params.toString()}`,
        link: npmLink,
        alt: 'npm downloads',
      }
    }
    case 'dm':
    case 'dy':
    case 'dw': {
      params.append('label', label || 'downloads')
      return {
        badgeUrl: `${BADGE_URL}/npm/${type}/${normalizeName}?${params.toString()}`,
        link: npmLink,
        alt: 'npm downloads',
      }
    }
    default:
      return {
        badgeUrl: `${BADGE_URL}/badge/unknown?${params.toString()}`,
        alt: 'unknown',
      }
  }
}
