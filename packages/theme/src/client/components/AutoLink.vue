<script lang="ts">
/* eslint-disable import/first, import/no-duplicates, import/order */
import { defineComponent } from 'vue'

export default defineComponent({
  inheritAttrs: false,
})
</script>

<script lang="ts" setup>
import { computed, toRefs } from 'vue'
import type { PropType } from 'vue'
import { useRoute } from 'vue-router'
import { useSiteData } from '@vuepress/client'
import type { NavLink } from '../../shared'
import { isLinkHttp, isLinkMailto, isLinkTel } from '@vuepress/shared'

const props = defineProps({
  item: {
    type: Object as PropType<NavLink>,
    require: true,
    default: () => ({ text: '' }),
  },
})

const route = useRoute()
const site = useSiteData()
const { item } = toRefs(props)

const hasHttpProtocol = computed(() => isLinkHttp(item.value.link))
const hasNonHttpProtocol = computed(
  () => isLinkMailto(item.value.link) || isLinkTel(item.value.link)
)

const linkTarget = computed(() => {
  if (hasNonHttpProtocol.value) return undefined
  if (item.value.target) return item.value.target
  if (hasHttpProtocol.value) return '_blank'
  return undefined
})

const isBlankTarget = computed(() => linkTarget.value === '_blank')
const isRouterLink = computed(
  () =>
    !hasHttpProtocol.value && !hasNonHttpProtocol.value && !isBlankTarget.value
)

const linkRel = computed(() => {
  if (hasNonHttpProtocol.value) return undefined
  if (item.value.rel) return item.value.rel
  if (isBlankTarget.value) return 'noopener noreferrer'
  return undefined
})

const linkAriaLabel = computed(() => item.value.ariaLabel || item.value.text)

const shouldBeActiveInSubpath = computed(() => {
  const localeKeys = Object.keys(site.value.locales)
  if (localeKeys.length) {
    return !localeKeys.some((key) => key === item.value.link)
  }
  return item.value.link !== '/'
})

const isActiveInSubpath = computed(() => {
  if (!shouldBeActiveInSubpath.value) return false
  return route.path.startsWith(item.value.link)
})

const isActive = computed(() => {
  if (isRouterLink.value) return false
  if (item.value.activeMatch) {
    return new RegExp(item.value.activeMatch).test(route.path)
  }
  return isActiveInSubpath.value
})
</script>

<template>
  <RouterLink
    v-if="isRouterLink"
    :class="{ 'router-link-active': isActive }"
    :to="item.link"
    :aria-label="linkAriaLabel"
    v-bind="$attrs"
  >
    <slot name="before" />
    {{ item.text }}
    <slot name="after" />
  </RouterLink>
  <a
    v-else
    class="external-link"
    :href="item.link"
    :rel="linkRel"
    :target="linkTarget"
    :aria-label="linkAriaLabel"
    v-bind="$attrs"
  >
    <slot name="before" />
    {{ item.text }}
    <ExternalLinkIcon v-if="isBlankTarget" />
    <slot name="after" />
  </a>
</template>
