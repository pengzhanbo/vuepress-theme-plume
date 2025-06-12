<script setup lang="ts">
import VPIcon from '@theme/VPIcon.vue'
import { computed, toRef } from 'vue'
import { useRouter, withBase } from 'vuepress/client'
import { useLink } from '../composables/index.js'

interface Props {
  tag?: string
  size?: 'medium' | 'big'
  theme?: 'brand' | 'alt' | 'sponsor'
  text?: string
  href?: string
  target?: string
  rel?: string
  icon?: string
  suffixIcon?: string
}
const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  theme: 'brand',
  text: '',
})
const router = useRouter()

const component = computed(() => {
  return props.tag || props.href ? 'a' : 'button'
})

const { link, isExternal, isExternalProtocol } = useLink(toRef(props, 'href'), toRef(props, 'target'))

function linkTo(e: Event) {
  if (!isExternal.value && link.value?.[0] !== '#') {
    e.preventDefault()
    if (link.value)
      router.push(link.value)
  }
}
</script>

<template>
  <Component
    :is="component"
    class="vp-button"
    :class="[size, theme]"
    :href=" link ? link[0] === '#' || isExternalProtocol ? link : withBase(link) : undefined"
    :target="target ?? (isExternal ? '_blank' : undefined)"
    :rel="rel ?? (isExternal ? 'noreferrer' : undefined)"
    @click="linkTo($event)"
  >
    <span class="button-content">
      <VPIcon v-if="icon" :name="icon" />
      <slot><span>{{ text }}</span></slot>
      <VPIcon v-if="suffixIcon" :name="suffixIcon" />
    </span>
  </Component>
</template>

<style scoped>
.vp-button {
  display: inline-block;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  border: 1px solid transparent;
  transition: var(--vp-t-color);
  transition-property: border, color, background-color;
}

.vp-button:active {
  transition:
    color 0.1s,
    border-color 0.1s,
    background-color 0.1s;
}

.vp-button.medium {
  padding: 0 20px;
  font-size: 14px;
  line-height: 38px;
  border-radius: 20px;
}

.vp-button.big {
  padding: 0 24px;
  font-size: 16px;
  line-height: 46px;
  border-radius: 24px;
}

.vp-button.brand {
  color: var(--vp-button-brand-text);
  background-color: var(--vp-button-brand-bg);
  border-color: var(--vp-button-brand-border);
}

.vp-button.brand:hover {
  color: var(--vp-button-brand-hover-text);
  background-color: var(--vp-button-brand-hover-bg);
  border-color: var(--vp-button-brand-hover-border);
}

.vp-button.brand:active {
  color: var(--vp-button-brand-active-text);
  background-color: var(--vp-button-brand-active-bg);
  border-color: var(--vp-button-brand-active-border);
}

.vp-button.alt {
  color: var(--vp-button-alt-text);
  background-color: var(--vp-button-alt-bg);
  border-color: var(--vp-button-alt-border);
}

.vp-button.alt:hover {
  color: var(--vp-button-alt-hover-text);
  background-color: var(--vp-button-alt-hover-bg);
  border-color: var(--vp-button-alt-hover-border);
}

.vp-button.alt:active {
  color: var(--vp-button-alt-active-text);
  background-color: var(--vp-button-alt-active-bg);
  border-color: var(--vp-button-alt-active-border);
}

.vp-button.sponsor {
  color: var(--vp-button-sponsor-text);
  background-color: var(--vp-button-sponsor-bg);
  border-color: var(--vp-button-sponsor-border);
}

.vp-button.sponsor:hover {
  color: var(--vp-button-sponsor-hover-text);
  background-color: var(--vp-button-sponsor-hover-bg);
  border-color: var(--vp-button-sponsor-hover-border);
}

.vp-button.sponsor:active {
  color: var(--vp-button-sponsor-active-text);
  background-color: var(--vp-button-sponsor-active-bg);
  border-color: var(--vp-button-sponsor-active-border);
}

.vp-button .button-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vp-button .button-content :deep(.vp-icon) {
  width: 1.2em;
  height: 1.2em;
}

.vp-button + .vp-button {
  margin-left: 1em;
}
</style>
