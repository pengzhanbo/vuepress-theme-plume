<script lang="ts" setup>
import { provide } from 'vue'
import { useNav } from '../../composables/nav.js'
import Navbar from './Navbar.vue'

const { isScreenOpen, closeScreen, toggleScreen } = useNav()

provide('close-screen', closeScreen)
</script>
<template>
  <div class="nav-wrapper">
    <Navbar :is-screen-open="isScreenOpen"></Navbar>
  </div>
</template>
