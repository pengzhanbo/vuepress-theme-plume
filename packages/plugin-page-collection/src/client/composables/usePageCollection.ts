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

const fetchCollection = async (url: string): Promise<PageCollection> => {
  const response = await fetch(`${prefix}/page_collection`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })
  const result = (await response.json()) as unknown as ResponseData
  if (result.code === 200) {
    return (result.result || {}) as PageCollection
  } else {
    return {
      visitCount: 0,
    }
  }
}

export const usePageCollection = (): PageCollection => {
  const collection = reactive({
    visitCount: 0,
  })
  const route = useRoute()
  const getPageCollection = async (url: string): Promise<void> => {
    const { visitCount } = await fetchCollection(url)
    collection.visitCount = visitCount
  }
  onMounted(() => {
    // why ? mounted 比 router enter 更早 ？？？？？
    setTimeout(async () => {
      await getPageCollection(route.path)
    }, 0)
  })

  return collection
}
