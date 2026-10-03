[build]
publish = "<%= it.docsDir %>/.vuepress/dist"
command = "<%= it.packageManager %> run docs:build"

[build.environment]
NODE_VERSION = "24"
