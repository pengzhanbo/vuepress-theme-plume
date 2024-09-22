<script setup lang="ts">
defineProps<{
  absolute?: boolean
  height?: string
}>()
</script>

<template>
  <div class="md-power-loading" :class="{ absolute }" :style="{ height }">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
      <path
        fill="none" stroke="currentColor" stroke-dasharray="15" stroke-dashoffset="15" stroke-linecap="round"
        stroke-width="2" d="M12 3C16.9706 3 21 7.02944 21 12"
      >
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="15;0" />
        <animateTransform
          attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate"
          values="0 12 12;360 12 12"
        />
      </path>
    </svg>
  </div>
</template>

<style>
.md-power-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: currentcolor;
  background-color: inherit;
  transition: background-color var(--vp-t-color);
}

.md-power-loading.absolute {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
}
</style>
