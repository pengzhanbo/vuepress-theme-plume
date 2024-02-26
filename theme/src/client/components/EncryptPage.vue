<script setup lang="ts">
import { ref } from 'vue'
import { usePageEncrypt } from '../composables/encrypt.js'
import { useThemeLocaleData } from '../composables/index.js'
import IconLock from './icons/IconLock.vue'

const theme = useThemeLocaleData()
const { comparePage } = usePageEncrypt()

const password = ref('')
const errorCode = ref(0) // 0: no error, 1: wrong password

function compare() {
  const result = comparePage(password.value)

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
  <div class="page-encrypt-wrapper">
    <div class="logo">
      <IconLock class="icon icon-lock-head" />
    </div>
    <div class="encrypt">
      <p class="encrypt-text" v-html="theme.encryptPageText ?? 'Only Password can access this page'" />
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
</template>

<style scoped>
.icon-lock-head {
  width: 64px;
  height: 64px;
  margin: auto;
}

@media (min-width: 768px) {
  .page-encrypt-wrapper {
    width: 400px;
    padding: 20px;
    margin: 40px auto 0;
    background-color: var(--vp-c-bg-alt);
    border-radius: 8px;
    box-shadow: var(--vp-shadow-2);
    transition: var(--t-color);
    transition-property: box-shadow, background-color;
  }
}

.encrypt {
  margin-top: 20px;
}

.encrypt-text {
  margin-top: 20px;
  margin-bottom: 30px;
  color: var(--vp-c-text-1);
  text-align: center;
  transition: color var(--t-color);
}

.encrypt-input-wrapper {
  position: relative;
}

.icon-lock {
  position: absolute;
  top: 10px;
  left: 10px;
  color: var(--vp-c-border);
  transition: color var(--t-color);
}

.encrypt-input {
  width: 100%;
  padding: 8px 12px 8px 32px;
  background-color: var(--vp-c-bg-soft);
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
