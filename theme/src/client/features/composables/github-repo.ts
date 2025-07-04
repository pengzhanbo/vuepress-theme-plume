import type { MaybeRef, Ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { computed, ref, toValue, watch } from 'vue'

interface GithubRepoLicense {
  name: string
  url: string
}

export interface GithubRepoInfo {
  name: string
  fullName: string
  description: string
  url: string
  stars: number
  forks: number
  convertStars: number | string
  convertForks: number | string
  watchers: number
  language: string
  languageColor: string
  visibility: 'Private' | 'Public' // private, public
  template: boolean
  ownerType: 'User' | 'Organization'
  license: GithubRepoLicense | null
}

/**
 * 由于 github repo api 请求频率过高，vercel 免费额度有限，因此使用本地缓存。
 * 默认缓存 6 小时 时间
 */
const storage = useLocalStorage('__VUEPRESS_GITHUB_REPO__', {} as Record<string, {
  info: GithubRepoInfo
  updatedAt: number
}>)

interface UseGithubRepoResult {
  data: Ref<GithubRepoInfo | null>
  loaded: Ref<boolean>
}

export function useGithubRepo(repo: MaybeRef<string>): UseGithubRepoResult {
  const repoRef = computed(() => {
    const info = toValue(repo)
    const [owner = '', name = ''] = info.split('/')
    return { owner, name }
  })
  const data = ref<GithubRepoInfo | null>(null)
  const loaded = ref(false)

  async function fetchData() {
    const { owner, name } = repoRef.value
    if (__VUEPRESS_SSR__ || !owner || !name)
      return

    const key = `${owner}/${name}`
    const cached = storage.value[`${owner}/${name}`]
    if (cached?.info?.name && Date.now() - cached.updatedAt <= 86400000) {
      data.value = cached.info
      loaded.value = true
      return
    }

    loaded.value = false
    try {
      const res = await fetch(`https://api.pengzhanbo.cn/github/repo/${owner}/${name}`)
        .then(res => res.json()) as GithubRepoInfo

      loaded.value = true

      res.convertStars = convertThousand(res.stars)
      res.convertForks = convertThousand(res.forks)

      data.value = res

      storage.value[key] = {
        info: res,
        updatedAt: Date.now(),
      }
    }
    catch (e) {
      loaded.value = true
      console.error('github repo error:', e)
    }
  }

  if (!__VUEPRESS_SSR__) {
    watch(repoRef, fetchData, { immediate: true })
  }

  return { data, loaded }
}

function convertThousand(num: number): number | string {
  if (num < 1000)
    return num
  return `${(num / 1000).toFixed(1)}k`
}
