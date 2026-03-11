<script lang="ts" setup>
import { computed, toRef } from 'vue'
import { useRouter, withBase } from 'vuepress/client'
import { useData, useLink } from '../composables/index.js'

const props = defineProps<{
  tag?: string
  href?: string
  text?: string
  noIcon?: boolean
  target?: string
  rel?: string
}>()

const router = useRouter()
const { theme } = useData()

const tag = computed(() => props.tag ?? (props.href ? 'a' : 'span'))

const { link, isExternal, isExternalProtocol } = useLink(toRef(props, 'href'), toRef(props, 'target'))

function linkTo(e: Event) {
  if (!isExternal.value && link.value) {
    e.preventDefault()
    router.push(link.value)
  }
}
</script>

<template>
  <Component
    :is="tag"
    class="vp-link" :class="{ link, 'no-icon': noIcon, 'vp-external-link-icon': isExternal }"
    :href="link ? isExternalProtocol ? link : isExternal ? link : withBase(link) : undefined"
    :target="target ?? (isExternal ? '_blank' : undefined)"
    :rel="rel ?? (isExternal ? 'noopener noreferrer' : undefined)"
    @click="linkTo($event)"
  >
    <slot>
      {{ text || href }}
    </slot>
    <span v-if="isExternal && !noIcon" class="visually-hidden">
      {{ theme.openNewWindowText || '(Open in new window)' }}
    </span>
  </Component>
</template>

<style>
.vp-link:focus-visible {
  border-radius: 2px;
}
</style>
