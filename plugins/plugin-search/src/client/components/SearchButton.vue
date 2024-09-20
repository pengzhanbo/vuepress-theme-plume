<script lang="ts" setup>
import type { SearchBoxLocales } from '../../shared/index.js'
import { toRef } from 'vue'
import { useLocale } from '../composables/index.js'

const props = defineProps<{
  locales: SearchBoxLocales
}>()

const locale = useLocale(toRef(props.locales))
</script>

<template>
  <button type="button" class="mini-search mini-search-button" :aria-label="locale.placeholder">
    <span class="mini-search-button-container">
      <svg class="mini-search-search-icon" width="20" height="20" viewBox="0 0 20 20" aria-label="search icon">
        <path
          d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
          stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"
        />
      </svg>
      <span class="mini-search-button-placeholder">{{ locale.placeholder }}</span>
    </span>
    <span class="mini-search-button-keys">
      <kbd class="mini-search-button-key" />
      <kbd class="mini-search-button-key">K</kbd>
    </span>
  </button>
</template>

<style>
.mini-search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 55px;
  padding: 0;
  margin: 0;
  background: transparent;
  transition: border-color 0.25s, background-color 0.25s;
}

.mini-search-button:hover {
  background: transparent;
}

.mini-search-button:focus {
  outline: 1px dotted;
  outline: 5px auto -webkit-focus-ring-color;
}

.mini-search-button:focus:not(:focus-visible) {
  outline: none !important;
}

@media (min-width: 768px) {
  .mini-search-button {
    justify-content: flex-start;
    width: 100%;
    height: 40px;
    padding: 0 10px 0 12px;
    background-color: var(--vp-c-bg-alt);
    border: 1px solid transparent;
    border-radius: 8px;
  }

  .mini-search-button:hover {
    background: var(--vp-c-bg-alt);
    border-color: var(--vp-c-brand-1);
  }
}

.mini-search-button .mini-search-button-container {
  display: flex;
  align-items: center;
}

.mini-search-button .mini-search-search-icon {
  position: relative;
  width: 16px;
  height: 16px;
  color: var(--vp-c-text-1);
  fill: currentcolor;
  transition: color 0.3s;
}

.mini-search-button:hover .mini-search-search-icon {
  color: var(--vp-c-text-1);
}

@media (min-width: 768px) {
  .mini-search-button .mini-search-search-icon {
    top: 1px;
    width: 14px;
    height: 14px;
    margin-right: 8px;
    color: var(--vp-c-text-2);
  }
}

.mini-search-button .mini-search-button-placeholder {
  display: none;
  padding: 0 16px 0 0;
  margin-top: 2px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: color 0.3s;
}

.mini-search-button:hover .mini-search-button-placeholder {
  color: var(--vp-c-text-1);
}

@media (min-width: 768px) {
  .mini-search-button .mini-search-button-placeholder {
    display: inline-block;
  }
}

.mini-search-button .mini-search-button-keys {
  display: none;
  min-width: auto;

  /* rtl:ignore */
  direction: ltr;
}

@media (min-width: 768px) {
  .mini-search-button .mini-search-button-keys {
    display: flex;
    align-items: center;
  }
}

.mini-search-button .mini-search-button-key {
  display: block;
  width: auto;

  /* rtl:end:ignore */
  min-width: 0;
  height: 22px;
  padding-left: 6px;
  margin: 2px 0 0;
  font-family: var(--vp-font-family-base);
  font-size: 12px;
  font-weight: 500;
  line-height: 22px;
  border: 1px solid var(--vp-c-divider);

  /* rtl:begin:ignore */
  border-right: none;
  border-radius: 4px 0 0 4px;
  transition: color 0.3s, border-color 0.3s;
}

.mini-search-button .mini-search-button-key + .mini-search-button-key {
  padding-right: 6px;
  padding-left: 2px;

  /* rtl:begin:ignore */
  border-right: 1px solid var(--vp-c-divider);
  border-left: none;
  border-radius: 0 4px 4px 0;

  /* rtl:end:ignore */
}

.mini-search-button .mini-search-button-key:first-child {
  font-size: 0 !important;
}

.mini-search-button .mini-search-button-key:first-child::after {
  font-size: 12px;
  color: var(--mini-search-muted-color);
  letter-spacing: normal;
  content: "Ctrl";
}

.mac .mini-search-button .mini-search-button-key:first-child::after {
  content: "\2318";
}

.mini-search-button .mini-search-button-key:first-child > * {
  display: none;
}
</style>
