---
title: CanIUse Feature Search
icon: fa-brands:css3
createTime: 2025/10/09 12:41:26
permalink: /en/tools/caniuse/
readingTime: false
editLink: false
---

In addition to using this tool, you can also directly visit [caniuse.com/](https://caniuse.com/) to search for features.
On the results page, click the `#` button on the left, and the browser's address bar will update automatically. For example:

Search for `@property`, click `#`, and it will navigate to `https://caniuse.com/mdn-css_at-rules_property`.
You can directly copy `mdn-css_at-rules_property` and paste it into your markdown file:

```md
@[caniuse](mdn-css_at-rules_property)
```

## Tool

This tool helps search for features in caniuse and generates the corresponding caniuse markdown code.

<script setup>
import CanIUseConfig from '@source/.vuepress/themes/components/CanIUseConfig.vue'
</script>

<CanIUseConfig />
