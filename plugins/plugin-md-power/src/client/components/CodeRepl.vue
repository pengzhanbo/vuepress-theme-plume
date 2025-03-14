<script setup lang="ts">
import { defineAsyncComponent, shallowRef } from 'vue'
import { useCodeRepl } from '../composables/codeRepl.js'
import IconClose from './icons/IconClose.vue'
import IconConsole from './icons/IconConsole.vue'
import IconRun from './icons/IconRun.vue'
import Loading from './icons/Loading.vue'

defineProps<{
  editable?: boolean
  title?: string
}>()

const Editor = defineAsyncComponent(() => import('./CodeEditor.vue'))

const replEl = shallowRef<HTMLDivElement | null>(null)
const outputEl = shallowRef<HTMLDivElement | null>(null)
const {
  onRunCode,
  onCleanRun,
  firstRun,
  stderr,
  stdout,
  error,
  loaded,
  finished,
  lang,
  backendVersion,
} = useCodeRepl(replEl)

function runCode() {
  onRunCode()

  if (outputEl.value)
    outputEl.value.scrollIntoView?.({ behavior: 'smooth', block: 'center' })
}
</script>

<template>
  <div ref="replEl" class="code-repl">
    <div class="code-repl-title">
      <h4>{{ title }}</h4>
      <span v-show="loaded && finished" class="icon-run" title="Run Code" @click="runCode">
        <IconRun />
      </span>
    </div>
    <Editor v-if="editable">
      <slot />
    </Editor>
    <slot v-else />
    <div ref="outputEl" class="code-repl-pin" />
    <div v-if="!firstRun" class="code-repl-output">
      <div class="output-head">
        <IconConsole class="icon-console" />
        <span class="title">console</span>
        <span v-if="lang && backendVersion" class="output-version">
          Running on: {{ lang }} <i>{{ backendVersion }}</i>
        </span>
        <IconClose class="icon-close" @click="onCleanRun" />
      </div>
      <div v-if="!loaded" class="output-content">
        <Loading />
      </div>
      <div v-else class="output-content" :class="lang">
        <p v-if="error" class="error">
          {{ error }}
        </p>
        <div v-if="stderr.length" class="stderr">
          <h4>Stderr:</h4>
          <pre
            v-for="(item, index) in stderr" :key="index"
            :class="{ error: lang === 'rust' && item.startsWith('error') }"
          >{{ item }}</pre>
        </div>
        <div v-if="stdout.length" class="stdout">
          <h4 v-if="stderr.length">
            Stdout:
          </h4>
          <pre v-for="(item, index) in stdout" :key="index">{{ item }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-repl {
  position: relative;
  margin-bottom: 16px;
}

.code-repl :deep(div[class*="language-"]) {
  margin: 0 -1.5rem;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.code-repl-output {
  position: relative;
  top: -20px;
  padding-top: 6px;
  margin: 0 -1.5rem;
  background-color: var(--vp-code-block-bg);
  transition: background-color var(--vp-t-color);
}

.code-repl-title {
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin: 0 -1.5rem;
  background-color: var(--vp-code-block-bg);
  border-bottom: solid 1px var(--vp-c-divider);
  transition: var(--vp-t-color);
  transition-property: background, border;
}

@media (min-width: 640px) {
  .code-repl-title {
    margin: 0;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  .code-repl :deep(div[class*="language-"]) {
    margin: 0;
  }

  .code-repl-output {
    margin: 0;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
  }
}

.code-repl-title h4 {
  flex: 1 2;
  padding: 0 12px;
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 48px;
  color: var(--vp-code-tab-active-text-color);
  white-space: nowrap;
  transition: color var(--vp-t-color);
}

.icon-run {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 12px;
  color: var(--vp-c-text-3);
  cursor: pointer;
  border: solid 1px var(--vp-c-text-3);
  border-radius: 100%;
  transition: var(--vp-t-color);
  transition-property: color, border;
}

.icon-run:hover {
  color: var(--vp-c-text-2);
  border-color: var(--vp-c-text-2);
}

.code-repl-output .output-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px 4px 20px;
  border-top: solid 2px var(--vp-c-divider);
  transition: border-color var(--vp-t-color);
}

.output-head .title {
  flex: 1 2;
  margin-left: 10px;
  font-size: 14px;
  font-weight: 500;
}

.output-head .output-version {
  font-size: 12px;
  color: var(--vp-c-text-3);
  transition: color var(--vp-t-color);
}

.output-head .icon-close {
  width: 20px;
  height: 20px;
  margin-left: 20px;
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: color var(--vp-t-color);
}

.output-head .icon-close:hover {
  color: var(--vp-c-text-2);
}

.output-content {
  padding: 12px 20px 24px;
  overflow-x: auto;
}

.output-content h4 {
  margin: 8px 0;
  font-size: 16px;
}

.output-content pre {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
}

.output-content pre {
  width: fit-content;
  padding: 0 20px 0 0;
  margin: 0;
  overflow-x: initial;
}

.output-content .error,
.output-content .stderr pre,
.output-content.rust .stderr pre.error {
  color: var(--vp-c-danger-1, #b8272c);
  transition: color var(--vp-t-color);
}

.output-content.rust .stderr pre {
  color: var(--vp-c-text-1);
}

.output-content .stderr + .stdout {
  margin-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
  transition: border-color var(--vp-t-color);
}
</style>
