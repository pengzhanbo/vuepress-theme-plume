<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { onClickOutside, useLocalStorage, useThrottleFn } from '@vueuse/core'
import { resolveCanIUse } from '../composables/caniuse.js'
import CodeViewer from './CodeViewer.vue'

interface Feature {
  label: string
  value: string
}

const api = 'https://api.pengzhanbo.cn/caniuse/features'

const features = useLocalStorage('caniuse-features', [] as Feature[])
onMounted(async () => {
  const res = await fetch(api)
  const data = await res.json()
  features.value = data || features.value || []
})

const browserVersionList = ref([
  { label: '新版本（当前版本 + 3）', value: 3, checked: false },
  { label: '新版本（当前版本 + 2）', value: 2, checked: false },
  { label: '新版本（当前版本 + 1）', value: 1, checked: false },
  { label: '当前版本', value: 0, disabled: true, checked: true },
  { label: '旧版本（当前版本 - 1）', value: -1, checked: false },
  { label: '旧版本（当前版本 - 2）', value: -2, checked: false },
  { label: '旧版本（当前版本 - 3）', value: -3, checked: false },
  { label: '旧版本（当前版本 - 4）', value: -4, checked: false },
  { label: '旧版本（当前版本 - 5）', value: -5, checked: false },
])

const input = ref('')
const isFocus = ref(false)
const searched = ref<Feature[]>()

const selected = ref<Feature | null>(null)
const embedType = ref('')
const browserVersion = computed(() => {
  const values = browserVersionList.value.filter(item => item.checked).map(item => item.value)
  if (values.length === 1 && values[0] === 0)
    return ''

  return values.join(',')
})

watch(() => [features.value, isFocus.value], () => {
  if (!isFocus.value)
    searched.value = features.value
}, { immediate: true })

const listEl = ref<HTMLUListElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
onClickOutside(listEl, () => {
  isFocus.value = false
}, { ignore: [inputEl] })
const onInput = useThrottleFn(() => {
  selected.value = null

  if (!input.value) {
    searched.value = features.value
  }
  else {
    searched.value = features.value.filter(item => item.label.includes(input.value) || item.value.includes(input.value))
    if (searched.value.length === 1)
      selected.value = searched.value[0]
  }
}, 300)
function onSelect(item: Feature) {
  selected.value = item
  input.value = item.label
  isFocus.value = false
}

const output = computed(() => {
  let content = '@[caniuse'
  if (embedType.value)
    content += ` ${embedType.value}`

  if (browserVersion.value && !embedType.value)
    content += `{${browserVersion.value}}`

  content += ']('

  if (selected.value)
    content += selected.value.value

  return `${content})`
})

const rendered = ref('')

function render() {
  if (!selected.value)
    return

  rendered.value = resolveCanIUse(selected.value.value, embedType.value, browserVersion.value)
}
</script>

<template>
  <div class="caniuse-config-wrapper">
    <form>
      <div class="caniuse-form-item">
        <label for="feature">选择特性：</label>
        <div class="feature-input">
          <input
            ref="inputEl" v-model="input" class="feature-input__input" type="text" name="feature"
            placeholder="输入特性" @focus="isFocus = true" @input="onInput"
          >
          <span class="vpi-chevron-down" />
          <ul v-show="isFocus" ref="listEl" class="feature-list">
            <li v-for="item in searched" :key="item.value" @click="onSelect(item)">
              {{ item.label }}
            </li>
          </ul>
        </div>
      </div>
      <div class="caniuse-form-item">
        <label for="embedType">嵌入方式：</label>
        <div class="caniuse-embed-type">
          <label>
            <input type="radio" name="embedType" value="" :checked="embedType === ''" @click="embedType = ''">
            <span>iframe</span>
          </label>
          <label>
            <input
              type="radio" name="embedType" value="image" :checked="embedType === 'image'"
              @click="embedType = 'image'"
            > <span>image</span>
          </label>
        </div>
      </div>
      <div v-if="!embedType" class="caniuse-form-item">
        <label for="browserVersion">浏览器版本：</label>
        <div class="caniuse-browser-version">
          <label v-for="item in browserVersionList" :key="item.value">
            <input
              v-model="item.checked" type="checkbox" name="browserVersion" :checked="item.checked"
              :disabled="item.disabled"
            >
            <span>{{ item.label }}</span>
          </label>
        </div>
      </div>
      <div class="caniuse-render">
        <button class="caniuse-render-button" type="button" :disabled="!selected" @click="render">
          生成预览
        </button>
      </div>
    </form>
    <div class="caniuse-output">
      <h4>输出：</h4>
      <CodeViewer lang="md" :content="output" />
    </div>
    <div v-html="rendered" />
  </div>
</template>

<style scoped>
.caniuse-config-wrapper form {
  padding: 20px;
  margin: 0 -16px;
  background-color: var(--vp-c-bg-safe);
  border: solid 1px var(--vp-c-divider);
  border-radius: 5px;
  transition: var(--t-color);
  transition-property: background border;
}

@media(min-width: 768px) {
  .caniuse-config-wrapper form {
    margin: 0;
  }
}

.caniuse-form-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 16px;
}

.caniuse-form-item:nth-child(3) {
  align-items: baseline;
}

.feature-input {
  position: relative;
  flex: 1;
  margin-left: 10px;
}

.feature-input .vpi-chevron-down {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 1em;
}

.feature-input__input {
  width: 100%;
  padding: 3px 40px 3px 16px;
  font-size: 1em;
  background-color: var(--vp-c-bg);
  border: solid 1px var(--vp-c-divider);
  transition: var(--t-color);
  transition-property: border background;
}

.feature-input__input:focus {
  border-color: var(--vp-c-brand-1);
}

.feature-list {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 20;
  width: 100%;
  max-height: 420px;
  padding: 10px 16px;
  margin: 0;
  overflow-y: auto;
  list-style: none;
  background: var(--vp-c-bg);
  border: solid 1px var(--vp-c-divider);
  border-top: none;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  box-shadow: var(--vp-shadow-2);
}

.feature-list li {
  color: var(--vp-c-text-1);
  cursor: pointer;
}

.feature-list li:hover {
  color: var(--vp-c-brand-1);
}

.caniuse-embed-type {
  margin-left: 10px;
}

.caniuse-embed-type label {
  margin-right: 20px;
  cursor: pointer;
}

.caniuse-browser-version {
  flex: 1;
  flex-wrap: wrap;
  margin-left: 10px;
}

.caniuse-browser-version label {
  display: block;
  width: 100%;
  cursor: pointer;
}

@media (min-width: 768px) {
  .caniuse-browser-version {
    display: flex;
    gap: 10px 0;
  }

  .caniuse-browser-version label {
    width: 50%;
  }
}

.caniuse-render {
  display: flex;
  justify-content: flex-end;
}

.caniuse-render-button {
  padding: 5px 20px;
  font-weight: 500;
  color: var(--vp-c-bg);
  background-color: var(--vp-c-brand-1);
  border-radius: 8px;
  transition: background-color var(--t-color), color var(--t-color);
}

.caniuse-render-button:hover {
  background-color: var(--vp-c-brand-2);
}

.caniuse-render-button[disabled] {
  cursor: not-allowed;
  background-color: var(--vp-c-gray-1);
}
</style>
