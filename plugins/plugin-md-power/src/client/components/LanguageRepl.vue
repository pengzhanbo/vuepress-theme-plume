<script setup lang="ts">
import { shallowRef } from 'vue'
import { useCodeRepl } from '../composables/codeRepl.js'
import IconRun from './IconRun.vue'
import Loading from './Loading.vue'
import IconConsole from './IconConsole.vue'
import IconClose from './IconClose.vue'

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
    <span v-show="loaded && finished" class="icon-run" title="Run Code" @click="runCode">
      <IconRun />
    </span>
    <slot />
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
          <p
            v-for="(item, index) in stderr" :key="index"
            :class="{ error: lang === 'rust' && item.startsWith('error') }"
          >
            <pre>{{ item }}</pre>
          </p>
        </div>
        <div v-if="stdout.length" class="stdout">
          <h4 v-if="stderr.length">
            Stdout:
          </h4>
          <p v-for="(item, index) in stdout" :key="index">
            <pre>{{ item }}</pre>
          </p>
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

.code-repl-output {
  position: relative;
  top: -20px;
  padding-top: 6px;
  margin: 0 -1.5rem;
  background-color: var(--vp-code-block-bg);
  transition: background-color, var(--t-color);
}

@media (min-width: 768px) {
  .code-repl-output {
    margin: 0;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
  }
}

.icon-run {
  position: absolute;
  top: -10px;
  right: 10px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  font-size: 16px;
  color: var(--vp-c-bg);
  cursor: pointer;
  background-color: var(--vp-c-brand-1);
  border-radius: 100%;
  transition: var(--t-color);
  transition-property: color, background-color;
}

@media (min-width: 768px) {
  .icon-run {
    top: 60px;
    right: 16px;
  }
}

.icon-run:hover {
  background-color: var(--vp-c-brand-2);
}

.code-repl-output .output-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px 4px 20px;
  border-top: solid 2px var(--vp-c-border);
  transition: border-color var(--t-color);
}

.output-head .title {
  flex: 1;
  margin-left: 10px;
  font-size: 14px;
  font-weight: 500;
}

.output-head .output-version {
  font-size: 12px;
  color: var(--vp-c-text-3);
  transition: color var(--t-color);
}

.output-head .icon-close {
  width: 20px;
  height: 20px;
  margin-left: 20px;
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: color var(--t-color);
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

.output-content p {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
}

.output-content p pre {
  width: fit-content;
  padding: 0 20px 0 0;
  margin: 0;
  overflow-x: initial;
}

.output-content .error,
.output-content .stderr p,
.output-content.rust .stderr p.error {
  color: var(--vp-c-danger-1, #b8272c);
  transition: color var(--t-color);
}

.output-content.rust .stderr p {
  color: var(--vp-c-text-1);
}

.output-content .stderr + .stdout {
  margin-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
  transition: border-color var(--t-color);
}
</style>
