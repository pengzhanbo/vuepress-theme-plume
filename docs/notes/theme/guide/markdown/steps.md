---
title: 步骤
createTime: 2024/09/30 14:40:30
icon: streamline:steps-number
permalink: /guide/markdown/steps/
---

## 概述

有时候，你需要将内容 划分为递进的步骤展示，你可以使用 `steps` 容器 实现。

## 语法

在 `steps` 容器内，使用 有序列表 （或无序列表） 来表示步骤。你可以在 容器内使用 任意 markdown 语法。

````md
::: steps

1. 步骤 1

  相关内容

2. 步骤 2

  相关内容

:::
````

## 示例

输入：

````md
:::: steps
1. 步骤 1

   ```ts
   console.log('Hello World!')
   ```

2. 步骤 2

   这里是步骤 2 的相关内容

3. 步骤 3

   ::: tip
   提示容器
   :::

4. 结束
::::
````

输出：

:::: steps

1. 步骤 1

   ```ts
   console.log('Hello World!')
   ```

2. 步骤 2

   这里是步骤 2 的相关内容

3. 步骤 3

   ::: tip
   提示容器
   :::

4. 结束
::::
