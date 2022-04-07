<script setup lang="ts">
import { useThemeLocaleData } from '../composables'

defineEmits(['toggle'])

const themeLocale = useThemeLocaleData()
</script>

<template>
  <div
    class="toggle-sidebar-button"
    :title="themeLocale.toggleSidebar"
    aria-expanded="false"
    role="button"
    tabindex="0"
    @click="$emit('toggle')"
  >
    <div class="icon" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>
<style lang="scss">
@import '../styles/_mixins';

.toggle-sidebar-button {
  position: absolute;
  top: 0.6rem;
  left: 1rem;
  display: none;
  padding: 0.6rem;
  cursor: pointer;
}

.toggle-sidebar-button .icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 1.25rem;
  height: 1.25rem;
  cursor: inherit;

  span {
    display: inline-block;
    width: 100%;
    height: 2px;
    border-radius: 2px;
    background-color: var(--c-text);
    transition: transform var(--t-transform);

    &:nth-child(2) {
      margin: 6px 0;
    }
  }
}

@media screen and (max-width: $MQMobile) {
  .toggle-sidebar-button {
    display: block;
  }
}
</style>
