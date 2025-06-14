<script lang="ts" setup>
import { computed, toRef } from 'vue'
import { useRouter, withBase } from 'vuepress/client'
import { useLink } from '../composables/index.js'

const props = defineProps<{
  tag?: string
  href?: string
  text?: string
  noIcon?: boolean
  target?: string
  rel?: string
}>()

const router = useRouter()

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
    :is="tag" class="vp-link" :class="{ link, 'no-icon': noIcon }"
    :href="link ? isExternalProtocol ? link : withBase(link) : undefined"
    :target="target ?? (isExternal ? '_blank' : undefined)"
    :rel="rel ?? (isExternal ? 'noreferrer' : undefined)"
    @click="linkTo($event)"
  >
    <slot>
      {{ text || href }}
    </slot>
    <span v-if="isExternal && !noIcon" class="vpi-external-link" />
  </Component>
</template>

<style>
.vp-link .vpi-external-link {
  width: 11px;
  height: 11px;
  margin-top: -1px;
  margin-left: 4px;
}
</style>
