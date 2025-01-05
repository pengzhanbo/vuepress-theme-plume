<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title?: string
  desc?: string
}>()

const showCode = ref(false)
function toggleCode() {
  showCode.value = !showCode.value
}
</script>

<template>
  <div class="vp-demo-vue">
    <div class="demo-draw">
      <slot />
    </div>
    <div v-if="title || desc" class="demo-info">
      <p v-if="title" class="title">
        {{ title }}
      </p>
      <p v-if="desc" class="desc">
        {{ desc }}
      </p>
    </div>
    <div class="demo-ctrl">
      <span class="vpi-demo-code" @click="toggleCode" />
    </div>
    <div v-show="showCode" class="demo-code">
      <slot name="code" />
    </div>
  </div>
</template>

<style scoped>
.vp-demo-vue {
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  transition: border-color var(--vp-t-color);
}

.vp-demo-vue .demo-draw {
  padding: 24px 16px;
}

.vp-demo-vue .demo-info .title {
  display: flex;
  align-items: center;
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: bolder;
}

.vp-demo-vue .demo-info .title::before {
  display: inline-block;
  width: 32px;
  height: 0;
  margin-right: 8px;
  content: "";
  border-top: 1px solid var(--vp-c-divider);
  transition: border-color var(--vp-t-color);
}

.vp-demo-vue .demo-info .title::after {
  display: inline-block;
  flex: 1;
  height: 0;
  margin-left: 8px;
  content: "";
  border-top: 1px solid var(--vp-c-divider);
  transition: border-color var(--vp-t-color);
}

.vp-demo-vue .demo-info .desc {
  padding: 0 16px;
  margin-top: 8px;
}

.vp-demo-vue .demo-info p:last-child {
  margin-bottom: 16px;
}

.demo-ctrl {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding: 8px 16px;
  border-top: 1px dotted var(--vp-c-divider);
  transition: border-color var(--vp-t-color);
}

.demo-ctrl > [class*="vpi-"] {
  font-size: 1.2em;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color var(--vp-t-color);
}

.demo-ctrl > [class*="vpi-"]:hover {
  color: var(--vp-c-text-1);
}

.vp-demo-vue .demo-code {
  border-top: 1px solid var(--vp-c-divider);
  transition: border-color var(--vp-t-color);
}

.vp-demo-vue .demo-code :deep(div[class*="language-"]),
.vp-demo-vue .demo-code :deep(.vp-code-tabs-nav) {
  margin: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.vpi-demo-code {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M14.18 4.276a.75.75 0 0 1 .531.918l-3.973 14.83a.75.75 0 0 1-1.45-.389l3.974-14.83a.75.75 0 0 1 .919-.53m2.262 3.053a.75.75 0 0 1 1.059-.056l1.737 1.564c.737.662 1.347 1.212 1.767 1.71c.44.525.754 1.088.754 1.784c0 .695-.313 1.258-.754 1.782c-.42.499-1.03 1.049-1.767 1.711l-1.737 1.564a.75.75 0 0 1-1.004-1.115l1.697-1.527c.788-.709 1.319-1.19 1.663-1.598c.33-.393.402-.622.402-.818s-.072-.424-.402-.817c-.344-.409-.875-.89-1.663-1.598l-1.697-1.527a.75.75 0 0 1-.056-1.06m-8.94 1.06a.75.75 0 1 0-1.004-1.115L4.761 8.836c-.737.662-1.347 1.212-1.767 1.71c-.44.525-.754 1.088-.754 1.784c0 .695.313 1.258.754 1.782c.42.499 1.03 1.049 1.767 1.711l1.737 1.564a.75.75 0 0 0 1.004-1.115l-1.697-1.527c-.788-.709-1.319-1.19-1.663-1.598c-.33-.393-.402-.622-.402-.818s.072-.424.402-.817c.344-.409.875-.89 1.663-1.598z'/%3E%3C/svg%3E");
}
</style>
