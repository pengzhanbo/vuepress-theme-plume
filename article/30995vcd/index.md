---
url: /article/30995vcd/index.md
---
## 单列照片

```md :no-line-numbers
<ImageCard v-for="item in list" :key="item.image" v-bind="item" />
```

## 双列照片

```md :no-line-numbers
<CardGrid cols="2">
  <ImageCard v-for="item in list" :key="item.image" v-bind="item" />
</CardGrid>
```

## 三列照片

```md :no-line-numbers
<CardGrid cols="3">
  <ImageCard v-for="item in list" :key="item.image" v-bind="item" />
</CardGrid>
```

## 不同尺寸设备适配

调整窗口大小以观察效果

```md :no-line-numbers
<CardGrid :cols="{ sm: 2, md: 3, lg: 3 }">
  <ImageCard v-for="item in list" :key="item.image" v-bind="item" />
</CardGrid>
```
