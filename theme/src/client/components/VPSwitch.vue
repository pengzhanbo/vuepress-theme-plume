<template>
  <!-- eslint-disable-next-line vue-a11y/role-has-required-aria-props -->
  <button class="vp-switch" type="button" role="switch">
    <span class="check">
      <span v-if="$slots.default" class="icon">
        <slot />
      </span>
    </span>
  </button>
</template>

<style scoped>
.vp-switch {
  position: relative;
  display: block;
  flex-shrink: 0;
  width: 40px;
  height: 22px;
  background-color: var(--vp-input-switch-bg-color);
  border: 1px solid var(--vp-input-border-color);
  border-radius: 11px;
  transition:
    border-color 0.25s ease,
    background-color 0.25s ease;
}

.vp-switch:hover {
  border-color: var(--vp-c-brand-1);
}

.check {
  position: absolute;
  top: 1px;

  /* rtl:ignore */
  left: 1px;
  width: 18px;
  height: 18px;
  background-color: var(--vp-c-neutral-inverse);
  border-radius: 50%;
  box-shadow: var(--vp-shadow-1);
  transition: transform 0.25s;
}

.icon {
  position: relative;
  display: block;
  width: 18px;
  height: 18px;
  overflow: hidden;
  border-radius: 50%;
}

.icon :deep([class^="vpi-"]) {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 12px;
  height: 12px;
  color: var(--vp-c-text-2);
}

[data-theme="dark"] .icon :deep([class^="vpi-"]) {
  color: var(--vp-c-text-1);
  transition: opacity 0.25s !important;
}
</style>
