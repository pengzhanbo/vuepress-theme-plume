<script lang="ts" setup>
import { computed } from 'vue'
import { resolveRoutePath, useRouter, withBase } from 'vuepress/client'
import { EXTERNAL_URL_RE } from '../utils/index.js'

const props = defineProps<{
  tag?: string
  href?: string
  noIcon?: boolean
  target?: string
  rel?: string
}>()

const router = useRouter()

const tag = computed(() => props.tag ?? (props.href ? 'a' : 'span'))
const isExternal = computed(
  () => props.href && EXTERNAL_URL_RE.test(props.href),
)
const link = computed(() => {
  if (!props.href)
    return undefined
  if (isExternal.value)
    return props.href
  return withBase(resolveRoutePath(props.href))
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
    :is="tag" class="auto-link" :class="{ link }" :href="link"
    :target="target ?? (isExternal ? '_blank' : undefined)" :rel="rel ?? (isExternal ? 'noreferrer' : undefined)"
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

.auto-link :deep(i) {
  font-style: normal;
  font-weight: inherit;
  line-height: normal;
}
</style>
