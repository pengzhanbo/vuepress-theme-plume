<script setup lang="ts">
import { useRouteLocale, withBase } from 'vuepress/client'
import LayoutContent from '../components/LayoutContent.vue'
import Nav from '../components/Nav/index.vue'
import { useData } from '../composables/data.js'

const root = useRouteLocale()
const { theme } = useData()
</script>

<template>
  <div class="theme-plume">
    <Nav />
    <LayoutContent is-not-found>
      <div class="not-found">
        <p class="code">
          {{ theme.notFound?.code ?? '404' }}
        </p>
        <h1 class="title">
          {{ theme.notFound?.title ?? 'PAGE NOT FOUND' }}
        </h1>
        <div class="divider" />
        <blockquote class="quote">
          {{ theme.notFound?.quote ?? `But if you don't change your direction, and if you keep looking, you may end up where you are heading.` }}
        </blockquote>

        <div class="action">
          <a class="link" :href="withBase(root)" :aria-label="theme.notFound?.linkLabel ?? 'go to home'">
            {{ theme.notFound?.linkText ?? 'Take me home' }}
          </a>
        </div>
      </div>
    </LayoutContent>
  </div>
</template>

<style scoped>
.theme-plume {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.not-found {
  padding: 64px 24px 96px;
  text-align: center;
}

@media (min-width: 768px) {
  .not-found {
    padding: 96px 32px 168px;
  }
}

.code {
  font-size: 64px;
  font-weight: 600;
  line-height: 64px;
}

.title {
  padding-top: 12px;
  font-size: 20px;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: 2px;
}

.divider {
  width: 64px;
  height: 1px;
  margin: 24px auto 18px;
  background-color: var(--vp-c-divider);
}

.quote {
  max-width: 256px;
  margin: 0 auto;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.action {
  padding-top: 20px;
}

.link {
  display: inline-block;
  padding: 3px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand);
  border: 1px solid var(--vp-c-brand);
  border-radius: 16px;
  transition:
    border-color 0.25s,
    color 0.25s;
}

.link:hover {
  color: var(--vp-c-brand-dark);
  border-color: var(--vp-c-brand-dark);
}
</style>
