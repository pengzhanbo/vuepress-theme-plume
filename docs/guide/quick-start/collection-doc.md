---
title: doc 集合
icon: streamline-ultimate:sidebar-line-left
createTime: 2025/10/05 17:11:48
permalink: /guide/collection/doc/
---

## 笔记首页定制

笔记目录下的 `README.md` 自动作为笔记首页。默认使用文档布局，可通过配置转换为功能丰富的门户页面：

```md title="typescript/README.md"
---
pageLayout: home
config:
  - type: hero
    title: TypeScript 完全指南
    description: 从基础到进阶的 TypeScript 学习路径
  - type: features
    features:
      - title: 类型系统
        details: 深入理解 TypeScript 类型系统
        icon: mdi:code-braces
      - title: 高级特性
        details: 掌握泛型、装饰器等高级功能
        icon: mdi:rocket-launch
---
```

通过合理的配置，笔记系统能够成为您知识管理的强大工具，提供清晰的内容结构和优秀的阅读体验。
