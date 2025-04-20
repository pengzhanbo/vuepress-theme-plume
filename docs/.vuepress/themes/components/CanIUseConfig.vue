<script setup lang="ts">
import { shallowRef, useId } from 'vue'
import { useCaniuse, useCaniuseFeaturesSearch, useCaniuseVersionSelect } from '../composables/caniuse.js'
import CodeViewer from './CodeViewer.vue'

const listEl = shallowRef<HTMLUListElement | null>(null)
const inputEl = shallowRef<HTMLInputElement | null>(null)
const id = useId()

const { feature, featureList, onSelect, isFocus } = useCaniuseFeaturesSearch(inputEl, listEl)
const { past, pastList, future, futureList, embedType, embedTypeList } = useCaniuseVersionSelect()
const { output, rendered } = useCaniuse({ feature, embedType, past, future })
</script>

<template>
  <div class="caniuse-config-wrapper">
    <form>
      <label class="caniuse-form-item" :for="`caniuse-feature-input-${id}`">
        <span>选择特性：</span>
        <div class="feature-input">
          <input
            :id="`caniuse-feature-input-${id}`"
            ref="inputEl"
            class="feature-input__input"
            type="text"
            name="feature"
            placeholder="输入特性"
          >
          <span class="vpi-chevron-down" />
          <ul v-show="isFocus" ref="listEl" class="feature-list">
            <li
              v-for="item in featureList"
              :key="item.value"
            >
              <button
                type="button"
                class="feature-list-item"
                @click="onSelect(item)"
                @keydown.enter="onSelect(item)"
              >
                {{ item.label }}
              </button>
            </li>
          </ul>
        </div>
      </label>
      <div class="caniuse-form-item">
        <span>嵌入方式：</span>
        <div class="caniuse-embed-type">
          <label
            v-for="(item, index) in embedTypeList"
            :key="item.label"
            :for="`caniuse-embed-${id}-${index}`"
          >
            <input :id="`caniuse-embed-${id}-${index}`" v-model="embedType" type="radio" name="embedType" :value="item.value">
            <span>{{ item.label }}</span>
            <Badge v-if="item.value === 'image'" type="warning" text="不推荐" />
          </label>
        </div>
      </div>
      <div v-if="!embedType" class="caniuse-form-item">
        <span>浏览器版本：</span>
        <div class="caniuse-browser-version">
          <label :for="`caniuse-past-${id}`">
            <select :id="`caniuse-past-${id}`" v-model="past" name="past">
              <option v-for="item in pastList" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </label>
          <span>-</span>
          <label :for="`caniuse-future-${id}`">
            <select :id="`caniuse-future-${id}`" v-model="future" name="future">
              <option v-for="item in futureList" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </label>
        </div>
      </div>
    </form>
    <div class="caniuse-output">
      <h4>输出：</h4>
      <CodeViewer lang="md" :content="output" />
    </div>
    <div v-if="embedType === 'image'" v-html="rendered" />
    <CanIUseViewer v-else-if="feature" :feature="feature" :past="past" :future="future" />
  </div>
</template>

<style scoped>
.caniuse-config-wrapper form {
  padding: 20px;
  margin: 0 -16px;
  background-color: var(--vp-c-bg-safe);
  border: solid 1px var(--vp-c-divider);
  border-radius: 5px;
  transition: var(--vp-t-color);
  transition-property: border;
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
  margin-bottom: 0;
}

.feature-input {
  position: relative;
  flex: 1 2;
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
  transition: var(--vp-t-color);
  transition-property: border;
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
  flex: 1 2;
  margin-left: 10px;
}

.caniuse-browser-version span {
  display: none;
}

.caniuse-browser-version label {
  flex: 1 2;
  width: 100%;
  padding: 3px 16px;
  background-color: var(--vp-c-bg);
  border: solid 1px var(--vp-c-divider);
  transition: border var(--vp-t-color), background-color var(--vp-t-color);
}

.caniuse-browser-version select:first-of-type {
  margin-bottom: 16px;
}

@media (min-width: 768px) {
  .caniuse-browser-version {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
  }

  .caniuse-browser-version span {
    display: block;
  }

  .caniuse-browser-version select:first-of-type {
    margin-bottom: 0;
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
  transition: background-color var(--vp-t-color), color var(--vp-t-color);
}

.caniuse-render-button:hover {
  background-color: var(--vp-c-brand-2);
}

.caniuse-render-button[disabled] {
  cursor: not-allowed;
  background-color: var(--vp-c-gray-1);
}
</style>
