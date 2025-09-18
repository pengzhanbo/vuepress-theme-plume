<script setup lang="ts">
import VPEncryptForm from '@theme/VPEncryptForm.vue'
import VPFooter from '@theme/VPFooter.vue'
import { computed } from 'vue'
import { useData } from '../composables/index.js'

defineOptions({
  inheritAttrs: false,
})

const { theme, site } = useData()

const profile = computed(() => theme.value.profile)
const title = computed(() => profile.value?.name || site.value.title)
</script>

<template>
  <ClientOnly>
    <div class="vp-global-encrypt" v-bind="$attrs">
      <div class="global-encrypt-container">
        <div v-if="profile || title" class="profile">
          <p v-if="profile" class="avatar" :class="{ circle: profile.circle }">
            <img :src="profile.avatar ?? profile.url" :alt="profile.name">
          </p>
          <h3 v-if="title">
            {{ title }}
          </h3>
        </div>
        <VPEncryptForm global :info="theme.encryptGlobalText" />
      </div>
    </div>
  </ClientOnly>
  <VPFooter />
</template>

<style scoped>
.vp-global-encrypt {
  display: flex;
  flex: 1 2;
  width: 100%;
  overflow-y: auto;
  background-color: var(--vp-c-bg);
  transition: background-color var(--vp-t-color);
}

@media (min-width: 768px) {
  .vp-global-encrypt {
    align-items: center;
    justify-content: center;
    background-color: var(--vp-c-bg-soft);
  }
}

.global-encrypt-container {
  width: 100%;
  padding: 0 20px;
  margin-top: 40px;
}

.profile {
  padding-bottom: 20px;
  margin-bottom: 60px;
  border-bottom: solid 1px var(--vp-c-divider);
}

@media (min-width: 768px) {
  .global-encrypt-container {
    width: 400px;
    padding: 20px;
    margin-top: -40px;
    background-color: var(--vp-c-bg);
    border-radius: 8px;
    box-shadow: var(--vp-shadow-2);
  }

  .profile {
    margin-bottom: 40px;
  }
}

.avatar {
  margin-bottom: 16px;
}

.avatar img {
  width: 120px;
  margin: auto;

  object-fit: cover;
}

.avatar.circle img {
  overflow: hidden;
  border-radius: 50%;
}

.profile h3 {
  font-weight: 500;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  text-align: center;
  transition: color var(--vp-t-color);
}
</style>
