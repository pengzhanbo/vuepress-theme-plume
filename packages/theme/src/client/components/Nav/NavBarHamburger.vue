<script lang="ts" setup>
defineProps<{
  active: boolean
}>()

defineEmits<(e: 'click') => void>()
</script>

<template>
  <button
    type="button"
    class="navbar-hamburger"
    :class="{ active }"
    aria-label="mobile navigation"
    :aria-expanded="active"
    aria-controls="nav-screen"
    @click="$emit('click')"
  >
    <span class="container">
      <span class="top" />
      <span class="middle" />
      <span class="bottom" />
    </span>
  </button>
</template>

<style scoped>
.navbar-hamburger {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: var(--vp-nav-height);
}

@media (min-width: 768px) {
  .navbar-hamburger {
    display: none;
  }
}

.container {
  position: relative;
  width: 16px;
  height: 14px;
  overflow: hidden;
}

.navbar-hamburger:hover .top {
  top: 0;
  left: 0;
  transform: translateX(4px);
}

.navbar-hamburger:hover .middle {
  top: 6px;
  left: 0;
  transform: translateX(0);
}

.navbar-hamburger:hover .bottom {
  top: 12px;
  left: 0;
  transform: translateX(8px);
}

.navbar-hamburger.active .top {
  top: 6px;
  transform: translateX(0) rotate(225deg);
}

.navbar-hamburger.active .middle {
  top: 6px;
  transform: translateX(16px);
}

.navbar-hamburger.active .bottom {
  top: 6px;
  transform: translateX(0) rotate(135deg);
}

.navbar-hamburger.active:hover .top,
.navbar-hamburger.active:hover .middle,
.navbar-hamburger.active:hover .bottom {
  background-color: var(--vp-c-text-2);
  transition: top 0.25s, background-color 0.25s, transform 0.25s;
}

.top,
.middle,
.bottom {
  position: absolute;
  width: 16px;
  height: 2px;
  background-color: var(--vp-c-text-1);
  transition: top 0.25s, background-color 0.5s, transform 0.25s;
}

.top {
  top: 0;
  left: 0;
  transform: translateX(0);
}

.middle {
  top: 6px;
  left: 0;
  transform: translateX(8px);
}

.bottom {
  top: 12px;
  left: 0;
  transform: translateX(4px);
}
</style>
