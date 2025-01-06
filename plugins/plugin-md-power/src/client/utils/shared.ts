export function loadScript(src: string) {
  if (__VUEPRESS_SSR__)
    return Promise.resolve()

  if (document.querySelector(`script[src="${src}"]`))
    return Promise.resolve()

  const script = document.createElement('script')
  script.src = src
  document.body.appendChild(script)
  return new Promise((resolve, reject) => {
    script.onload = resolve
    script.onerror = reject
  })
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
