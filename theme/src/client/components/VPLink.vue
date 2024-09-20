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

const { link, isExternal } = useLink(toRef(props, 'href'), toRef(props, 'target'))

function linkTo(e: Event) {
  if (!isExternal.value) {
    e.preventDefault()
    if (link.value)
      router.push(link.value)
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
    <slot>
      {{ text || href }}
    </slot>
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
