<script setup lang="ts">
import { ref } from 'vue'
import { useThemeLocaleData } from '../composables/index.js'

const props = defineProps<{
  compare: (password: string) => boolean
  info?: string
}>()

const theme = useThemeLocaleData()

const password = ref('')
const errorCode = ref(0) // 0: no error, 1: wrong password

function onSubmit() {
  const result = props.compare(password.value)

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
  <div class="encrypt-form">
    <p class="encrypt-text" v-html="info ?? 'Only Password can access this site'" />
    <p class="encrypt-input-wrapper">
      <span class="vpi-lock icon-lock" />
      <input
        v-model="password"
        class="encrypt-input"
        :class="{ error: errorCode === 1 }"
        type="password"
        :placeholder="theme.encryptPlaceholder ?? 'Enter Password'"
        @keyup.enter="onSubmit"
        @input="password && (errorCode = 0)"
      >
    </p>
    <button class="encrypt-button" @click="onSubmit">
      {{ theme.encryptButtonText ?? 'Confirm' }}
    </button>
  </div>
</template>

<style scoped>
.encrypt-form {
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
  top: 12px;
  left: 10px;
  color: var(--vp-c-border);
}

.encrypt-input {
  width: 100%;
  padding: 8px 12px 8px 32px;
  background-color: transparent;
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
