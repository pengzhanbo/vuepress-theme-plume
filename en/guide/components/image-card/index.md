---
url: /en/guide/components/image-card/index.md
---
## Overview

Use the `<ImageCard>` component to display image cards on a page.

The Image Card differs from markdown's standard image insertion method by presenting more information
related to the image, including title, description, author, link, etc.
It is suitable for scenarios such as photography works, design works, promotional posters, and more.

## Props

:::: field-group

::: field name="image" type="string" required
The image URL. Local images must use an absolute path, i.e., a path starting with `/`, pointing to the `/public` directory.
:::

::: field name="title" type="string" optional
The image title.
:::

::: field name="description" type="string" optional
The image description.
:::

::: field name="author" type="string" optional
The image author.
:::

::: field name="href" type="string" optional
The link to navigate to when the image title is clicked.
:::

::: field name="date" type="string | Date | number" optional
The image creation date.
:::

::: field name="width" type="string | number" optional
The image width.
:::

::: field name="center" type="boolean" optional
Whether to center the image when its width is less than the screen width.
:::

::::

## Examples

**Input:**

```md :no-line-numbers
<ImageCard
  image="https://cn.bing.com/th?id=OHR.AlfanzinaLighthouse_ZH-CN9704515669_1920x1080.webp"
  title="Alfanzina Lighthouse, Algarve, Portugal"
  description="The lighthouse in today's photo is located at Cabo de São Vicente in the Algarve region of southern Portugal. The Alfanzina Lighthouse, built in 1919, shines over the sea, helping vessels navigate the treacherous waters around the area. This lighthouse is a famous tourist attraction and also a symbol of the region's deep connection with the ocean. If you're fortunate enough to live near the lighthouse, this weekend is the perfect time to visit."
  href="/"
  author="Andreas Kunz"
  date="2024/08/16"
/>
```

**Output:**

It can also be placed within a `<CardGrid>` component.

**Input:**

```md :no-line-numbers
<CardGrid>
  <ImageCard
    image="https://cn.bing.com/th?id=OHR.AlfanzinaLighthouse_ZH-CN9704515669_1920x1080.webp"
    title="Alfanzina Lighthouse, Algarve, Portugal"
    description="..."
    href="/"
    author="Andreas Kunz"
    date="2024/08/16"
  />
  <ImageCard
    image="https://cn.bing.com/th?id=OHR.AlfanzinaLighthouse_ZH-CN9704515669_1920x1080.webp"
    title="Alfanzina Lighthouse, Algarve, Portugal"
    description="..."
    href="/"
    author="Andreas Kunz"
    date="2024/08/16"
  />
</CardGrid>
```

**Output:**

[View Photography Works Example](../../../../../blog/1.示例/照片类作品示例.md)
