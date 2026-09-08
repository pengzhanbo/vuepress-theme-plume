---
title: GitHub Alerts
icon: mdi:alert-outline
createTime: 2025/11/29 19:59:45
permalink: /en/guide/markdown/github-alerts/
---

## GitHub-Style Alerts

The theme supports rendering
[GitHub-style alerts](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts)
through callouts. They are rendered in the same way as [hint containers](./container.md).

**Input:**

```md
> [!NOTE]
> Highlights information that users should take note of even when skimming.

> [!TIP]
> Optional information to help users be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Advises about negative outcomes from specific actions.
```

**Output:**

> [!NOTE]
> Highlights information that users should take note of even when skimming.

> [!TIP]
> Optional information to help users be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Advises about negative outcomes from specific actions.
