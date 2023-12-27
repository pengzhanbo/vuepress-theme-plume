import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

declare const __COLLECTION_PROXY_PREFIX__: string

const prefix = __COLLECTION_PROXY_PREFIX__

interface PageCollection {
  visitCount: number
}

interface ResponseData {
  code: number
  result: Record<string, any>
}

async function fetchCollection(url: string): Promise<PageCollection> {
  // 发起 netlify functions 请求
  // 你已经注意到，接口名就是在 node/functions 目录下的 文件名
  const response = await fetch(`${prefix}/page_collection`, {
    method: 'POST',
    body: JSON.stringify({ url }),
  })
  const result = (await response.json()) as unknown as ResponseData
  if (result.code === 200) {
    return (result.result || {}) as PageCollection
  }
  else {
    return {
      visitCount: 0,
    }
  }
}

export function usePageCollection(): PageCollection {
  const collection = reactive({
    visitCount: 0,
  })
  const route = useRoute()
  const getPageCollection = async (url: string): Promise<void> => {
    const { visitCount } = await fetchCollection(url)
    collection.visitCount = visitCount
  }
  onMounted(() => {
    setTimeout(async () => {
      await getPageCollection(route.path)
    }, 0)
  })

  return collection
}
