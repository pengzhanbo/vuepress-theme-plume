# prevent Netlify npm install

[build]
publish = "<%= it.docsDir %>/.vuepress/dist"
<% if (it.packageManager === 'yarn') { %>
command = "yarn && yarn run docs:build"
<% } else { %>
command = "<%= it.packageManager %> run docs:build"
<% } %>

[build.environment]
NODE_VERSION = "24"
NPM_FLAGS = "--version"
