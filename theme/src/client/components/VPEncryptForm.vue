<script setup lang="ts">
import { ref } from 'vue'
import { useData, useEncryptCompare } from '../composables/index.js'

const props = defineProps<{
  global?: boolean
  info?: string
}>()

const { theme } = useData()
const { compareGlobal, comparePage } = useEncryptCompare()

const password = ref('')
const errorCode = ref(0) // 0: no error, 1: wrong password
const unlocking = ref(false)

async function onSubmit() {
  if (unlocking.value)
    return

  const compare = props.global ? compareGlobal : comparePage
  unlocking.value = true
  const result = await compare(password.value)
  unlocking.value = false
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
  <div class="vp-encrypt-form">
    <p class="encrypt-text" v-html="info ?? 'Only Password can access this site'" />
    <p class="encrypt-input-wrapper">
      <label for="encrypt-input">
        <span class="vpi-lock icon-lock" />
        <input
          id="encrypt-input"
          v-model="password"
          class="encrypt-input"
          :class="{ error: errorCode === 1 }"
          type="password"
          :placeholder="theme.encryptPlaceholder ?? 'Enter Password'"
          @keyup.enter="onSubmit"
          @input="password && (errorCode = 0)"
        >
      </label>
    </p>
    <button class="encrypt-button" :class="{ unlocking }" @click="onSubmit">
      <span v-if="!unlocking">{{ theme.encryptButtonText ?? 'Confirm' }}</span>
      <span v-else class="vpi-loading" />
    </button>
  </div>
</template>

<style scoped>
.vp-encrypt-form {
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
  transition: border-color var(--vp-t-color), background-color var(--vp-t-color);
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
  transition: background-color var(--vp-t-color);
}

.encrypt-button:hover {
  background-color: var(--vp-c-brand-2);
}

.encrypt-button.unlocking {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-gray-1);
}

.vpi-loading {
  display: inline-block;
  transform: scale(5);
}
</style>
