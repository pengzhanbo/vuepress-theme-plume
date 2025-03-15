import type { MaybeRef } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { computed, ref, toValue, watch } from 'vue'

export interface GithubRepoInfo {
  name: string
  fullName: string
  description: string
  url: string
  stars: number
  forks: number
  watchers: number
  language: string
  languageColor: string
  visibility: 'Private' | 'Public' // private, public
  template: boolean
  ownerType: 'User' | 'Organization'
  license: {
    name: string
    url: string
  } | null
}

/**
 * 由于 github repo api 请求频率过高，vercel 免费额度有限，因此使用本地缓存。
 * 默认缓存 6 小时 时间
 */
const storage = useLocalStorage('github-repo', {} as Record<string, {
  info: GithubRepoInfo
  updatedAt: number
}>)

export function useGithubRepo(repo: MaybeRef<string>) {
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

  watch(repoRef, fetchData, { immediate: true })

  return { data, loaded }
}
