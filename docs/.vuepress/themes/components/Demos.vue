<script setup lang="ts">
interface Demo {
  name: string
  desc: string
  logo: string
  repo: string
  url: string
  preview: string
}

defineProps<{
  list: Demo[]
}>()
</script>

<template>
  <div class="demos">
    <div v-for="demo in list" :key="demo.url" class="demo-item">
      <div class="demo-img">
        <a :href="demo.url" target="_blank" rel="noopener noreferrer">
          <img :src="demo.preview" :alt="demo.name" loading="lazy">
        </a>
      </div>
      <div class="demo-content">
        <h3 class="demo-title">
          <span v-if="demo.logo" class="logo" :style="`background-image: url(${demo.logo})`" />
          <span class="title">
            <a :href="demo.url" target="_blank" rel="noopener noreferrer" :aria-label="demo.name" :title="demo.name">{{ demo.name }}</a>
          </span>
          <a v-if="demo.repo" :href="demo.repo" class="github" target="_blank" rel="noopener noreferrer" :aria-label="`Link to GitHub: ${demo.name}`">
            <span class="vpi-social-github" />
          </a>
        </h3>
        <p :title="demo.desc">
          {{ demo.desc }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demos {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 20px 16px;
  width: 100%;
}

@media (min-width: 768px) {
  .demos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.demo-item {
  overflow: hidden;
  border: solid 1px var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: var(--vp-shadow-1);
  transition: var(--vp-t-color);
  transition-property: border;
}

.demo-item:hover {
  box-shadow: var(--vp-shadow-3);
}

.demo-img {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  overflow: hidden;
}

.demo-img img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  object-fit: cover;
  transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1);
  transform: scale(1);
}

.demo-item:hover .demo-img img {
  transform: scale(1.05);
}

.demo-content {
  padding: 0 16px 12px;
}

.demo-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px auto 6px;
  font-size: 16px;
}

.demo-title .logo {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

.demo-title .title {
  flex: 1 2;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.demo-title .title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.demo-title .github {
  display: flex;
  margin-left: 10px;
  color: var(--vp-c-text-1);
}

.demo-title .vpi-social-github {
  display: inline-block;
  width: 20px;
  height: 20px;
}

.demo-content p {
  display: -webkit-box;
  margin: 6px auto 0;
  overflow: hidden;
  font-size: 14px;

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>
