<script setup lang="ts">
import { toRef } from 'vue'
import { ClientOnly } from 'vuepress/client'
import { useGithubRepo } from '../composables/repo.js'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  repo: string
  fullname?: boolean
  provider?: 'github' | 'gitee'
}>(), { fullname: undefined, provider: 'github' })
const { loaded, data } = useGithubRepo(toRef(props, 'repo'), toRef(props, 'provider'))
</script>

<template>
  <ClientOnly>
    <div v-if="loaded && data?.name" class="vp-repo-card" v-bind="$attrs">
      <p class="repo-name">
        <span :class="`vpi-${provider}-repo`" />
        <span class="repo-link">
          <a :href="data.url" target="_blank" rel="noopener noreferrer" class="no-icon" :title="data.fullName">
            {{ fullname || (data.ownerType === 'Organization' && typeof fullname === 'undefined') ? data.fullName : data.name }}
          </a>
        </span>
        <span class="repo-visibility" :class="{ archived: data.archived }">{{ data.visibility + (data.template ? ' Template' : '') }}{{ data.archived ? ' archive' : '' }}</span>
      </p>
      <p class="repo-desc">
        {{ data.description }}
      </p>
      <div class="repo-info">
        <p v-if="data.language">
          <span
            class="repo-language" :style="{ 'background-color': data.languageColor }"
          /><span>{{ data.language }}</span>
        </p>
        <p :title="`Github Stars: ${data.stars}`">
          <span class="vpi-github-star" /><span>{{ data.convertStars }}</span>
        </p>
        <p :title="`Github Forks: ${data.forks}`">
          <span class="vpi-github-fork" /><span>{{ data.convertForks }}</span>
        </p>
        <p v-if="data.license" :title="`Github License: ${data.license.name}`">
          <span class="vpi-github-license" /><span>{{ data.license.name }}</span>
        </p>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.vp-repo-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 20px;
  margin: 16px 0;
  border: solid 1px var(--vp-c-divider);
  border-radius: 8px;
  transition: border-color var(--vp-t-color);
}

.vp-repo-card:hover {
  border-color: var(--vp-c-brand-2);
}

.vp-repo-card p {
  margin: 0;
}

.vp-repo-card .repo-name {
  display: flex;
  gap: 0 6px;
  align-items: center;
  max-width: 100%;
  font-size: 14px;
}

.vp-repo-card .repo-link {
  flex: 1 2;
  width: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vp-repo-card .repo-name a {
  max-width: 100%;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: color var(--vp-t-color);
}

.vp-repo-card .repo-name a:hover {
  color: var(--vp-c-brand-2);
}

.vp-repo-card .repo-visibility {
  display: inline-block;
  padding: 0 8px;
  font-size: 12px;
  line-height: 20px;
  color: var(--vp-c-text-2);
  border: solid 1px var(--vp-c-divider);
  border-radius: 22px;
  transition: color var(--vp-t-color), border var(--vp-t-color);
}

.vp-repo-card .repo-visibility.archived {
  color: var(--vp-c-warning-1);
  border-color: var(--vp-c-warning-2);
}

.vp-repo-card .repo-desc {
  flex: 1 2;
  font-size: 12px;
  line-height: 18px;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}

.vp-repo-card .repo-info {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
}

.vp-repo-card .repo-info p {
  display: flex;
  gap: 0 4px;
  align-items: center;
  margin: 0;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}

.vp-repo-card .repo-info p [class^="vpi-github-"] {
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);
}

.vp-repo-card .repo-language {
  display: inline-block;
  width: 0.8em;
  height: 0.8em;
  border-radius: 100%;
}

.vpi-gitee-repo {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23c71d23' d='M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.59.59 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296Z'/%3E%3C/svg%3E");

  color: #c71d23;
  transition: color var(--vp-t-color);
  transform: translateY(2px);
}

.vpi-github-repo {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 16 16'%3E%3Cpath fill='%23000' d='M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7a.75.75 0 1 1-1.072 1.05A2.5 2.5 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.5 2.5 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.25.25 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z'/%3E%3C/svg%3E");

  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
  transform: translateY(2px);
}

.vpi-github-star {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 256 256'%3E%3Cpath fill='%23000' d='M243 96a20.33 20.33 0 0 0-17.74-14l-56.59-4.57l-21.84-52.81a20.36 20.36 0 0 0-37.66 0L87.35 77.44L30.76 82a20.45 20.45 0 0 0-11.66 35.88l43.18 37.24l-13.2 55.7A20.37 20.37 0 0 0 79.57 233L128 203.19L176.43 233a20.39 20.39 0 0 0 30.49-22.15l-13.2-55.7l43.18-37.24A20.43 20.43 0 0 0 243 96m-70.47 45.7a12 12 0 0 0-3.84 11.86L181.58 208l-47.29-29.08a12 12 0 0 0-12.58 0L74.42 208l12.89-54.4a12 12 0 0 0-3.84-11.86l-42.27-36.5l55.4-4.47a12 12 0 0 0 10.13-7.38L128 41.89l21.27 51.5a12 12 0 0 0 10.13 7.38l55.4 4.47Z'/%3E%3C/svg%3E");
}

.vpi-github-fork {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 256 256'%3E%3Cpath fill='%23000' d='M228 64a36 36 0 1 0-48 33.94V112a4 4 0 0 1-4 4H80a4 4 0 0 1-4-4V97.94a36 36 0 1 0-24 0V112a28 28 0 0 0 28 28h36v18.06a36 36 0 1 0 24 0V140h36a28 28 0 0 0 28-28V97.94A36.07 36.07 0 0 0 228 64M64 52a12 12 0 1 1-12 12a12 12 0 0 1 12-12m64 152a12 12 0 1 1 12-12a12 12 0 0 1-12 12m64-128a12 12 0 1 1 12-12a12 12 0 0 1-12 12'/%3E%3C/svg%3E");
}

.vpi-github-license {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' d='M4.5 13.5h7M8.01 1v12.06M1.5 3.5h3l1.5-1h4l1.5 1h3M.5 10L3 4.48L5.5 10C4 11 2 11 .5 10m10 0L13 4.48L15.5 10c-1.5 1-3.5 1-5 0'/%3E%3C/svg%3E");
}
</style>
