<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { EXTERNAL_URL_RE } from '../utils/index.js'

interface Props {
  tag?: string
  size?: 'medium' | 'big'
  theme?: 'brand' | 'alt' | 'sponsor'
  text: string
  href?: string
}
const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  theme: 'brand',
  tag: undefined,
  href: undefined,
})

const router = useRouter()

const isExternal = computed(
  () => props.href && EXTERNAL_URL_RE.test(props.href),
)

const component = computed(() => {
  return props.tag || props.href ? 'a' : 'button'
})

function linkTo(e: Event) {
  if (!isExternal.value) {
    e.preventDefault()
    props.href && router.push({ path: props.href })
  }
}
</script>

<template>
  <Component
    :is="component"
    class="VPButton"
    :class="[size, theme]"
    :href="href"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noreferrer' : undefined"
    @click="linkTo($event)"
  >
    {{ text }}
  </Component>
</template>

<style scoped>
.VPButton {
  display: inline-block;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  border: 1px solid transparent;
  transition: var(--t-color);
  transition-property: border, color, background-color;
}

.VPButton:active {
  transition:
    color 0.1s,
    border-color 0.1s,
    background-color 0.1s;
}

.VPButton.medium {
  padding: 0 20px;
  font-size: 14px;
  line-height: 38px;
  border-radius: 20px;
}

.VPButton.big {
  padding: 0 24px;
  font-size: 16px;
  line-height: 46px;
  border-radius: 24px;
}

.VPButton.brand {
  color: var(--vp-button-brand-text);
  background-color: var(--vp-button-brand-bg);
  border-color: var(--vp-button-brand-border);
}

.VPButton.brand:hover {
  color: var(--vp-button-brand-hover-text);
  background-color: var(--vp-button-brand-hover-bg);
  border-color: var(--vp-button-brand-hover-border);
}

.VPButton.brand:active {
  color: var(--vp-button-brand-active-text);
  background-color: var(--vp-button-brand-active-bg);
  border-color: var(--vp-button-brand-active-border);
}

.VPButton.alt {
  color: var(--vp-button-alt-text);
  background-color: var(--vp-button-alt-bg);
  border-color: var(--vp-button-alt-border);
}

.VPButton.alt:hover {
  color: var(--vp-button-alt-hover-text);
  background-color: var(--vp-button-alt-hover-bg);
  border-color: var(--vp-button-alt-hover-border);
}

.VPButton.alt:active {
  color: var(--vp-button-alt-active-text);
  background-color: var(--vp-button-alt-active-bg);
  border-color: var(--vp-button-alt-active-border);
}

.VPButton.sponsor {
  color: var(--vp-button-sponsor-text);
  background-color: var(--vp-button-sponsor-bg);
  border-color: var(--vp-button-sponsor-border);
}

.VPButton.sponsor:hover {
  color: var(--vp-button-sponsor-hover-text);
  background-color: var(--vp-button-sponsor-hover-bg);
  border-color: var(--vp-button-sponsor-hover-border);
}

.VPButton.sponsor:active {
  color: var(--vp-button-sponsor-active-text);
  background-color: var(--vp-button-sponsor-active-bg);
  border-color: var(--vp-button-sponsor-active-border);
}
</style>
