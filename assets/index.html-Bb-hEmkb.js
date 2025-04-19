import{_ as a,c as i,a as t,o}from"./app-BMManW_d.js";const n={};function p(s,e){return o(),i("div",null,e[0]||(e[0]=[t('<h2 id="概览" tabindex="-1"><a class="header-anchor" href="#概览"><span>概览</span></a></h2><p>项目仓库借助于 <a href="https://pnpm.io/zh/workspaces" target="_blank" rel="noopener noreferrer">pnpm 工作空间</a> 来实现 <a href="https://en.wikipedia.org/wiki/Monorepo" target="_blank" rel="noopener noreferrer">Monorepo</a> ，存放了多个互相关联的独立 Package 。</p><ul><li>主题于 <code>theme</code> 目录中进行开发维护。</li><li>插件于 <code>plugins</code> 目录中进行开发维护。</li><li>文档于 <code>docs</code> 目录中进行开发维护。</li></ul><p>在 <code>plugins</code> 目录中：</p><ul><li><code>plugin-search</code>: 为主题提供 全文模糊搜索 功能</li><li><code>plugin-md-power</code>: 提供 markdown 增强功能</li><li><code>plugin-replace-assets</code>: 提供资源链接替换功能</li><li><code>plugin-fonts</code>: 提供特殊字符字体支持</li></ul><h2 id="开发配置" tabindex="-1"><a class="header-anchor" href="#开发配置"><span>开发配置</span></a></h2><p>开发要求：</p><ul><li><a href="http://nodejs.org/" target="_blank" rel="noopener noreferrer">Node.js</a> version 20.6.0+</li><li><a href="https://pnpm.io/zh/" target="_blank" rel="noopener noreferrer">pnpm</a> version 9+</li></ul><p>克隆代码仓库，并安装依赖：</p><div class="language-sh" data-highlighter="shiki" data-ext="sh" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">pnpm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> install</span></span></code></pre></div><p>在首次启动开发服务前，先构建源代码：</p><div class="language-sh" data-highlighter="shiki" data-ext="sh" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">pnpm</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> build</span></span></code></pre></div><h3 id="主要工具" tabindex="-1"><a class="header-anchor" href="#主要工具"><span>主要工具</span></a></h3><ul><li><a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">TypeScript</a> 作为开发语言</li><li><a href="https://eslint.org/" target="_blank" rel="noopener noreferrer">ESLint</a> 用于代码检查和格式化</li><li><a href="https://stylelint.io/" target="_blank" rel="noopener noreferrer">StyleLint</a> 用于代码检查和格式化</li></ul><h3 id="脚本" tabindex="-1"><a class="header-anchor" href="#脚本"><span>脚本</span></a></h3><h4 id="pnpm-build" tabindex="-1"><a class="header-anchor" href="#pnpm-build"><span><code>pnpm build</code></span></a></h4><p><code>build</code> 命令使用 <code>tsc</code> 将源代码编译成 <code>lib</code> 目录下的 <code>.js</code> 文件。 同时复制 不需要编译的资源到对应的<code>lib</code> 目录下。</p><p>你在克隆代码仓库后，需要先执行该命令来确保项目代码可以顺利运行，因为编译后的输出目录被 <code>.gitignore</code> 排除在仓库以外了。</p><h4 id="pnpm-dev" tabindex="-1"><a class="header-anchor" href="#pnpm-dev"><span><code>pnpm dev</code></span></a></h4><p><code>dev</code> 命令会在本地开启两个服务，一个是运行 主题 <code>theme</code> 目录的 <code>tsup:watch &amp; copy:watch</code>, 一个是运行 示例 <code>docs</code> 目录的 <code>vuepress</code> 开发服务。</p><p><code>plugins</code> 目录下的所有插件，默认都没有 <code>dev</code> 命令，因此，你对 <code>plugins</code> 下的改动，可能需要执行 <code>pnpm build</code> 命令 进行重新构建，部分对 <code>plugins/**/node</code> 目录下的改动，需要重新执行 <code>pnpm dev</code> 才能生效。</p><h4 id="pnpm-lint" tabindex="-1"><a class="header-anchor" href="#pnpm-lint"><span><code>pnpm lint</code></span></a></h4><p><code>lint</code> 命令使用 ESLint 来检查所有源文件。</p><p>当 <code>lint</code> 给出了错误时，你可以手动修改源码以修复 eslint 的报错。 也可以执行 <code>pnpm lint:fix</code> 来自动修复。</p><h4 id="pnpm-test" tabindex="-1"><a class="header-anchor" href="#pnpm-test"><span><code>pnpm test</code></span></a></h4><p><code>test</code> 命令使用 Vitest 来运行所有测试。</p><h3 id="ide-支持" tabindex="-1"><a class="header-anchor" href="#ide-支持"><span>IDE 支持</span></a></h3><p>推荐使用 <code>vs code</code> 进行开发。本仓库配置了开发本主题时，推荐的 <code>vs code</code> 扩展， 当你导入本仓库时，<code>vs code</code> 可能会推荐你安装一些扩展。</p>',28)]))}const r=a(n,[["render",p]]),c=JSON.parse('{"path":"/contributing/","title":"贡献指南","lang":"zh-CN","frontmatter":{"title":"贡献指南","createTime":"2024/03/13 21:27:45","permalink":"/contributing/","draft":true,"externalLinkIcon":false,"readingTime":false,"editLink":false,"contributors":false,"changelog":false,"search":false,"description":"概览 项目仓库借助于 pnpm 工作空间 来实现 Monorepo ，存放了多个互相关联的独立 Package 。 主题于 theme 目录中进行开发维护。 插件于 plugins 目录中进行开发维护。 文档于 docs 目录中进行开发维护。 在 plugins 目录中： plugin-search: 为主题提供 全文模糊搜索 功能 plugin-md...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"贡献指南\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-04-06T23:41:23.000Z\\",\\"author\\":[]}"],["meta",{"property":"og:url","content":"https://theme-plume.vuejs.press/contributing/"}],["meta",{"property":"og:site_name","content":"Plume 主题"}],["meta",{"property":"og:title","content":"贡献指南"}],["meta",{"property":"og:description","content":"概览 项目仓库借助于 pnpm 工作空间 来实现 Monorepo ，存放了多个互相关联的独立 Package 。 主题于 theme 目录中进行开发维护。 插件于 plugins 目录中进行开发维护。 文档于 docs 目录中进行开发维护。 在 plugins 目录中： plugin-search: 为主题提供 全文模糊搜索 功能 plugin-md..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-04-06T23:41:23.000Z"}],["meta",{"property":"article:modified_time","content":"2025-04-06T23:41:23.000Z"}]]},"readingTime":{"minutes":0.1,"words":29},"git":{"updatedTime":1743982883000},"autoDesc":true,"filePathRelative":"contributing.md","headers":[],"categoryList":[],"bulletin":false}');export{r as comp,c as data};
