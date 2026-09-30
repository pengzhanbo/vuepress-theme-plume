/**
 * Request timeout in milliseconds.
 *
 * 请求超时时间（毫秒）。
 */
const REQUEST_TIMEOUT = 15_000

/**
 * Perform a fetch request with a timeout, response status validation and
 * JSON body parsing.
 *
 * 发起带有超时、响应状态校验与 JSON 响应体解析的 fetch 请求。
 *
 * The response body is read inside this function so the timeout stays active
 * until the body is fully consumed. `fetch()` resolves as soon as the response
 * headers arrive, while the body can still be aborted through the controller;
 * clearing the timer earlier would let `res.json()` hang forever when the
 * server stops sending the body.
 *
 * 响应体在本函数内读取，保证超时在整个响应体读取期间保持有效。`fetch()` 在响应头
 * 到达时即可 resolve，而响应体仍可被同一个 AbortController 中止；若提前清除计时器，
 * 服务端停止发送响应体时 `res.json()` 将永久挂起。
 *
 * @param url - Request URL / 请求地址
 * @param init - Fetch options / fetch 选项
 * @returns Parsed JSON response / 解析后的 JSON 响应
 */
async function request<R>(url: string, init?: RequestInit): Promise<R> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const res = await fetch(url, { ...init, signal: controller.signal })
    if (!res.ok)
      throw new Error(`Request failed with status ${res.status} ${res.statusText}`)
    return await res.json() as R
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
    return await request<R>(_url.toString())
  },

  post: async <T extends object = object, R = any>(
    url: string,
    data?: T,
  ): Promise<R> => {
    return await request<R>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    })
  },
}
