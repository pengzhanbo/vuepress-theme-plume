import { watch } from 'vue'
import { usePageData } from 'vuepress/client'

declare global {
  interface Window {
    _hmt?: [name: string, options: any][]
  }
}

/**
 * Add baidu analytics to the site
 *
 * @see https://tongji.baidu.com/
 * @see https://tongji.baidu.com/holmes/Analytics/%E7%99%BE%E5%BA%A6%E7%BB%9F%E8%AE%A1%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C
 * @see https://tongji.baidu.com/holmes/Analytics/%E6%8A%80%E6%9C%AF%E6%8E%A5%E5%85%A5%E6%8C%87%E5%8D%97/JS%20API/JS%20API%E6%8A%80%E6%9C%AF%E6%96%87%E6%A1%A3/_trackPageview
 */
export function useBaiduTongji(): void {
  if (!window._hmt)
    return

  const page = usePageData()

  watch(
    () => page.value.path,
    (newLocation) => {
      window._hmt?.push(['_trackPageview', newLocation])
    },
  )
}
