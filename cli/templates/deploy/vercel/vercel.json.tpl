{
  "framework": null,
<% if (it.packageManager === 'yarn') { %>
  "buildCommand": "yarn docs:build",
  "installCommand": "yarn",
<% } else { %>
  "buildCommand": "<%= it.packageManager %> run docs:build",
  "installCommand": "<%= it.packageManager %> install",
<% } %>
  "outputDirectory": "<%= it.docsDir %>/.vuepress/dist"
}
