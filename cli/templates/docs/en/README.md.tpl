---
pageLayout: home
config:
  -
    type: hero
    full: true
    forceDark: true
    effect: lightning
    hero:
      name: Theme Plume
      tagline: VuePress Next Theme
      text: A simple, feature-rich, document & blog
      actions:
        -
          theme: brand
          text: Blog
<% if (it.defaultLanguage === 'en-US') { %>
          link: /blog/
<% } else { %>
          link: /en/blog/
<% } %>
        -
          theme: alt
          text: Github →
          link: https://github.com/pengzhanbo/vuepress-theme-plume
---
