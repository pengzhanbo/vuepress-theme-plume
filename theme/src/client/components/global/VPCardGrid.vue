<template>
  <div class="vp-card-grid">
    <slot />
  </div>
</template>

<style scoped>
.vp-card-grid {
  display: grid;
  gap: 16px 20px;
  margin: 16px 0;
}

.vp-card-grid > * {
  margin: 0 !important;
}

@media (min-width: 768px) {
  .vp-card-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
