import{y as C,K as v,U as E,f as F,W as T,j as w,L as x,c as m,o as k,u as g,d as i,X as U,F as G,h as L,i as S,_ as R,a as c,b as t,e as h,w as O}from"./app-BMManW_d.js";var P="#32A9C3",z="#1B3C4A",r="https://img.shields.io",j="https://github.com",V="https://www.npmjs.com/package",q=Symbol("");function I(l){const e=E(q,F({}));return C(()=>{const s=v(e),a=v(l),o={name:a.name||s.name,repo:a.repo||s.repo,branch:a.branch||s.branch,dir:a.dir||s.dir,type:a.type,color:a.color||s.color,label:a.label,labelColor:a.labelColor||s.labelColor,theme:a.theme||s.theme};return M(o)})}function Z(l){const e=C(()=>{const s=v(l);return{name:s.name,repo:s.repo,branch:s.branch,dir:s.dir,color:s.color,labelColor:s.labelColor,theme:s.theme}});T(q,e)}function M(l){var $;let{name:e="",repo:s="",branch:a="main",dir:o="",type:d,color:y,label:u,labelColor:f,theme:N=""}=l;e=e||(($=s.split("/"))==null?void 0:$[1])||"";const D=encodeURIComponent(e),B=s?`${j}/${s}${o?`/tree/${a}/${o}`:""}`:"",b=`${V}/${e}`,n=new URLSearchParams;switch(d!=="source"&&d!=="stars"&&d!=="forks"&&(n.append("style",N||"flat"),n.append("color",y||P),n.append("labelColor",f||z)),d){case"source":return n.append("logo","github"),n.append("color",f||z),{badgeUrl:`${r}/badge/source-a?${n.toString()}`,link:B,alt:"github source"};case"stars":case"forks":return n.append("style",N||"social"),{badgeUrl:`${r}/github/${d}/${s}?${n.toString()}`,link:B,alt:`github ${d}`};case"license":return{badgeUrl:`${r}/github/license/${s}?${n.toString()}`,link:B,alt:"license"};case"version":return n.append("label",u||e||"npm"),{badgeUrl:`${r}/npm/v/${D}?${n.toString()}`,link:b,alt:"npm version"};case"dt":case"d18m":return n.append("label",u||"downloads"),{badgeUrl:`${r}/npm/d18m/${D}?${n.toString()}`,link:b,alt:"npm downloads"};case"dm":case"dy":case"dw":return n.append("label",u||"downloads"),{badgeUrl:`${r}/npm/${d}/${D}?${n.toString()}`,link:b,alt:"npm downloads"};default:return{badgeUrl:`${r}/badge/unknown?${n.toString()}`,alt:"unknown"}}}const H={class:"vp-npm-badge"},J=["src","alt"],K=["href"],W=["src","alt"],p=w({__name:"NpmBadge",props:{type:{},label:{},name:{},repo:{},branch:{},dir:{},color:{},labelColor:{},theme:{}},setup(l){const e=l,s=I(x(()=>e));return(a,o)=>(k(),m("span",H,[g(s).link?(k(),m("a",{key:1,href:g(s).link,target:"_blank",rel:"noreferrer",class:"no-icon"},[i("img",{src:g(s).badgeUrl,alt:g(s).alt},null,8,W)],8,K)):(k(),m("img",{key:0,src:g(s).badgeUrl,alt:g(s).alt},null,8,J))]))}}),X={class:"vp-npm-badge-group"},Q=w({__name:"NpmBadgeGroup",props:{items:{},name:{},repo:{},branch:{},dir:{},color:{},labelColor:{},theme:{}},setup(l){const e=l;Z(x(()=>e));const s=C(()=>e.items?Array.isArray(e.items)?e.items:e.items.split(",").map(a=>a.trim()):[]);return(a,o)=>(k(),m("p",X,[U(a.$slots,"default",{},()=>[(k(!0),m(G,null,L(s.value,(d,y)=>(k(),S(p,{key:d+y,type:d},null,8,["type"]))),128))],!0)]))}}),A=R(Q,[["__scopeId","data-v-99ebfd11"]]),_={__name:"index.html",setup(l){return(e,s)=>(k(),m("div",null,[s[20]||(s[20]=c(`<h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>Npm 徽章组件 用于显示 npm 包信息，并提供相关的链接。</p><p>徽章由 <a href="https://shields.io" target="_blank" rel="noopener noreferrer">https://shields.io</a> 提供支持。</p><h2 id="使用" tabindex="-1"><a class="header-anchor" href="#使用"><span>使用</span></a></h2><p>使用该组件需要你手动导入 <code>NpmBadge</code> 或 <code>NpmBadgeGroup</code> 组件：</p><div class="language-md" data-highlighter="shiki" data-ext="md" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!-- 在 markdown 中导入 --&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">script</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> setup</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">import</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> NpmBadge</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;"> from</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">vuepress-theme-plume/features/NpmBadge.vue</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span></span>
<span class="line"><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">import</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> NpmBadgeGroup</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;"> from</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">vuepress-theme-plume/features/NpmBadgeGroup.vue</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">script</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!-- 导入后，即可在 markdown 中使用 --&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">NpmBadge</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> name</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">vuepress-theme-plume</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> type</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">dm</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> /&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!-- 并排显示多个 npm badge --&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">NpmBadgeGroup</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> name</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">vuepress-theme-plume</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> items</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">version,dm</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> /&gt;</span></span></code></pre></div>`,6)),t(p,{name:"vuepress-theme-plume",type:"dm"}),t(A,{name:"vuepress-theme-plume",items:"version,dm"}),s[21]||(s[21]=c(`<h2 id="npmbadge" tabindex="-1"><a class="header-anchor" href="#npmbadge"><span><code>&lt;NpmBadge /&gt;</code></span></a></h2><p>单个 npm badge</p><h3 id="props" tabindex="-1"><a class="header-anchor" href="#props"><span>Props</span></a></h3><table><thead><tr><th>名称</th><th>类型</th><th>必填</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td>name</td><td><code>string</code></td><td>否</td><td><code>&#39;&#39;</code></td><td>npm 包名，为空则从 <code>repo</code> 中获取</td></tr><tr><td>repo</td><td><code>string</code></td><td>name 为空时必填</td><td><code>&#39;&#39;</code></td><td>包 github 仓库地址, 格式为 <code>owner/repo</code></td></tr><tr><td>type</td><td><code>NpmBadgeType</code></td><td>是</td><td>-</td><td>徽章类型</td></tr><tr><td>theme</td><td><code>NpmBadgeTheme</code></td><td>否</td><td><code>&#39;flat&#39;</code></td><td>徽章主题</td></tr><tr><td>label</td><td><code>string</code></td><td>否</td><td><code>&#39;&#39;</code></td><td>徽章标签</td></tr><tr><td>color</td><td><code>string</code></td><td>否</td><td><code>&#39;#32A9C3&#39;</code></td><td>徽章颜色</td></tr><tr><td>labelColor</td><td><code>string</code></td><td>否</td><td><code>&#39;#1B3C4A&#39;</code></td><td>徽章标签颜色</td></tr><tr><td>branch</td><td><code>string</code></td><td>否</td><td><code>&#39;main&#39;</code></td><td>仓库分支</td></tr><tr><td>dir</td><td><code>string</code></td><td>否</td><td><code>&#39;&#39;</code></td><td>包所在仓库目录，适用于 monorepo 项目</td></tr></tbody></table><h3 id="types" tabindex="-1"><a class="header-anchor" href="#types"><span>Types</span></a></h3><div class="language-ts line-numbers-mode" data-highlighter="shiki" data-ext="ts" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">type</span><span style="--shiki-light:#2E8F82;--shiki-dark:#5DA994;"> NpmBadgeType</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> =</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  // github</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">  |</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">source</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> // github source</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">  |</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">stars</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> // github stars</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">  |</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">forks</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> // github forks</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">  |</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">license</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> // github license</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  // npm</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">  |</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">version</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> // npm version</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">  |</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">dt</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> // alias d18m</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">  |</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">d18m</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> // npm downloads last 18 months</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">  |</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">dw</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> // npm downloads weekly</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">  |</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">dm</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> // npm downloads monthly</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">  |</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">dy</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"> // npm downloads yearly</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">type</span><span style="--shiki-light:#2E8F82;--shiki-dark:#5DA994;"> NpmBadgeTheme</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> =</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">flat</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> |</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">flat-square</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> |</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">plastic</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> |</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">for-the-badge</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> |</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">social</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="示例" tabindex="-1"><a class="header-anchor" href="#示例"><span>示例</span></a></h3>`,7)),i("ul",null,[i("li",null,[s[0]||(s[0]=i("code",null,'<NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="source" />',-1)),s[1]||(s[1]=h(" - ")),t(p,{repo:"pengzhanbo/vuepress-theme-plume",type:"source"})]),i("li",null,[s[2]||(s[2]=i("code",null,'<NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="stars" />',-1)),s[3]||(s[3]=h(" - ")),t(p,{repo:"pengzhanbo/vuepress-theme-plume",type:"stars"})]),i("li",null,[s[4]||(s[4]=i("code",null,'<NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="forks" />',-1)),s[5]||(s[5]=h(" - ")),t(p,{repo:"pengzhanbo/vuepress-theme-plume",type:"forks"})]),i("li",null,[s[6]||(s[6]=i("code",null,'<NpmBadge repo="pengzhanbo/vuepress-theme-plume" type="license" />',-1)),s[7]||(s[7]=h(" - ")),t(p,{repo:"pengzhanbo/vuepress-theme-plume",type:"license"})]),i("li",null,[s[8]||(s[8]=i("code",null,'<NpmBadge name="vuepress-theme-plume" type="version" />',-1)),s[9]||(s[9]=h(" - ")),t(p,{repo:"pengzhanbo/vuepress-theme-plume",type:"version"})]),i("li",null,[s[10]||(s[10]=i("code",null,'<NpmBadge name="vuepress-theme-plume" type="dt" />',-1)),s[11]||(s[11]=h(" - ")),t(p,{repo:"pengzhanbo/vuepress-theme-plume",type:"dt"})]),i("li",null,[s[12]||(s[12]=i("code",null,'<NpmBadge name="vuepress-theme-plume" type="d18m" />',-1)),s[13]||(s[13]=h(" - ")),t(p,{repo:"pengzhanbo/vuepress-theme-plume",type:"d18m"})]),i("li",null,[s[14]||(s[14]=i("code",null,'<NpmBadge name="vuepress-theme-plume" type="dy" />',-1)),s[15]||(s[15]=h(" - ")),t(p,{repo:"pengzhanbo/vuepress-theme-plume",type:"dy"})]),i("li",null,[s[16]||(s[16]=i("code",null,'<NpmBadge name="vuepress-theme-plume" type="dm" />',-1)),s[17]||(s[17]=h(" - ")),t(p,{repo:"pengzhanbo/vuepress-theme-plume",type:"dm"})]),i("li",null,[s[18]||(s[18]=i("code",null,'<NpmBadge name="vuepress-theme-plume" type="dw" />',-1)),s[19]||(s[19]=h(" - ")),t(p,{repo:"pengzhanbo/vuepress-theme-plume",type:"dw"})])]),s[22]||(s[22]=c(`<h2 id="npmbadgegroup" tabindex="-1"><a class="header-anchor" href="#npmbadgegroup"><span><code>&lt;NpmBadgeGroup /&gt;</code></span></a></h2><p>组合多个 npm badge</p><h3 id="props-1" tabindex="-1"><a class="header-anchor" href="#props-1"><span>Props</span></a></h3><table><thead><tr><th>名称</th><th>类型</th><th>必填</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td>name</td><td><code>string</code></td><td>否</td><td><code>&#39;&#39;</code></td><td>npm 包名，为空则从 <code>repo</code> 中获取</td></tr><tr><td>repo</td><td><code>string</code></td><td>name 为空时必填</td><td><code>&#39;&#39;</code></td><td>包 github 仓库地址, 格式为 <code>owner/repo</code></td></tr><tr><td>items</td><td><code>string | NpmBadgeType[]</code></td><td>否</td><td>-</td><td>徽章类型列表, 传入 <code>string</code> 时用 <code>&#39;,&#39;</code>分隔，会自动转换为 <code>NpmBadgeType[]</code></td></tr><tr><td>theme</td><td><code>NpmBadgeTheme</code></td><td>否</td><td><code>&#39;&#39;</code></td><td>徽章主题</td></tr><tr><td>color</td><td><code>string</code></td><td>否</td><td><code>&#39;&#39;</code></td><td>徽章颜色</td></tr><tr><td>labelColor</td><td><code>string</code></td><td>否</td><td><code>&#39;&#39;</code></td><td>徽章标签颜色</td></tr><tr><td>branch</td><td><code>string</code></td><td>否</td><td><code>&#39;&#39;</code></td><td>仓库分支</td></tr><tr><td>dir</td><td><code>string</code></td><td>否</td><td><code>&#39;&#39;</code></td><td>包所在仓库目录，适用于 monorepo 项目</td></tr></tbody></table><h3 id="slots" tabindex="-1"><a class="header-anchor" href="#slots"><span>Slots</span></a></h3><p><code>&lt;NpmBadgeGroup /&gt;</code> 支持传入 多个 <code>&lt;NpmBadge /&gt;</code> 组件。</p><p><code>&lt;NpmBadgeGroup /&gt;</code> 声明的 <code>Props</code> 将被注入到 <code>&lt;NpmBadge /&gt;</code> 组件中。通过这种方式来实现和简化徽章组合。</p><h3 id="示例-1" tabindex="-1"><a class="header-anchor" href="#示例-1"><span>示例</span></a></h3><p><strong>输入：</strong></p><div class="language-md" data-highlighter="shiki" data-ext="md" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">NpmBadgeGroup</span></span>
<span class="line"><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">  repo</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">pengzhanbo/vuepress-theme-plume</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">  items</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">stars,version,dm,source</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">/&gt;</span></span></code></pre></div><p><strong>输出：</strong></p>`,11)),t(A,{repo:"pengzhanbo/vuepress-theme-plume",items:"stars,version,dm,source"}),s[23]||(s[23]=c(`<p>使用 <code>&lt;slot /&gt;</code> 灵活定义徽章组合：</p><p><strong>输入：</strong></p><div class="language-md" data-highlighter="shiki" data-ext="md" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">NpmBadgeGroup</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> repo</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">pengzhanbo/vuepress-theme-plume</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">  &lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">NpmBadge</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> type</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">stars</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">  &lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">NpmBadge</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> type</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">version</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> label</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">npm</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">  &lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">NpmBadge</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> type</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">dm</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">  &lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">NpmBadge</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> type</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">=</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">source</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&quot;</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">NpmBadgeGroup</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span></code></pre></div><p><strong>输出：</strong></p>`,4)),t(A,{repo:"pengzhanbo/vuepress-theme-plume"},{default:O(()=>[t(p,{type:"stars"}),t(p,{type:"version",label:"npm"}),t(p,{type:"dm"}),t(p,{type:"source"})]),_:1})]))}},ss=JSON.parse('{"path":"/guide/components/npm-badge/","title":"Npm 徽章","lang":"zh-CN","frontmatter":{"title":"Npm 徽章","icon":"akar-icons:npm-fill","createTime":"2024/07/26 22:07:23","permalink":"/guide/components/npm-badge/","description":"概述 Npm 徽章组件 用于显示 npm 包信息，并提供相关的链接。 徽章由 https://shields.io 提供支持。 使用 使用该组件需要你手动导入 NpmBadge 或 NpmBadgeGroup 组件：","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Npm 徽章\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-15T18:29:30.000Z\\",\\"author\\":[]}"],["meta",{"property":"og:url","content":"https://theme-plume.vuejs.press/guide/components/npm-badge/"}],["meta",{"property":"og:site_name","content":"Plume 主题"}],["meta",{"property":"og:title","content":"Npm 徽章"}],["meta",{"property":"og:description","content":"概述 Npm 徽章组件 用于显示 npm 包信息，并提供相关的链接。 徽章由 https://shields.io 提供支持。 使用 使用该组件需要你手动导入 NpmBadge 或 NpmBadgeGroup 组件："}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-15T18:29:30.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-15T18:29:30.000Z"}]]},"readingTime":{"minutes":2.55,"words":766},"git":{"updatedTime":1742063370000,"contributors":[{"name":"pengzhanbo","username":"pengzhanbo","email":"volodymyr@foxmail.com","commits":3,"avatar":"https://avatars.githubusercontent.com/pengzhanbo?v=4","url":"https://github.com/pengzhanbo"}],"changelog":[{"hash":"0fd6cac57412002f4d72dc10378789b529adc357","time":1742063370000,"email":"volodymyr@foxmail.com","author":"pengzhanbo","message":"refactor(theme): improve types and flat config (#524)"},{"hash":"e3b1c3cc531ac9e163ec809c2a3ccdc35b12a4bb","time":1724002416000,"email":"volodymyr@foxmail.com","author":"pengzhanbo","message":"docs: improve docs"},{"hash":"ac8984d050c79f7589830fe6b6cdb8b5e4ef3ed2","time":1722079433000,"email":"volodymyr@foxmail.com","author":"pengzhanbo","message":"docs: update docs"}]},"autoDesc":true,"filePathRelative":"notes/theme/guide/components/npm-badge.md","headers":[],"bulletin":false}');export{_ as comp,ss as data};
