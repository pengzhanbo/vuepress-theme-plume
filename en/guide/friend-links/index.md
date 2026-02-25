---
url: /en/guide/friend-links/index.md
---
## Friend Links

The friend links page is not automatically generated, but you can create it as needed.

Create any `*.md` file in your `{sourceDir}/` directory, such as `friends.md`. Then configure it using `frontmatter` in this file.

```md title="friends.md"
---
friends: true
title: Friend Links
description: Description text for friend links
permalink: /friends/
cols: 2
contentPosition: after
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

You need to manually configure the entry link for the friend links page in an appropriate location in the `navbar`.

### Configuration

View the [documentation](../../config/frontmatter/friend.md) for more configuration information.
