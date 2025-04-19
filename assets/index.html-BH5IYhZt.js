import{_ as i,c as e,a as n,o as a}from"./app-BMManW_d.js";const t={};function l(p,s){return a(),e("div",null,s[0]||(s[0]=[n(`<h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview"><span>Overview</span></a></h2><p>Sometimes, you need to display content in progressive steps. You can achieve this using the <code>steps</code> container.</p><h2 id="syntax" tabindex="-1"><a class="header-anchor" href="#syntax"><span>Syntax</span></a></h2><p>Within the <code>steps</code> container, use ordered (or unordered) lists to represent steps. You can use any Markdown syntax inside the container.</p><div class="language-md line-numbers-mode" data-highlighter="shiki" data-ext="md" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">::: steps</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A65E2B;--shiki-dark:#D4976C;">1.</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;"> Step 1</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">  Related content</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A65E2B;--shiki-dark:#D4976C;">2.</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;"> Step 2</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">  Related content</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">:::</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="example" tabindex="-1"><a class="header-anchor" href="#example"><span>Example</span></a></h2><p>Input:</p><div class="language-md line-numbers-mode" data-highlighter="shiki" data-ext="md" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">:::: steps</span></span>
<span class="line"><span style="--shiki-light:#A65E2B;--shiki-dark:#D4976C;">1.</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;"> Step 1</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">   \`\`\`</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">ts</span></span>
<span class="line"><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">   console</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">.</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">log</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">(</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">Hello World!</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">)</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">   \`\`\`</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A65E2B;--shiki-dark:#D4976C;">2.</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;"> Step 2</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">   Here is the content related to step 2</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A65E2B;--shiki-dark:#D4976C;">3.</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;"> Step 3</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">   ::: tip</span></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">   Hint container</span></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">   :::</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A65E2B;--shiki-dark:#D4976C;">4.</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;"> End</span></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">::::</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Output:</p><div class="vp-steps"><ol><li><p>Step 1</p><div class="language-ts" data-highlighter="shiki" data-ext="ts" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">console</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">.</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">log</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">(</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">Hello World!</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">)</span></span></code></pre></div></li><li><p>Step 2</p><p>Here is the content related to step 2</p></li><li><p>Step 3</p><div class="hint-container tip"><p class="hint-container-title">Tips</p><p>Hint container</p></div></li><li><p>End</p></li></ol></div>`,10)]))}const r=i(t,[["render",l]]),d=JSON.parse('{"path":"/en/guide/markdown/steps/","title":"Steps","lang":"en-US","frontmatter":{"title":"Steps","createTime":"2025/03/24 20:10:59","icon":"streamline:steps-number","permalink":"/en/guide/markdown/steps/","description":"Overview Sometimes, you need to display content in progressive steps. You can achieve this using the steps container. Syntax Within the steps container, use ordered (or unordere...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Steps\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-27T13:06:53.000Z\\",\\"author\\":[]}"],["meta",{"property":"og:url","content":"https://theme-plume.vuejs.press/en/guide/markdown/steps/"}],["meta",{"property":"og:site_name","content":"Plume Theme"}],["meta",{"property":"og:title","content":"Steps"}],["meta",{"property":"og:description","content":"Overview Sometimes, you need to display content in progressive steps. You can achieve this using the steps container. Syntax Within the steps container, use ordered (or unordere..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:locale:alternate","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-27T13:06:53.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-27T13:06:53.000Z"}],["link",{"rel":"alternate","hreflang":"zh-cn","href":"https://theme-plume.vuejs.press/guide/markdown/steps/"}]]},"readingTime":{"minutes":0.41,"words":123},"git":{"updatedTime":1743080813000,"contributors":[{"name":"zhenghaoyang24","username":"zhenghaoyang24","email":"95458562+zhenghaoyang24@users.noreply.github.com","commits":1,"avatar":"https://avatars.githubusercontent.com/zhenghaoyang24?v=4","url":"https://github.com/zhenghaoyang24"},{"name":"pengzhanbo","username":"pengzhanbo","email":"volodymyr@foxmail.com","commits":1,"avatar":"https://avatars.githubusercontent.com/pengzhanbo?v=4","url":"https://github.com/pengzhanbo"}],"changelog":[{"hash":"9f99ae3ca72b3085c6cd383a9084f42be299c400","time":1743080813000,"email":"95458562+zhenghaoyang24@users.noreply.github.com","author":"zhenghaoyang24","message":"docs: add en <code>markdown</code> doc (#538)","coAuthors":[{"name":"pengzhanbo","email":"volodymyr@foxmail.com"}]}]},"autoDesc":true,"filePathRelative":"en/notes/theme/guide/markdown/steps.md","headers":[],"bulletin":false}');export{r as comp,d as data};
