<script setup lang="ts">
import type { ReaderAidMode, ReaderWidthPreset, ResolvedReaderPalette } from '../../shared/index.js'
import { computed, nextTick } from 'vue'
import { ClientOnly } from 'vuepress/client'
import { useData, useReaderPreferences } from '../composables/index.js'

defineProps<{
  /** 使用导航栏浮层中的紧凑布局 */
  compact?: boolean
}>()

const { theme, isDark } = useData()
const { options, prefs, aid, aidModes, mobile, setPreference } = useReaderPreferences()

/**
 * 宽度选项，`standard` 始终存在，对应「不写属性」。
 */
const widthItems = computed(() => {
  if (!options.value?.width)
    return []

  const texts: Record<ReaderWidthPreset, () => string> = {
    narrow: () => theme.value.readerWidthNarrowText ?? 'Narrow',
    wide: () => theme.value.readerWidthWideText ?? 'Wide',
    full: () => theme.value.readerWidthFullText ?? 'Full',
  }

  return [
    { value: 'standard' as const, text: theme.value.readerWidthStandardText ?? 'Standard' },
    ...options.value.width.presets.map(preset => ({
      value: preset,
      text: texts[preset](),
    })),
  ]
})

/**
 * Label of a palette: user label first, then the built-in i18n text, then the name.
 *
 * 调色板的标签：用户标签优先，其次内置文案，最后退回名称。
 *
 * @param palette - Palette / 调色板
 * @param kind - Group kind / 分组类型
 */
function paletteLabel(palette: ResolvedReaderPalette, kind: 'theme' | 'brand'): string {
  if (palette.label)
    return palette.label

  if (palette.name === 'default') {
    return kind === 'theme'
      ? (theme.value.readerThemeDefaultText ?? 'Default')
      : (theme.value.readerBrandDefaultText ?? 'Default')
  }

  const builtin: Record<string, string | undefined> = {
    warm: theme.value.readerThemeWarmText,
    sepia: theme.value.readerThemeSepiaText,
  }

  return builtin[palette.name] ?? palette.name
}

/**
 * Background swatches, `default` is always present and maps to "no attribute".
 *
 * 背景色块，`default` 始终存在，对应「不写属性」。
 */
const themeItems = computed(() => (options.value?.theme?.presets ?? []).map(palette => ({
  name: palette.name,
  color: palette.color,
  label: paletteLabel(palette, 'theme'),
})))

/**
 * Brand swatches, `default` means "keep the theme brand".
 *
 * 品牌色块，`default` 表示沿用主题品牌色。
 */
const brandItems = computed(() => (options.value?.brand?.presets ?? []).map(palette => ({
  name: palette.name,
  color: palette.color,
  label: paletteLabel(palette, 'brand'),
})))

const showThemeGroup = computed(() => themeItems.value.length > 1)
const showBrandGroup = computed(() => brandItems.value.length > 1)

/**
 * Reading aid options, `off` is always present and maps to "no aid".
 *
 * 阅读辅助线选项，`off` 始终存在，对应「关闭」。
 */
const aidItems = computed(() => {
  if (!aidModes.value.length)
    return []

  return [
    { value: null, text: theme.value.readerAidOffText ?? 'Off' },
    ...aidModes.value.map((mode: ReaderAidMode) => ({
      value: mode,
      text: mode === 'mask'
        ? (theme.value.readerAidMaskText ?? 'Mask')
        : mode === 'left'
          ? (theme.value.readerAidLeftText ?? 'Left')
          : (theme.value.readerAidRightText ?? 'Right'),
    })),
  ]
})

const width = computed(() => prefs.value.width ?? 'standard')
const focusOn = computed(() => prefs.value.focus === true)

/**
 * 深色模式下, 禁用整个控件并回落到 `default`
 */
const backgroundDisabled = computed(() => isDark.value)
const background = computed(() => (isDark.value ? 'default' : prefs.value.theme ?? 'default'))
const brand = computed(() => prefs.value.brand ?? 'default')

function selectWidth(value: ReaderWidthPreset | 'standard'): void {
  setPreference('width', value === 'standard' ? undefined : value)
}

function selectBackground(name: string): void {
  if (isDark.value)
    return

  setPreference('theme', name === 'default' ? undefined : name)
}

function selectBrand(name: string): void {
  setPreference('brand', name === 'default' ? undefined : name)
}

function selectAid(value: ReaderAidMode | null): void {
  setPreference('aid', value ?? 'off')
}

function toggleFocus(): void {
  setPreference('focus', focusOn.value ? undefined : true)
}

function onRadioKeydown<T>(event: KeyboardEvent, values: T[], onSelect: (value: T) => void): void {
  const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']
  if (!keys.includes(event.key))
    return

  const group = (event.currentTarget as HTMLElement).closest('[role="radiogroup"]')
  const buttons = group
    ? Array.from(group.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)'))
    : []

  const current = buttons.indexOf(event.currentTarget as HTMLButtonElement)

  if (current < 0 || values.length !== buttons.length)
    return

  event.preventDefault()

  const last = buttons.length - 1
  const next = event.key === 'Home'
    ? 0
    : event.key === 'End'
      ? last
      : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
        ? (current - 1 + buttons.length) % buttons.length
        : (current + 1) % buttons.length

  onSelect(values[next])
  nextTick(() => buttons[next]?.focus())
}

const themeValues = computed(() => themeItems.value.map(item => item.name))
const brandValues = computed(() => brandItems.value.map(item => item.name))
const widthValues = computed(() => widthItems.value.map(item => item.value))
const aidValues = computed(() => aidItems.value.map(item => item.value))
</script>

<template>
  <ClientOnly>
    <div v-if="options" class="vp-reader-settings" :class="{ compact }">
      <div v-if="showThemeGroup">
        <p class="label">
          {{ theme.readerThemeText ?? 'Background' }}
        </p>
        <div
          class="swatches"
          role="radiogroup"
          :aria-label="theme.readerThemeText ?? 'Background'"
          :aria-disabled="backgroundDisabled || undefined"
        >
          <button
            v-for="item in themeItems"
            :key="item.name"
            type="button"
            class="swatch"
            role="radio"
            :aria-checked="background === item.name"
            :aria-label="item.label"
            :title="item.label"
            :class="{ active: background === item.name, empty: !item.color }"
            :style="item.color ? { backgroundColor: item.color } : undefined"
            :tabindex="backgroundDisabled ? -1 : (background === item.name ? 0 : -1)"
            :disabled="backgroundDisabled"
            @click="selectBackground(item.name)"
            @keydown="onRadioKeydown($event, themeValues, selectBackground)"
          />
        </div>
        <p v-if="isDark" class="hint">
          {{ theme.readerThemeDarkDisabledText ?? 'Not available in dark mode' }}
        </p>
      </div>

      <div v-if="showBrandGroup">
        <p class="label">
          {{ theme.readerBrandText ?? 'Brand color' }}
        </p>
        <div
          class="swatches"
          role="radiogroup"
          :aria-label="theme.readerBrandText ?? 'Brand color'"
        >
          <button
            v-for="item in brandItems"
            :key="item.name"
            type="button"
            class="swatch"
            role="radio"
            :aria-checked="brand === item.name"
            :aria-label="item.label"
            :title="item.label"
            :class="{ active: brand === item.name, empty: !item.color }"
            :style="item.color ? { backgroundColor: item.color } : undefined"
            :tabindex="brand === item.name ? 0 : -1"
            @click="selectBrand(item.name)"
            @keydown="onRadioKeydown($event, brandValues, selectBrand)"
          />
        </div>
      </div>

      <div v-if="!mobile && widthItems.length">
        <p class="label">
          {{ theme.readerWidthText ?? 'Content width' }}
        </p>
        <div class="options" role="radiogroup" :aria-label="theme.readerWidthText ?? 'Content width'">
          <button
            v-for="item in widthItems"
            :key="item.value"
            type="button"
            role="radio"
            :aria-checked="width === item.value"
            :class="{ active: width === item.value }"
            :tabindex="width === item.value ? 0 : -1"
            @click="selectWidth(item.value)"
            @keydown="onRadioKeydown($event, widthValues, selectWidth)"
          >
            {{ item.text }}
          </button>
        </div>
      </div>

      <div v-if="!mobile && aidItems.length">
        <p class="label">
          {{ theme.readerAidText ?? 'Reading aid' }}
        </p>
        <div class="options" role="radiogroup" :aria-label="theme.readerAidText ?? 'Reading aid'">
          <button
            v-for="item in aidItems"
            :key="item.value ?? 'off'"
            type="button"
            role="radio"
            :aria-checked="aid === item.value"
            :class="{ active: aid === item.value }"
            :tabindex="aid === item.value ? 0 : -1"
            @click="selectAid(item.value)"
            @keydown="onRadioKeydown($event, aidValues, selectAid)"
          >
            {{ item.text }}
          </button>
        </div>
      </div>

      <div v-if="!mobile && options.focusMode">
        <button
          type="button"
          class="row"
          role="switch"
          :aria-checked="focusOn"
          @click="toggleFocus"
        >
          <span class="label">{{ theme.readerFocusModeText ?? 'Focus mode' }}</span>
          <span class="switch" :class="{ on: focusOn }" aria-hidden="true"><span class="check" /></span>
        </button>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.vp-reader-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 240px;
  padding: 16px;
}

.vp-reader-settings.compact {
  gap: 12px;
  min-width: 0;
  padding: 0;
}

.label {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  color: var(--vp-c-text-2);
}

.compact .label {
  margin-bottom: 6px;
}

.options {
  display: flex;
  gap: 6px;
}

.options button {
  flex: 1;
  padding: 4px 10px;
  font-size: 12px;
  line-height: 20px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid transparent;
  border-radius: 6px;
  transition: color var(--vp-t-color), background-color var(--vp-t-color), border-color var(--vp-t-color);
}

.options button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.options button:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-divider);
}

.options button.active {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.swatch {
  position: relative;
  width: 20px;
  height: 20px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  transition:
    border-color var(--vp-t-color),
    box-shadow var(--vp-t-color),
    transform var(--vp-t-color);
}

.swatch:hover {
  border-color: var(--vp-c-text-3);
  transform: scale(1.06);
}

.swatch:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.swatch.active {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-1);
}

.swatch:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.swatch.empty {
  background-image:
    linear-gradient(
      135deg,
      transparent 44%,
      var(--vp-c-text-3) 44%,
      var(--vp-c-text-3) 56%,
      transparent 56%
    );
}

.hint {
  margin-top: 6px;
  font-size: 11px;
  line-height: 16px;
  color: var(--vp-c-text-3);
}

.row {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.row .label {
  margin-bottom: 0;
  font-size: 13px;
  color: var(--vp-c-text-1);
  text-align: left;
}

.switch {
  position: relative;
  display: block;
  flex-shrink: 0;
  width: 40px;
  height: 22px;
  background-color: var(--vp-input-switch-bg-color);
  border: 1px solid var(--vp-input-border-color);
  border-radius: 11px;
  transition: border-color var(--vp-t-color), background-color var(--vp-t-color);
}

.switch.on {
  background-color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.check {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 18px;
  height: 18px;
  background-color: var(--vp-c-neutral-inverse);
  border-radius: 50%;
  box-shadow: var(--vp-shadow-1);
  transition: transform var(--vp-t-color);
}

.switch.on .check {
  transform: translateX(18px);
}

.actions {
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.reset {
  font-size: 12px;
  line-height: 20px;
  color: var(--vp-c-text-3);
  transition: color var(--vp-t-color);
}

.reset:hover {
  color: var(--vp-c-brand-1);
}
</style>
