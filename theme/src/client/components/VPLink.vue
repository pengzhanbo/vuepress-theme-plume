<script lang="ts" setup>
import { computed } from 'vue'
import { resolveRouteFullPath, useRoute, useRouter, withBase } from 'vuepress/client'
import { isLinkExternal } from '@vuepress/helper/client'

const props = defineProps<{
  tag?: string
  href?: string
  noIcon?: boolean
  target?: string
  rel?: string
}>()

const router = useRouter()
const route = useRoute()

const tag = computed(() => props.tag ?? (props.href ? 'a' : 'span'))
const isExternal = computed(
  () => (props.href && isLinkExternal(props.href)) || props.target === '_blank',
)
const link = computed(() => {
  if (!props.href)
    return undefined
  if (isExternal.value)
    return props.href
  return resolveRouteFullPath(props.href, route.path)
})

function linkTo(e: Event) {
  if (!isExternal.value) {
    e.preventDefault()
    if (link.value)
      router.push({ path: link.value })
  }
}
</script>

<template>
  <Component
    :is="tag" class="vp-link" :class="{ link }"
    :href="withBase(link || '')"
    :target="target ?? (isExternal ? '_blank' : undefined)"
    :rel="rel ?? (isExternal ? 'noreferrer' : undefined)"
    @click="linkTo($event)"
  >
    <slot />
    <span v-if="isExternal && !noIcon" class="vpi-external-link icon" />
  </Component>
</template>

<style scoped>
.icon {
  display: inline-block;
  width: 11px;
  height: 11px;
  margin-top: -1px;
  margin-left: 4px;
  fill: var(--vp-c-text-3);
  transition: fill 0.25s;
}

.vp-link :deep(i) {
  font-style: normal;
  font-weight: inherit;
  line-height: normal;
}
</style>
