---
url: /en/guide/sitemap/index.md
---
## Usage

The theme provides out-of-the-box configuration to generate a `sitemap.xml` file for the site.
To enable it, the following configuration is required:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    hostname: 'http://your_site_url',
  })
})
```

If customization of the sitemap is needed, it can be achieved through the `plugins.sitemap` configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      sitemap: {
        // ... sitemap configurations
      }
    }
  })
})
```

Refer to the [documentation](https://ecosystem.vuejs.press/zh/plugins/seo/sitemap/config.html) for the complete configuration.
