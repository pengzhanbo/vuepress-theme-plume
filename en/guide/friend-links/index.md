---
url: /en/guide/friend-links/index.md
---
## Friend Links

The friend links feature allows you to display links to other sites or bloggers in your blog,
making it easy for readers to discover more quality content.
It supports configuring the display style and link list of the friend links page through frontmatter.

The friend links page is not automatically generated, but you can create it as needed.

Create any `*.md` file in your `{sourceDir}/` directory, such as `friends.md`. Then configure it using `frontmatter` in this file.

```md title="friends.md"
---
pageLayout: friends
title: Friend Links
description: Description text for friend links
permalink: /friends/
contentPosition: after
cols: 2
list:
  -
    name: pengzhanbo
    link: https://github.com/pengzhanbo
    avatar: https://github.com/pengzhanbo.png
    desc: Even if slow, persist without stop; even if falling behind, even if failing, one must be able to reach the goal they are heading towards.
  -
    name: pengzhanbo
    link: https://github.com/pengzhanbo
    avatar: https://github.com/pengzhanbo.png
    desc: Even if slow, persist without stop; even if falling behind, even if failing, one must be able to reach the goal they are heading towards.
---

Custom content <!-- Markdown content will be inserted into the friend links page -->
```

The theme will generate the friend links page based on the configuration.

::: warning `friends: true` is deprecated
The old syntax `friends: true` is deprecated, please use `pageLayout: friends` instead.
:::

You need to manually configure the entry link for the friend links page in an appropriate location in the `navbar`.

### Configuration

View the [documentation](../../config/frontmatter/friend.md) for more configuration information.

::: tip Full field reference
Fields supported by `list` include `name`, `link`, `avatar`, `desc`, `location`, `organization`, `socials`,
`backgroundColor`, `color`, `nameColor`; it also supports `groups` for grouping, as well as layout options
such as `cols` and `contentPosition`. See [Friends Frontmatter Configuration](../../config/frontmatter/friend.md) for details.
:::
