---
title: 徽章
icon: iconamoon:badge-light
createTime: 2024/08/18 22:45:50
permalink: /guide/components/badge/
---

## 概述 <Badge type="tip" text="badge" />

使用 `<Badge>` 组件来显示行内信息，如状态或标签。

将你想显示的内容传递给 `<Badge>` 组件的 `text` 属性。

## Props

:::: field-group

::: field type
@type `'info' | 'tip' | 'warning' | 'danger' | string`
@default `'tip'`
徽章类型，不同的类型使用不同的颜色方案。支持自定义类型
:::

::: field text
@type `string`
@default `''`
徽章文本
:::

::: field color
@type `string`

自定义徽章文本颜色
:::

::: field bgColor
@type `string`

自定义徽章背景颜色
:::

::: field borderColor
@type `string`
@default `'transparent'`
自定义徽章边框颜色
:::

::::

## Slots

### `default`

组件内部提供 `default` 插槽，**插槽内容优先于 `text` 属性**。适合放置图标或富文本：

```vue
<Badge type="tip">
  <VPIcon provider="iconify" name="carbon:warning" />
  注意
</Badge>
```

若不写插槽内容，则回退渲染 `text` 属性的值：

```vue
<!-- 等价于上面的写法 -->
<Badge type="tip" text="注意" />
```

::: tip
插槽内容会原样包裹在徽章内，若放入较长文本，建议改用自定义 `color` / `bgColor` 而非依赖 `text` 的截断样式。
:::

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

1. 在主题 [自定义样式文件](../custom/style.md) 中，添加预定的样式：

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

`<Badge>` 组件在实际文档编写中有多种常见用途，以下示例展示了几种典型场景。

### 状态标识

在功能列表或说明中，使用 `<Badge>` 标记推荐、新增或重要功能，帮助读者快速识别关键信息。

**输入：**

```md :no-line-numbers
- 文章加密 <Badge type="tip" text="推荐" />
- 全站加密 <Badge type="info" text="新增" />
- 评论系统 <Badge type="danger" text="重要" />
```

**输出：**

- 文章加密 <Badge type="tip" text="推荐" />
- 全站加密 <Badge type="info" text="新增" />
- 评论系统 <Badge type="danger" text="重要" />

### 版本标记

在 API 文档或功能说明中，使用 `<Badge>` 标记功能所要求的最低版本，便于读者判断兼容性。

**输入：**

```md :no-line-numbers
- `sidebarCollapsed` 选项 <Badge type="info" text="v1.0.0-rc.143 +" />
- 集合配置 <Badge type="warning" text="v1.0.0-rc.120 +" />
```

**输出：**

- `sidebarCollapsed` 选项 <Badge type="info" text="v1.0.0-rc.143 +" />
- 集合配置 <Badge type="warning" text="v1.0.0-rc.120 +" />

### 分类标签

在文档章节标题中，使用 `<Badge>` 标记实验性或弃用的功能，让读者在使用前注意风险。

**输入：**

```md :no-line-numbers
## 自定义区域类型 <Badge type="warning" text="实验性" />

## 旧版配置方式 <Badge type="danger" text="已弃用" />
```

**输出：**

- 自定义区域类型 <Badge type="warning" text="实验性" />
- 旧版配置方式 <Badge type="danger" text="已弃用" />
