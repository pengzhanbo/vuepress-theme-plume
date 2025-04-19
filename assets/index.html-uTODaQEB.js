import{_ as g,c as k,d as s,b as a,a as d,e,w as t,r as h,o as c}from"./app-BMManW_d.js";const m={};function f(u,i){const r=h("RouteLink"),n=h("VPIcon"),p=h("CodeTabs");return c(),k("div",null,[i[14]||(i[14]=s("h2",{id:"overview",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#overview"},[s("span",null,"Overview")])],-1)),i[15]||(i[15]=s("p",null,[e("Use "),s("a",{href:"https://iconify.design/",target:"_blank",rel:"noopener noreferrer"},"iconify"),e(" icons in Markdown files.")],-1)),s("p",null,[i[1]||(i[1]=e("The theme provides an ")),a(r,{to:"/en/notes/theme/guide/components/icon.html"},{default:t(()=>i[0]||(i[0]=[s("code",null,"<Icon />",-1)])),_:1}),i[2]||(i[2]=e(" component for using icons in Markdown and a simplified Markdown syntax for easier icon usage."))]),i[16]||(i[16]=s("p",null,[e("To enhance this feature, the theme recommends installing the "),s("code",null,"@iconify/json"),e(" dependency. It automatically parses icon data from "),s("code",null,"@iconify/json"),e(", packs used icons as local resources for better access.")],-1)),a(p,{id:"0",data:[{id:"pnpm"},{id:"yarn"},{id:"npm"}],"tab-id":"npm-to-pnpm-yarn-npm"},{title0:t(({value:o,isActive:l})=>[a(n,{name:"vscode-icons:file-type-light-pnpm"}),i[3]||(i[3]=s("span",null,"pnpm",-1))]),title1:t(({value:o,isActive:l})=>[a(n,{name:"vscode-icons:file-type-yarn"}),i[4]||(i[4]=s("span",null,"yarn",-1))]),title2:t(({value:o,isActive:l})=>[a(n,{name:"logos:npm-icon"}),i[5]||(i[5]=s("span",null,"npm",-1))]),tab0:t(({value:o,isActive:l})=>i[6]||(i[6]=[s("div",{class:"language-sh","data-highlighter":"shiki","data-ext":"sh",style:{"--shiki-light":"#393a34","--shiki-dark":"#dbd7caee","--shiki-light-bg":"#ffffff","--shiki-dark-bg":"#121212"}},[s("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}},"pnpm"),s("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}}," add"),s("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}}," @iconify/json")])])])],-1)])),tab1:t(({value:o,isActive:l})=>i[7]||(i[7]=[s("div",{class:"language-sh","data-highlighter":"shiki","data-ext":"sh",style:{"--shiki-light":"#393a34","--shiki-dark":"#dbd7caee","--shiki-light-bg":"#ffffff","--shiki-dark-bg":"#121212"}},[s("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}},"yarn"),s("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}}," add"),s("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}}," @iconify/json")])])])],-1)])),tab2:t(({value:o,isActive:l})=>i[8]||(i[8]=[s("div",{class:"language-sh","data-highlighter":"shiki","data-ext":"sh",style:{"--shiki-light":"#393a34","--shiki-dark":"#dbd7caee","--shiki-light-bg":"#ffffff","--shiki-dark-bg":"#121212"}},[s("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}},"npm"),s("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}}," install"),s("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}}," @iconify/json")])])])],-1)])),_:1}),i[17]||(i[17]=d(`<h2 id="syntax" tabindex="-1"><a class="header-anchor" href="#syntax"><span>Syntax</span></a></h2><div class="language-md" data-highlighter="shiki" data-ext="md" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">:</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">[</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">collect:name</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">]</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">:</span></span></code></pre></div><p>To set icon size and color:</p><div class="language-md" data-highlighter="shiki" data-ext="md" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">:[collect:name size]:</span></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">:[collect:name /color]:</span></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">:[collect:name size/color]:</span></span></code></pre></div><p>Iconify has numerous icons grouped into different <code>collect</code> categories. Each <code>collect</code> has its own set of icons.</p><p>You can find <code>collect</code> and <code>name</code> at <a href="https://icon-sets.iconify.design/" target="_blank" rel="noopener noreferrer">https://icon-sets.iconify.design/</a>.</p><h2 id="examples" tabindex="-1"><a class="header-anchor" href="#examples"><span>Examples</span></a></h2><p>Input:</p><div class="language-md" data-highlighter="shiki" data-ext="md" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">:</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">[</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">ion:logo-markdown</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">]</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">:</span></span></code></pre></div><p>Output:</p>`,10)),s("p",null,[a(n,{name:"ion:logo-markdown"})]),i[18]||(i[18]=d(`<p>This is an inline syntax, allowing use with other Markdown elements in the same line.</p><p>Input:</p><div class="language-md" data-highlighter="shiki" data-ext="md" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">github: :</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">[</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">tdesign:logo-github-filled</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">]</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">:</span></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">Change color: :[tdesign:logo-github-filled /#f00]:</span></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">Change size: :[tdesign:logo-github-filled 36px]:</span></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">Change size and color: :[tdesign:logo-github-filled 36px/#f00]:</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">Colored icon: :[skill-icons:vscode-dark 36px]:</span></span></code></pre></div><p>Output:</p>`,4)),s("p",null,[i[9]||(i[9]=e("github: ")),a(n,{name:"tdesign:logo-github-filled"}),i[10]||(i[10]=e(" Change color: ")),a(n,{name:"tdesign:logo-github-filled",color:"#f00"}),i[11]||(i[11]=e(" Change size: ")),a(n,{name:"tdesign:logo-github-filled",size:"36px"}),i[12]||(i[12]=e(" Change size and color: ")),a(n,{name:"tdesign:logo-github-filled",size:"36px",color:"#f00"})]),s("p",null,[i[13]||(i[13]=e("Colored icon: ")),a(n,{name:"skill-icons:vscode-dark",size:"36px"})])])}const v=g(m,[["render",f]]),b=JSON.parse('{"path":"/en/guide/markdown/iconify/","title":"Icons","lang":"en-US","frontmatter":{"title":"Icons","createTime":"2025/03/23 14:24:45","icon":"grommet-icons:emoji","permalink":"/en/guide/markdown/iconify/","description":"Overview Use iconify icons in Markdown files. The theme provides an component for using icons in Markdown and a simplified Markdown syntax for easier icon usage. To enhance this...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Icons\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-27T13:06:53.000Z\\",\\"author\\":[]}"],["meta",{"property":"og:url","content":"https://theme-plume.vuejs.press/en/guide/markdown/iconify/"}],["meta",{"property":"og:site_name","content":"Plume Theme"}],["meta",{"property":"og:title","content":"Icons"}],["meta",{"property":"og:description","content":"Overview Use iconify icons in Markdown files. The theme provides an component for using icons in Markdown and a simplified Markdown syntax for easier icon usage. To enhance this..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:locale:alternate","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-27T13:06:53.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-27T13:06:53.000Z"}],["link",{"rel":"alternate","hreflang":"zh-cn","href":"https://theme-plume.vuejs.press/guide/markdown/iconify/"}]]},"readingTime":{"minutes":0.76,"words":227},"git":{"updatedTime":1743080813000,"contributors":[{"name":"zhenghaoyang24","username":"zhenghaoyang24","email":"95458562+zhenghaoyang24@users.noreply.github.com","commits":1,"avatar":"https://avatars.githubusercontent.com/zhenghaoyang24?v=4","url":"https://github.com/zhenghaoyang24"},{"name":"pengzhanbo","username":"pengzhanbo","email":"volodymyr@foxmail.com","commits":1,"avatar":"https://avatars.githubusercontent.com/pengzhanbo?v=4","url":"https://github.com/pengzhanbo"}],"changelog":[{"hash":"9f99ae3ca72b3085c6cd383a9084f42be299c400","time":1743080813000,"email":"95458562+zhenghaoyang24@users.noreply.github.com","author":"zhenghaoyang24","message":"docs: add en <code>markdown</code> doc (#538)","coAuthors":[{"name":"pengzhanbo","email":"volodymyr@foxmail.com"}]}]},"autoDesc":true,"filePathRelative":"en/notes/theme/guide/markdown/icons.md","headers":[],"bulletin":false}');export{v as comp,b as data};
