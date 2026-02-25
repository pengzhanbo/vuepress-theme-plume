---
url: /guide/components/badge/index.md
---
## 概述&#x20;

使用 `<Badge>` 组件来显示 行内信息，如状态或标签。

将你想显示的内容传递给 `<Badge>` 组件的 `text` 属性。

## Props

:::: field-group

::: field name="type" type="'info' | 'tip' | 'warning' | 'danger' | string" default="'tip'" optional
徽章类型，不同的类型使用不同的颜色方案。支持自定义类型
:::

::: field name="text" type="string" default="''" optional
徽章文本
:::

::: field name="color" type="string" optional
自定义徽章文本颜色
:::

::: field name="bgColor" type="string" optional
自定义徽章背景颜色
:::

::: field name="borderColor" type="string" optional
自定义徽章边框颜色
:::

::::

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

* VuePress -&#x20;
* VuePress -&#x20;
* VuePress -&#x20;
* VuePress -&#x20;
* VuePress -&#x20;

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

   VuePress -&#x20;
