<script setup lang="ts">
defineProps<{
  content: string
  lang: string
}>()
</script>

<template>
  <div :class="`language-${lang}`" :data-ext="lang">
    <button class="copy-code-button" :data-lang="lang" />
    <pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code>{{ content }}</code></pre>
  </div>
</template>
