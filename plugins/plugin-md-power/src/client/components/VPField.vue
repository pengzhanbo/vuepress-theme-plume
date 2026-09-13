<script lang="ts" setup>
import { computed } from 'vue'
import { useRouteLocale } from 'vuepress/client'
import { FIELD_LOCALES } from '../options.js'

defineProps<{
  name: string
  slug: string
  type?: string
  typeLink?: string
  required?: boolean
  deprecated?: boolean | string
  experimental?: boolean | string
  defaultValue?: string
  since?: string
  unit?: string
  format?: string
  constraint?: string
}>()

const pathLocale = useRouteLocale()

const locale = computed(() => FIELD_LOCALES[pathLocale.value] || {})
</script>

<template>
  <div
    :id="slug" class="vp-field"
    :class="{ required, deprecated, optional: !required && !deprecated, experimental }"
  >
    <div class="field-meta">
      <div class="meta-left">
        <p>
          <a :href="`#${slug}`" class="header-anchor ignore-header">
            <span class="visually-hidden">Name:</span>
            <span class="name">{{ name }}</span>
          </a>
        </p>
        <p>
          <span v-if="required" class="required">{{ locale.required }}</span>
          <span v-else-if="deprecated" class="deprecated">
            {{ locale.deprecated }}<template v-if="deprecated && typeof deprecated === 'string'">: {{ deprecated }}</template>
          </span>
          <span v-else class="optional">{{ locale.optional }}</span>
          <span v-if="experimental" class="experimental">
            {{ locale.experimental }}<template v-if="experimental && typeof experimental === 'string'">: {{ experimental }}</template>
          </span>
        </p>
      </div>
      <div v-if="type" class="meta-right type">
        <span class="visually-hidden">Type:</span>
        <VPLink v-if="typeLink" :href="typeLink">
          <code title="Type" aria-label="Type">{{ decodeURIComponent(type) }}</code>
        </VPLink>
        <code v-else title="Type" aria-label="Type">{{ decodeURIComponent(type) }}</code>
      </div>
    </div>

    <div class="field-meta baseline">
      <div class="meta-left">
        <p v-if="defaultValue" class="default-value">
          <span class="key">{{ locale.default }}:</span>
          <code>{{ decodeURIComponent(defaultValue) }}</code>
        </p>
        <p v-if="$slots.enum" class="enum">
          <span class="key">{{ locale.enum }}:</span>
          <slot name="enum" />
        </p>
        <p v-if="unit" class="unit">
          <span class="key">{{ locale.unit }}:</span>
          <code>{{ decodeURIComponent(unit) }}</code>
        </p>
        <p v-if="format" class="format">
          <span class="key">{{ locale.format }}:</span>
          <code>{{ decodeURIComponent(format) }}</code>
        </p>
        <p v-if="constraint" class="constraint">
          <span class="key">{{ locale.constraint }}:</span>
          <code>{{ decodeURIComponent(constraint) }}</code>
        </p>
      </div>
      <div v-if="since" class="meta-right since">
        <span class="key">{{ locale.since }}:</span>
        <code>{{ decodeURIComponent(since) }}</code>
      </div>
    </div>
    <div v-if="$slots.default" class="description">
      <slot />
    </div>
  </div>
</template>

<style>
.vp-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin: 16px 0;
  transition: border-color var(--vp-t-color);
}

.vp-field + .vp-field {
  padding-top: 8px;
  border-top: solid 1px var(--vp-c-divider);
}

.vp-field .field-meta,
.vp-field .field-meta :where(.meta-left,.meta-right) {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

@media (max-width: 768px) {
  .vp-field .field-meta.baseline {
    flex-direction: column;
  }
}

.vp-field .field-meta :where(.meta-left,.meta-right) > p {
  margin: 0;
}

.vp-field .field-meta.baseline {
  gap: 8px 12px;
  align-items: baseline;
}

.vp-field .field-meta .meta-left {
  flex: 1 2;
  gap: 8px 12px;
}

.vp-field .field-meta .name {
  font-size: 18px;
  font-weight: 500;
}

.vp-field.deprecated .field-meta .name {
  text-decoration: line-through;
}

.vp-field .field-meta :where(.required,.optional,.deprecated,.experimental) {
  display: inline-block;
  padding: 2px 8px;
  font-size: 12px;
  font-style: italic;
  line-height: 1;
  border-radius: 8px;
  transform: translateY(-6px);
}

.vp-field .field-meta .required {
  color: var(--vp-c-success-2);
  border: solid 1px var(--vp-c-success-2);
}

.vp-field .field-meta .optional {
  color: var(--vp-c-text-3);
  border: solid 1px var(--vp-c-divider);
}

.vp-field .field-meta .deprecated {
  color: var(--vp-c-danger-2);
  border: solid 1px var(--vp-c-danger-2);
}

.vp-field .field-meta .experimental {
  color: var(--vp-c-warning-2);
  border: solid 1px var(--vp-c-warning-2);
}

.vp-field.deprecated .field-meta .name {
  color: var(--vp-c-text-2);
}

.vp-field .field-meta .meta-left .header-anchor::before {
  top: 6px;
}

.vp-field .field-meta .meta-left > p,
.vp-field .field-meta .meta-right:not(.type) {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
}

.vp-field .field-meta .meta-right.type a::after {
  display: none;
}

.vp-field .field-meta :where(.since,.unit,.format,.constraint) code {
  padding: 0 6px;
  color: var(--vp-c-text-3);
}

.vp-field .field-meta .enum span:not(:first-child) {
  display: inline-block;
  padding: 0 6px;
  font-size: 12px;
  font-style: italic;
  line-height: 1.7;
  color: var(--vp-c-text-3);
  background-color: var(--vp-code-bg);
  border: solid 1px var(--vp-c-divider);
  border-radius: 4px;
}

.vp-field .field-meta .key {
  font-weight: 500;
  color: var(--vp-c-text-3);
}

.vp-field .description :where(p, ul, ol) {
  margin: 8px 0;
  line-height: 24px;
}

.vp-field .description :first-child {
  margin-top: 0;
}

.vp-field .description :last-child {
  margin-bottom: 0;
}

.vp-field.deprecated .description :where(p) {
  color: var(--vp-c-text-2);
}

.vp-field-group {
  padding: 0 20px;
  margin: 16px 0;
  border: solid 1px var(--vp-c-divider);
  border-radius: 6px;
}
</style>
