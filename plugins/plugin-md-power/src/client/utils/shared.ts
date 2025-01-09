const cache: {
  [src: string]: Promise<void> | undefined
} = {}
export function loadScript(src: string) {
  if (__VUEPRESS_SSR__)
    return Promise.resolve()

  if (document.querySelector(`script[src="${src}"]`)) {
    if (cache[src])
      return cache[src]
    return Promise.resolve()
  }

  const script = document.createElement('script')
  script.src = src
  document.body.appendChild(script)

  cache[src] = new Promise((resolve, reject) => {
    script.onload = () => {
      resolve()
      delete cache[src]
    }
    script.onerror = reject
  })
  return cache[src]
}

export function loadStyle(href: string, target: ShadowRoot) {
  if (__VUEPRESS_SSR__)
    return

  if (target.querySelector(`link[href="${href}"]`))
    return

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  target.appendChild(link)
}
