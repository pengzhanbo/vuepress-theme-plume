<script setup lang="ts">
defineProps<{
  content: string
  lang: string
}>()
</script>

<template>
  <div :class="`code-viewer language-${lang}`" :data-ext="lang">
    <button class="copy-code-button" :data-lang="lang" />
    <pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code>{{ content }}</code></pre>
  </div>
</template>

<style>
.code-viewer .copy-code-button {
  display: none;
}

@media (min-width: 768px) {
  .code-viewer .copy-code-button {
    display: block;
  }
}
</style>
