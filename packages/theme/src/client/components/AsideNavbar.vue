<script lang="ts" setup>
import Sidebar from '@theme-plume/Sidebar.vue'
import { useAsideNavbar, useNavbarConfig } from '../composables'

const navbarConfig = useNavbarConfig()
const { asideNavbarShow, triggerAsideNavbar } = useAsideNavbar()
</script>
<template>
  <Transition name="fade">
    <div
      v-show="asideNavbarShow"
      class="aside-navbar-wrapper"
      @click.self="triggerAsideNavbar(false)"
    >
      <Sidebar :aside="navbarConfig" />
    </div>
  </Transition>
</template>
<style lang="scss">
@import '../styles/variables';
.aside-navbar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 30;

  .plume-theme-sidebar-wrapper {
    display: block;
    position: relative;
    top: 0;
    right: 0;
    width: 70%;
    height: 100%;
    padding: 1.25rem 0 1.25rem 1.25rem;
  }
}
@media (min-width: $MQMobile) {
  .aside-navbar-wrapper {
    display: none;
  }
}
</style>
