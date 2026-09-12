<script lang="ts" setup>
defineProps<{
  name: string
  slug: string
  type?: string
  required?: boolean
  deprecated?: boolean
  defaultValue?: string
}>()
</script>

<template>
  <div
    :id="slug" class="vp-field"
    :class="{ required, deprecated, optional: !required && !deprecated }"
  >
    <p class="field-meta">
      <a :href="`#${slug}`" class="header-anchor ignore-header">
        <span class="visually-hidden">Name:</span>
        <span class="name">{{ name }}</span>
      </a>
      <span v-if="required" class="required">Required</span>
      <span v-else-if="deprecated" class="deprecated">Deprecated</span>
      <span v-else class="optional">Optional</span>
      <span v-if="type" class="type">
        <span class="visually-hidden">Type:</span>
        <code title="Type" aria-label="Type">{{ decodeURIComponent(type) }}</code>
      </span>
    </p>
    <p v-if="defaultValue" class="default-value">
      <span class="visually-hidden">Default Value: </span>
      <code title="Default Value" aria-label="Default Value">{{ decodeURIComponent(defaultValue) }}</code>
    </p>
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

.vp-field .field-meta {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin: 0;
}

.vp-field .field-meta .name {
  font-size: 18px;
  font-weight: 500;
}

.vp-field.deprecated .field-meta .name {
  text-decoration: line-through;
}

.vp-field .field-meta :where(.required, .optional, .deprecated) {
  display: inline-block;
  padding: 2px 8px;
  font-size: 12px;
  font-style: italic;
  line-height: 1;
  border-radius: 8px;
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

.vp-field .field-meta .type {
  flex: 1 2;
  text-align: right;
}

.vp-field.deprecated .field-meta .name {
  color: var(--vp-c-text-2);
}

.vp-field .default-value {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  transform: translateY(-4px);
}

.vp-field .description :where(p, ul, ol) {
  margin: 8px 0;
  line-height: 24px;
}

.vp-field .description :first-child {
  margin-top: 0;
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
