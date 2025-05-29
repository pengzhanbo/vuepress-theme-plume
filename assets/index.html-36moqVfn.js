import{_ as p,c as h,a as d,b as o,w as e,r as c,o as r,d as a,e as i}from"./app-DXy-4LBg.js";const g={};function k(u,s){const l=c("Tabs");return r(),h("div",null,[s[4]||(s[4]=d(`<h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview"><span>Overview</span></a></h2><p>Markdown supports tabs functionality.</p><h2 id="syntax" tabindex="-1"><a class="header-anchor" href="#syntax"><span>Syntax</span></a></h2><p>You need to wrap the tabs in a <code>tabs</code> container.</p><p>You can add an id suffix to the <code>tabs</code> container, which will be used as the tab id. All tabs with the same id will share the same toggle event.</p><div class="language-md" data-highlighter="shiki" data-ext="md" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-md"><span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">::: tabs#fruit</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!-- Here, fruit will be used as the id, it is optional --&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!-- Tab content --&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">:::</span></span></code></pre></div><p>Within this container, you should use the <code>@tab</code> tag to mark and separate the tab content.</p><p>After the <code>@tab</code> tag, you can add the text <code>:active</code> to default activate the tab, and the subsequent text will be parsed as the tab title.</p><div class="language-md" data-highlighter="shiki" data-ext="md" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-md"><span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">::: tabs</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">@tab Title 1</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!-- Tab 1 content --&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">@tab Title 2</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!-- Tab 2 content --&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">@tab:active Title 3</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!-- Tab 3 will be default activated --&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!-- Tab 3 content --&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">:::</span></span></code></pre></div><p>By default, the title will be used as the tab&#39;s value, but you can override it with an id suffix.</p><div class="language-md" data-highlighter="shiki" data-ext="md" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-md"><span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">::: tabs</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">@tab Title 1</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!-- Here, the tab 1&#39;s title &quot;Title 1&quot; will be used as the value. --&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!-- Tab 1 content --&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">@tab Title 2#Value 2</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!-- Here, the tab 2&#39;s title will be &quot;Title 2&quot;, but it will use &quot;Value 2&quot; as the tab&#39;s value --&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!-- Tab 2 content --&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">:::</span></span></code></pre></div><p>You can use Vue syntax and components within each tab, and you can access value and isActive, which represent the tab&#39;s bound value and whether the tab is active.</p><h2 id="example" tabindex="-1"><a class="header-anchor" href="#example"><span>Example</span></a></h2><p><strong>Input:</strong></p><div class="language-" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>::: tabs</span></span>
<span class="line"><span>@tab npm</span></span>
<span class="line"><span></span></span>
<span class="line"><span>npm should be installed together with Node.js.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@tab pnpm</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`sh</span></span>
<span class="line"><span>corepack enable</span></span>
<span class="line"><span>corepack use pnpm@8</span></span>
<span class="line"><span>\`\`\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>:::</span></span></code></pre></div><p><strong>Output:</strong></p>`,16)),o(l,{id:"40",data:[{id:"npm"},{id:"pnpm"}]},{title0:e(({value:n,isActive:t})=>s[0]||(s[0]=[i("npm")])),title1:e(({value:n,isActive:t})=>s[1]||(s[1]=[i("pnpm")])),tab0:e(({value:n,isActive:t})=>s[2]||(s[2]=[a("p",null,"npm should be installed together with Node.js.",-1)])),tab1:e(({value:n,isActive:t})=>s[3]||(s[3]=[a("div",{class:"language-sh","data-highlighter":"shiki","data-ext":"sh",style:{"--shiki-light":"#393a34","--shiki-dark":"#dbd7caee","--shiki-light-bg":"#ffffff","--shiki-dark-bg":"#121212"}},[a("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code"},[a("code",{class:"language-sh"},[a("span",{class:"line"},[a("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}},"corepack"),a("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}}," enable")]),i(`
`),a("span",{class:"line"},[a("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}},"corepack"),a("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}}," use"),a("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}}," pnpm@8")])])])],-1)])),_:1})])}const m=p(g,[["render",k]]),y=JSON.parse('{"path":"/en/guide/markdown/tabs/","title":"Tabs","lang":"en-US","frontmatter":{"title":"Tabs","createTime":"2025/03/24 21:13:58","icon":"vaadin:tabs","permalink":"/en/guide/markdown/tabs/","description":"Overview Markdown supports tabs functionality. Syntax You need to wrap the tabs in a tabs container. You can add an id suffix to the tabs container, which will be used as the ta...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Tabs\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-27T13:06:53.000Z\\",\\"author\\":[]}"],["meta",{"property":"og:url","content":"https://theme-plume.vuejs.press/en/guide/markdown/tabs/"}],["meta",{"property":"og:site_name","content":"Plume Theme"}],["meta",{"property":"og:title","content":"Tabs"}],["meta",{"property":"og:description","content":"Overview Markdown supports tabs functionality. Syntax You need to wrap the tabs in a tabs container. You can add an id suffix to the tabs container, which will be used as the ta..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:locale:alternate","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-27T13:06:53.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-27T13:06:53.000Z"}],["link",{"rel":"alternate","hreflang":"zh-cn","href":"https://theme-plume.vuejs.press/guide/markdown/tabs/"}]]},"readingTime":{"minutes":0.95,"words":284},"git":{"createdTime":1743080813000,"updatedTime":1743080813000,"contributors":[{"name":"zhenghaoyang24","username":"zhenghaoyang24","email":"95458562+zhenghaoyang24@users.noreply.github.com","commits":1,"avatar":"https://avatars.githubusercontent.com/zhenghaoyang24?v=4","url":"https://github.com/zhenghaoyang24"},{"name":"pengzhanbo","username":"pengzhanbo","email":"volodymyr@foxmail.com","commits":1,"avatar":"https://avatars.githubusercontent.com/pengzhanbo?v=4","url":"https://github.com/pengzhanbo"}],"changelog":[{"hash":"9f99ae3ca72b3085c6cd383a9084f42be299c400","time":1743080813000,"email":"95458562+zhenghaoyang24@users.noreply.github.com","author":"zhenghaoyang24","message":"docs: add en <code>markdown</code> doc (#538)","coAuthors":[{"name":"pengzhanbo","email":"volodymyr@foxmail.com"}]}]},"autoDesc":true,"filePathRelative":"en/notes/theme/guide/markdown/tabs.md","headers":[],"bulletin":false}');export{m as comp,y as data};
