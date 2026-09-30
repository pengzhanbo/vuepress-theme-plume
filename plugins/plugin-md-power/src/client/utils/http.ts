/**
 * Request timeout in milliseconds.
 *
 * 请求超时时间（毫秒）。
 */
const REQUEST_TIMEOUT = 15_000

/**
 * Perform a fetch request with a timeout and response status validation.
 *
 * 发起带有超时与响应状态校验的 fetch 请求。
 *
 * @param url - Request URL / 请求地址
 * @param init - Fetch options / fetch 选项
 * @returns Fetch response / fetch 响应
 */
async function request(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const res = await fetch(url, { ...init, signal: controller.signal })
    if (!res.ok)
      throw new Error(`Request failed with status ${res.status} ${res.statusText}`)
    return res
  }
  finally {
    clearTimeout(timer)
  }
}

export const http = {
  get: async <T extends object = object, R = any>(
    url: string,
    query?: T,
  ): Promise<R> => {
    const _url = new URL(url)
    if (query) {
      for (const [key, value] of Object.entries(query))
        _url.searchParams.append(key, value)
    }
    const res = await request(_url.toString())
    return await res.json()
  },

  post: async <T extends object = object, R = any>(
    url: string,
    data?: T,
  ): Promise<R> => {
    const res = await request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    })
    return await res.json()
  },
}
