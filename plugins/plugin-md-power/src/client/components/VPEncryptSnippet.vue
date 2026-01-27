<script setup lang="ts">
import snippets from '@internal/encrypt-snippets'
import { decodeData } from '@vuepress/helper/client'
import { useIntersectionObserver } from '@vueuse/core'
import { computed, defineComponent, h, ref, useTemplateRef } from 'vue'
import { ClientOnly, onContentUpdated } from 'vuepress/client'
import { useDecrypt } from '../composables/decrypt.js'
import { ENCRYPT_LOCALES } from '../options.js'

const { data, hint, pathLocale } = defineProps<{
  data: string
  pathLocale: string
  hint?: string
}>()

const config = computed<{
  hash: string
  salt: number[]
  iv: number[]
}>(() => JSON.parse(decodeData(data)))

const locale = computed(() => ENCRYPT_LOCALES[pathLocale] || {})

const { decrypt } = useDecrypt(config)

const el = useTemplateRef<HTMLDivElement>('el')
const password = ref('')
const content = ref('')
const errorCode = ref<0 | 1 | 2>(0) // 0: no error, 1: wrong password 2: no content
const loading = ref(false)

// web encrypt should always use https
const isHttps = computed(() => {
  if (__VUEPRESS_SSR__)
    return false

  if (__VUEPRESS_DEV__)
    return true

  return window.location.protocol === 'https:'
})

let rawContent = ''
async function load(): Promise<[null, string] | [2, null]> {
  if (rawContent)
    return [null, rawContent]
  const loader = snippets[config.value.hash]
  if (loader) {
    try {
      return [null, rawContent = (await loader()).default]
    }
    catch {
      return [2, null]
    }
  }
  return [2, null]
}

async function onDecrypt() {
  if (!password.value || loading.value)
    return

  loading.value = true
  errorCode.value = 0
  const [code, rawContent] = await load()
  if (typeof code === 'number') {
    errorCode.value = code
    return
  }

  try {
    content.value = (await decrypt(password.value, rawContent))!
  }
  catch {
    errorCode.value = 1
  }

  loading.value = false
}

useIntersectionObserver(el, ([entry]) => {
  if (entry?.isIntersecting)
    load()
})

onContentUpdated((reason) => {
  if (reason === 'updated') {
    rawContent = ''
    content.value = ''
    errorCode.value = 0
  }
})

const DecryptedContent = defineComponent({
  name: 'DecryptedContent',
  props: { content: String },
  render() {
    const template = `<div>${this.content}</div>`
    return h({ template })
  },
})
</script>

<template>
  <ClientOnly>
    <div v-if="!content" ref="el" class="vp-encrypt-snippet">
      <div class="snippet-hint">
        <span class="vpi-lock" />
        <span>{{ hint || locale.hint || 'The content is encrypted, please unlock to view.' }}</span>
      </div>
      <div v-if="!isHttps" class="snippet-warning">
        <strong>{{ locale.warningTitle || '🚨 Security Warning:' }}</strong>
        {{ locale.warningText || 'Your connection is not encrypted with HTTPS, posing a risk of content leakage and preventing access to encrypted content.' }}
      </div>
      <div v-else class="snippet-form" :class="{ error: errorCode === 1 }">
        <label for="password">
          <input
            v-model="password" name="password" type="password"
            :placeholder="locale.placeholder || 'Enter password'"
            @keydown.enter="onDecrypt"
            @input="errorCode = 0"
          >
        </label>
        <button type="button" :disabled="!password" @click="onDecrypt">
          <span :class="loading ? 'vpi-loading' : 'vpi-unlock'" />
        </button>
        <p v-if="errorCode === 1" class="snippet-error">
          {{ locale.incPwd || 'Incorrect password' }}
        </p>
        <p v-if="errorCode === 2" class="snippet-error">
          {{ locale.noContent || 'Unlocked, but content failed to load, please try again later.' }}
        </p>
      </div>
    </div>
    <DecryptedContent v-else :content="content" class="decrypted-content" />
  </ClientOnly>
</template>

<style>
.vp-encrypt-snippet {
  padding: 16px 20px;
  background-color: var(--vp-c-important-soft);
  border-radius: 8px;
}

.vp-encrypt-snippet .snippet-hint {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-important-1);
}

.vp-encrypt-snippet .snippet-warning {
  font-size: 14px;
  color: var(--vp-c-text-2);
  text-align: center;
}

.vp-encrypt-snippet .snippet-form {
  position: relative;
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
  max-width: 320px;
  height: 36px;
  padding-right: 4px;
  padding-left: 12px;
  margin: 12px auto 8px;
  background: var(--vp-c-bg);
  border: solid 1px var(--vp-c-important-2);
  border-radius: 18px;
  transition: border-color var(--vp-t-color);
}

.vp-encrypt-snippet .snippet-form.error {
  border-color: var(--vp-c-caution-1);
}

.vp-encrypt-snippet .snippet-form label {
  flex: 1;
}

.vp-encrypt-snippet .snippet-form input {
  width: 100%;
  color: var(--vp-c-important-1);
}

.vp-encrypt-snippet .snippet-form button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 14px;
  color: var(--vp-c-important-1);
  cursor: pointer;
  border: solid 2px var(--vp-c-important-1);
  border-radius: 50%;
  transition: var(--vp-t-color);
  transition-property: color, border-color;
}

.vp-encrypt-snippet .snippet-form button[disabled] {
  color: var(--vp-c-text-3);
  border-color: var(--vp-c-text-3);
}

.vp-encrypt-snippet .snippet-form button:not([disabled]):hover {
  color: var(--vp-c-important-3);
  border-color: var(--vp-c-important-3);
}

.vp-encrypt-snippet .snippet-form button .vpi-loading {
  font-size: 24px;
}

.vp-encrypt-snippet .snippet-form .snippet-error {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  padding-left: 12px;
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-caution-1);
}

.decrypted-content {
  background-color: transparent;
  animation: fade-scale 800ms ease-in 8 alternate;
}

@keyframes fade-scale {
  0% {
    background-color: transparent;
  }

  100% {
    background-color: var(--vp-c-green-soft);
  }
}

.vpi-unlock {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 26 26'%3E%3Cpath fill='%23000' d='M7 0C4.79 0 2.878.917 1.687 2.406C.498 3.896 0 5.826 0 7.906V11h3V7.906c0-1.58.389-2.82 1.031-3.625C4.674 3.477 5.541 3 7 3c1.463 0 2.328.45 2.969 1.25c.64.8 1.031 2.06 1.031 3.656V9h3V7.906c0-2.092-.527-4.044-1.719-5.531C11.09.888 9.206 0 7 0m2 10c-1.656 0-3 1.344-3 3v10c0 1.656 1.344 3 3 3h14c1.656 0 3-1.344 3-3V13c0-1.656-1.344-3-3-3zm7 5a2 2 0 0 1 2 2c0 .738-.404 1.372-1 1.719V21c0 .551-.449 1-1 1s-1-.449-1-1v-2.281c-.596-.347-1-.98-1-1.719a2 2 0 0 1 2-2'/%3E%3C/svg%3E");
}
</style>
