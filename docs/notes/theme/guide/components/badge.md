---
title: 徽章
icon: iconamoon:badge-light
createTime: 2024/08/18 22:45:50
permalink: /guide/components/badge/
---

## 概述 <Badge type="tip" text="badge" />

使用 `<Badge>` 组件来显示 行内信息，如状态或标签。

将你想显示的内容传递给 `<Badge>` 组件的 `text` 属性。

## Props

| 名称         | 类型      | 默认值             | 说明                                                               |
| ------------ | -------- | ------------------ | ------------------------------------------------------------------ |
| type         | `string` | `'tip'`            | 类型，内置值: `'info' \| 'tip' \| 'warning' \| 'danger'`，允许自定义 |
| text         | `string` | `''`               | 文本                                                               |
| color        | `string` | `''`               | 文本颜色                                                           |
| bg-color     | `string` | `''`               | 背景颜色                                                           |
| border-color | `string` | `'transparent'`    | 边框颜色                                                           |

## 示例

**输入：**

```md :no-line-numbers
- VuePress - <Badge type="info" text="v2" />
- VuePress - <Badge type="tip" text="v2" />
- VuePress - <Badge type="warning" text="v2" />
- VuePress - <Badge type="danger" text="v2" />
- VuePress - <Badge text="v2" color="#8e5cd9" bg-color="rgba(159, 122, 234, 0.16)" />
```

**输出：**

- VuePress - <Badge type="info" text="v2" />
- VuePress - <Badge type="tip" text="v2" />
- VuePress - <Badge type="warning" text="v2" />
- VuePress - <Badge type="danger" text="v2" />
- VuePress - <Badge text="v2" color="#8e5cd9" bg-color="rgba(159, 122, 234, 0.16)" />

使用自定义`type`，可以实现更丰富的表现。

**输入：**

1. 在主题 [自定义样式文件](../custom/style.md.md) 中，添加预定的样式：

    ```css
    /* 浅色主题 */
    .vp-badge.important {
      color: #8e5cd9;
      background-color: rgba(159, 122, 234, 0.14);
      border-color: transparent;
    }

    /* 深色主题 */
    [data-theme="dark"] .vp-badge.important {
      color: #8e5cd9;
      background-color: rgba(159, 122, 234, 0.16);
      border-color: transparent;
    }

    /**
    important 为自定义 type 类型
    */
    ```

2. 使用自定义`type`：

    ```md :no-line-numbers
    VuePress - <Badge type="important" text="v2" />
    ```

    **输出：**

    VuePress - <Badge type="important" text="v2" />

<style>
/* 浅色主题 */
.vp-badge.important {
  color: #8e5cd9;
  background-color: rgba(159, 122, 234, 0.14);
  border-color: transparent;
}

/* 深色主题 */
[data-theme="dark"] .vp-badge.important {
  color: #8e5cd9;
  background-color: rgba(159, 122, 234, 0.16);
  border-color: transparent;
}
</style>
