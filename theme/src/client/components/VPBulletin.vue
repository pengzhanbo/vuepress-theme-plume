<script setup lang="ts">
import { hasGlobalComponent } from '@vuepress/helper/client'
import { resolveComponent } from 'vue'
import { useBulletinControl } from '../composables/index.js'
import '@vuepress/helper/transition/fade-in-scale-up.css'

const UserBulletin = hasGlobalComponent('Bulletin') ? resolveComponent('Bulletin') : null
const UserBulletinContent = hasGlobalComponent('BulletinContent') ? resolveComponent('BulletinContent') : null

const { bulletin, showBulletin, enableBulletin, close } = useBulletinControl()
</script>

<template>
  <Transition name="fade-in-scale-up">
    <component :is="UserBulletin" v-if="UserBulletin && enableBulletin && showBulletin" class="vp-bulletin" />
    <div
      v-else-if="bulletin && enableBulletin && showBulletin"
      class="vp-bulletin preset" :class="{
        border: bulletin.border ?? true,
        [bulletin.layout ?? 'top-right']: true,
      }"
    >
      <button type="button" class="close" @click="close">
        <span class="vpi-close" />
      </button>
      <slot name="bulletin-content">
        <h2 v-if="bulletin.title" v-html="bulletin.title" />
        <div class="container">
          <component :is="UserBulletinContent" v-if="UserBulletinContent" class="content vp-doc" />
          <div v-else-if="bulletin.content" class="content vp-doc" v-html="bulletin.content" />
        </div>
      </slot>
    </div>
  </Transition>
</template>

<style>
.vp-bulletin {
  z-index: var(--vp-z-index-bulletin);
}

.vp-bulletin:where(.preset) {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: var(--vp-bulletin-width);
  max-width: calc(100% - 48px);
  max-height: calc(100vh - var(--vp-nav-height) - 48px);
  font-size: var(--vp-bulletin-font-size);
  color: var(--vp-bulletin-text-color);
  background-color: var(--vp-bulletin-bg-color);
  border-radius: 8px;
  box-shadow: var(--vp-shadow-4);
  transition: var(--vp-t-color);
  transition-property: background-color, box-shadow, color;
}

.vp-bulletin:where(.preset).top-left {
  top: calc(var(--vp-nav-height) + 24px);
  left: 24px;
}

.vp-bulletin:where(.preset).bottom-left {
  bottom: 24px;
  left: 24px;
}

.vp-bulletin:where(.preset).bottom-right {
  right: 24px;
  bottom: 24px;
}

.vp-bulletin:where(.preset).center {
  top: calc(var(--vp-nav-height) + 24px);
  left: 50%;
  transform: translate(-50%, 0);
}

.vp-bulletin:where(.preset):not(.top-left, .bottom-left, .bottom-right, .center) {
  top: calc(var(--vp-nav-height) + 24px);
  right: 24px;
}

.vp-bulletin:where(.preset).border::before {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  padding: var(--vp-bulletin-border-width);
  pointer-events: none;
  content: "";
  background: var(--vp-bulletin-border);
  border-radius: 8px;
  mask:
    linear-gradient(var(--vp-c-bg) 0 100%) content-box,
    linear-gradient(var(--vp-c-bg) 0 100%);
  -webkit-mask-composite: xor;
  mask-composite: subtract;
}

.vp-bulletin:where(.preset) .close {
  position: absolute;
  top: 6px;
  right: 10px;
  z-index: 1;
  font-size: 16px;
  line-height: 1;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}

.vp-bulletin:where(.preset) .container {
  padding: 16px;
  overflow-y: auto;
  overscroll-behavior-y: contain;

  scrollbar-width: thin;
}

.vp-bulletin:where(.preset).border .container {
  padding: calc(16px + var(--vp-bulletin-border-width)) 16px calc(16px + var(--vp-bulletin-border-width)) calc(16px + var(--vp-bulletin-border-width));
  margin-right: var(--vp-bulletin-border-width);
}

.vp-bulletin:where(.preset) h2 {
  padding: 16px 16px 0;
  font-size: var(--vp-bulletin-title-font-size);
  font-weight: bold;
  color: var(--vp-bulletin-title-color);
  text-align: center;
  transition: color var(--vp-t-color);
}

.vp-bulletin:where(.preset) .content :first-child {
  margin-top: 0 !important;
}

.vp-bulletin:where(.preset) .content :last-child {
  margin-bottom: 0 !important;
}

.vp-bulletin:where(.preset) .content :where(p,ul,ol) {
  margin: 8px 0;
}

.vp-bulletin:where(.preset) .content :where(p) {
  line-height: var(--vp-bulletin-line-height);
}
</style>
