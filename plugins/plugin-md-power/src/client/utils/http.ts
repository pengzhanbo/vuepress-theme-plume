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
    const res = await fetch(_url.toString())
    return await res.json()
  },

  post: async <T extends object = object, R = any>(
    url: string,
    data?: T,
  ): Promise<R> => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    })
    return await res.json()
  },
}
