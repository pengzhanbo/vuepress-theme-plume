import { usePageData } from '@vuepress/client'
import type { PageHeader } from '@vuepress/client'
import type { PropType, VNode } from 'vue'
import { computed, defineComponent, h, toRefs } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useRoute } from 'vue-router'
import { scrollTo } from '../utils/index.js'

export type TocPropsHeaders = PageHeader[]

export interface TocPropsOptions {
  containerTag: string
  containerClass: string
  listClass: string
  itemClass: string
  linkClass: string
  linkActiveClass: string
  linkChildrenActiveClass: string
}

export interface TocProps {
  headers: TocPropsHeaders
  options: TocPropsOptions
}

function renderLink(header: PageHeader, options: TocPropsOptions, route: RouteLocationNormalizedLoaded): VNode {
  const hash = `#${header.slug}`
  const linkClass = [options.linkClass]

  if (options.linkActiveClass && route.hash === hash)
    linkClass.push(options.linkActiveClass)

  if (
    options.linkChildrenActiveClass
    && header.children.some(item => `#${item.slug}` === route.hash)
  )
    linkClass.push(options.linkChildrenActiveClass)

  const setActiveRouteHash = (): void => {
    const headerAnchors: HTMLAnchorElement[] = Array.from(
      document.querySelectorAll('.header-anchor'),
    )
    const anchor = headerAnchors.find(
      anchor => decodeURI(anchor.hash) === hash,
    )
    if (!anchor)
      return
    const el = document.documentElement
    const top = anchor.getBoundingClientRect().top - 80 + el.scrollTop
    scrollTo(document, top)
  }

  return h(
    'a',
    {
      href: hash,
      class: linkClass,
      ariaLabel: header.title,
      onClick: (e: MouseEvent) => {
        e.preventDefault()
        setActiveRouteHash()
      },
    },
    header.title,
  )
}

function renderHeaders(headers: PageHeader[], options: TocPropsOptions, route: RouteLocationNormalizedLoaded): VNode[] {
  if (headers.length === 0)
    return []

  return [
    h(
      'ul',
      { class: options.listClass },
      headers.map(header =>
        h('li', { class: options.itemClass }, [
          renderLink(header, options, route),
          renderHeaders(header.children, options, route),
        ]),
      ),
    ),
  ]
}

const Toc = defineComponent({
  name: 'Toc',
  props: {
    headers: {
      type: Array as PropType<TocPropsHeaders>,
      required: false,
      default: null,
    },
    options: {
      type: Object as PropType<TocPropsOptions>,
      required: false,
      default: () => ({}),
    },
  },
  setup(props) {
    const { headers: propsHeaders, options: propsOptions } = toRefs(props)

    const defaultOptions: TocPropsOptions = {
      containerTag: 'nav',
      containerClass: 'theme-plume-toc',
      listClass: 'theme-plume-toc-list',
      itemClass: 'theme-plume-toc-item',
      linkClass: 'theme-plume-toc-link',
      linkActiveClass: 'active',
      linkChildrenActiveClass: 'active',
    }

    const route = useRoute()
    const page = usePageData()
    const headers = computed<TocPropsHeaders>(() => {
      const headerToUse = propsHeaders.value || page.value.headers

      return headerToUse[0]?.level === 1 ? headerToUse[0].children : headerToUse
    })
    const options = computed<TocPropsOptions>(() => ({
      ...defaultOptions,
      ...propsOptions.value,
    }))

    return () => {
      const renderedHeaders = renderHeaders(headers.value, options.value, route)
      if (options.value.containerTag) {
        return h(
          options.value.containerTag,
          { class: options.value.containerClass },
          renderedHeaders,
        )
      }
      return renderedHeaders
    }
  },
})

export default Toc
