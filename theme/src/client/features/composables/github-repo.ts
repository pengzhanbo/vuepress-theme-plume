import type { MaybeRef } from 'vue'
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

    loaded.value = false
    const res = await fetch(`https://api.pengzhanbo.cn/github/repo/${owner}/${name}`)
      .then(res => res.json()) as GithubRepoInfo

    data.value = res
    loaded.value = true
  }

  watch(repoRef, fetchData, { immediate: true })

  return { data, loaded }
}
