<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSiteLocaleData } from 'vuepress/client'
import { useThemeLocaleData } from '../composables/index.js'
import { useGlobalEncrypt } from '../composables/encrypt.js'
import IconLock from './icons/IconLock.vue'
import VFooter from './VFooter.vue'

const theme = useThemeLocaleData()
const siteData = useSiteLocaleData()
const { compareGlobal } = useGlobalEncrypt()

const avatar = computed(() => theme.value.avatar)
const title = computed(() => avatar.value?.name || siteData.value.title)

const password = ref('')
const errorCode = ref(0) // 0: no error, 1: wrong password

function compare() {
  const result = compareGlobal(password.value)

  if (!result) {
    errorCode.value = 1
  }
  else {
    errorCode.value = 0
    password.value = ''
  }
}
</script>

<template>
  <div class="global-encrypt-wrapper">
    <div class="global-encrypt-container">
      <div v-if="avatar || title" class="profile">
        <p v-if="avatar" class="avatar" :class="{ circle: avatar.circle }">
          <img :src="avatar.url" :alt="avatar.name">
        </p>
        <h3 v-if="title">
          {{ title }}
        </h3>
      </div>
      <div class="encrypt">
        <p class="encrypt-text" v-html="theme.encryptGlobalText ?? 'Only Password can access this site'" />
        <p class="encrypt-input-wrapper">
          <IconLock class="icon icon-lock" />
          <input
            v-model="password"
            class="encrypt-input"
            :class="{ error: errorCode === 1 }"
            type="password"
            :placeholder="theme.encryptPlaceholder ?? 'Enter Password'"
            @keyup.enter="compare"
            @input="password && (errorCode = 0)"
          >
        </p>
        <button class="encrypt-button" @click="compare">
          {{ theme.encryptButtonText ?? 'Confirm' }}
        </button>
      </div>
    </div>
  </div>
  <VFooter />
</template>

<style scoped>
.global-encrypt-wrapper {
  display: flex;
  flex: 1;
  width: 100%;
  overflow-y: auto;
  background-color: var(--vp-c-bg);
  transition: background-color var(--t-color);
}

@media (min-width: 768px) {
  .global-encrypt-wrapper {
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
  transition: color var(--t-color);
}

.encrypt {
  margin-top: 20px;
}

.encrypt-text {
  margin-top: 40px;
  margin-bottom: 30px;
  color: var(--vp-c-text-1);
  text-align: center;
}

.encrypt-input-wrapper {
  position: relative;
}

.icon-lock {
  position: absolute;
  top: 10px;
  left: 10px;
  color: var(--vp-c-border);
}

.encrypt-input {
  width: 100%;
  padding: 8px 12px 8px 32px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  outline: none;
  transition: border-color var(--t-color), background-color var(--t-color);
}

.encrypt-input:focus {
  border-color: var(--vp-c-brand-1);
}

.encrypt-input.error {
  border-color: var(--vp-c-danger-3);
}

.encrypt-button {
  width: 100%;
  padding: 8px 12px;
  margin-top: 20px;
  font-weight: 500;
  color: var(--vp-c-white);
  cursor: pointer;
  background-color: var(--vp-c-brand-1);
  border: none;
  border-radius: 4px;
  outline: none;
  transition: background-color var(--t-color);
}

.encrypt-button:hover {
  background-color: var(--vp-c-brand-2);
}
</style>
