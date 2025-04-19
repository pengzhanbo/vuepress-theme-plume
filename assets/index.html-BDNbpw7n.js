import{_ as d,c as r,d as i,a as t,e as a,b as n,w as l,r as p,o}from"./app-BMManW_d.js";const g={},m={class:"demo-wrapper"},y={class:"demo-container"},u={class:"code-block-title"},v={class:"code-block-title-bar"},D={class:"title"},A={class:"demo-wrapper"},f={class:"demo-container"};function c(b,s){const e=p("Plot"),h=p("VPIcon"),k=p("RouteLink");return o(),r("div",null,[s[27]||(s[27]=i("h2",{id:"概述",tabindex:"-1"},[i("a",{class:"header-anchor",href:"#概述"},[i("span",null,"概述")])],-1)),s[28]||(s[28]=i("p",null,"有时候，你不想直接把文本内容毫无保留的展示出来，想要保留一些 隐秘性， 可能是为了引起读者的好奇心，也可能纯粹是故意增加点阅读障碍，让文章变得更加有趣。",-1)),s[29]||(s[29]=i("p",null,[a("为了满足这种小小的心思，主题提供了一个 "),i("strong",null,"“隐秘”文本"),a(" 的有趣小功能。它看起来像这样：")],-1)),i("div",m,[s[7]||(s[7]=i("div",{class:"demo-head"},[i("div",{class:"demo-ctrl"},[i("i"),i("i"),i("i")])],-1)),i("div",y,[i("p",null,[s[3]||(s[3]=a("你知道吗， ")),n(e,null,{default:l(()=>s[0]||(s[0]=[a("鲁迅")])),_:1}),s[4]||(s[4]=a(" 曾说过：“ ")),n(e,null,{default:l(()=>s[1]||(s[1]=[a("我没说过这句话！")])),_:1}),s[5]||(s[5]=a(" ” 令我醍醐灌顶，深受启发，浑身迸发出无可匹敌的 力量！于是，")),n(e,null,{default:l(()=>s[2]||(s[2]=[a("我在床上翻了个身")])),_:1}),s[6]||(s[6]=a(" ！"))])])]),s[30]||(s[30]=i("p",null,"读者不能直接阅读到完整的内容，部分的内容被 “遮住”，需要鼠标悬停到内容上，才能看到被遮住的内容。",-1)),s[31]||(s[31]=i("h2",{id:"配置",tabindex:"-1"},[i("a",{class:"header-anchor",href:"#配置"},[i("span",null,"配置")])],-1)),s[32]||(s[32]=i("p",null,[a("该功能默认不启用，你需要在 "),i("code",null,"theme"),a(" 配置中启用。")],-1)),i("div",u,[i("div",v,[i("span",D,[n(h,{name:"vscode-icons:file-type-typescript"}),s[8]||(s[8]=a(".vuepress/config.ts"))])]),s[9]||(s[9]=t(`<div class="language-ts" data-highlighter="shiki" data-ext="ts" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark has-diff vp-code"><code><span class="line"><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">export</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;"> default</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;"> defineUserConfig</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">({</span></span>
<span class="line"><span style="--shiki-light:#998418;--shiki-dark:#B8A965;">  theme</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">: </span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">plumeTheme</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">({</span></span>
<span class="line"><span style="--shiki-light:#998418;--shiki-dark:#B8A965;">    markdown</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">: {</span></span>
<span class="line diff add"><span style="--shiki-light:#998418;--shiki-dark:#B8A965;">      plot</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">: </span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">true</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">, </span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">    }</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">  })</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">})</span></span></code></pre></div>`,1))]),s[33]||(s[33]=t(`<p><code>markdownPower.plot</code> 支持传入 <code>boolean | PlotOptions</code> 类型</p><div class="language-ts line-numbers-mode" data-highlighter="shiki" data-ext="ts" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">interface</span><span style="--shiki-light:#2E8F82;--shiki-dark:#5DA994;"> PlotOptions</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> {</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  /**</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">   * 是否启用 \`!! !!\`  markdown （该标记为非标准标记，脱离插件将不生效）</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">   * 如果设置为 false， 则表示不启用该标记，只能使用 &lt;Plot /&gt; 组件</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">   * </span><span style="--shiki-light:#999999;--shiki-dark:#666666;">@</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">default</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> true</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">   */</span></span>
<span class="line"><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">  tag</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">?</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">: </span><span style="--shiki-light:#2E8F82;--shiki-dark:#5DA994;">boolean</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  /**</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">   * 遮罩层颜色</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">   */</span></span>
<span class="line"><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">  mask</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">?</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">: </span><span style="--shiki-light:#2E8F82;--shiki-dark:#5DA994;">string</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> | { </span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">light</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">: </span><span style="--shiki-light:#2E8F82;--shiki-dark:#5DA994;">string</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">, </span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">dark</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">: </span><span style="--shiki-light:#2E8F82;--shiki-dark:#5DA994;">string</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  /**</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">   * 文本颜色</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">   */</span></span>
<span class="line"><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">  color</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">?</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">: </span><span style="--shiki-light:#2E8F82;--shiki-dark:#5DA994;">string</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> | { </span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">light</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">: </span><span style="--shiki-light:#2E8F82;--shiki-dark:#5DA994;">string</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">, </span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">dark</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">: </span><span style="--shiki-light:#2E8F82;--shiki-dark:#5DA994;">string</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">  /**</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">   * 触发方式</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">   *</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">   * </span><span style="--shiki-light:#999999;--shiki-dark:#666666;">@</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">default</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;"> &#39;</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">hover</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">   */</span></span>
<span class="line"><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;">  trigger</span><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">?</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">: </span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">hover</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> | </span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">click</span><span style="--shiki-light:#B5695977;--shiki-dark:#C98A7D77;">&#39;</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="语法" tabindex="-1"><a class="header-anchor" href="#语法"><span>语法</span></a></h2><div class="language-md" data-highlighter="shiki" data-ext="md" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">!!需要隐秘的内容!!</span></span></code></pre></div>`,4)),i("p",null,[s[11]||(s[11]=a("如果不想使用 非标准的 ")),s[12]||(s[12]=i("code",null,"!! !!",-1)),s[13]||(s[13]=a(" 标记语法，你可以将 ")),s[14]||(s[14]=i("code",null,"plot.tag",-1)),s[15]||(s[15]=a(" 设置为 ")),s[16]||(s[16]=i("code",null,"false",-1)),s[17]||(s[17]=a(" ， 然后使用 ")),n(k,{to:"/notes/theme/guide/components/plot.html"},{default:l(()=>s[10]||(s[10]=[i("code",null,"<Plot />",-1)])),_:1}),s[18]||(s[18]=a(" 组件替代。"))]),s[34]||(s[34]=t(`<h2 id="示例" tabindex="-1"><a class="header-anchor" href="#示例"><span>示例</span></a></h2><p>输入：</p><div class="language-md" data-highlighter="shiki" data-ext="md" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">你知道吗， !!鲁迅!! 曾说过：“ !!我没说过这句话！!! ” 令我醍醐灌顶，深受启发，浑身迸发出无可匹敌的</span></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">力量！于是，!!我在床上翻了个身!! ！</span></span></code></pre></div><p>输出：</p>`,4)),i("div",A,[s[26]||(s[26]=i("div",{class:"demo-head"},[i("div",{class:"demo-ctrl"},[i("i"),i("i"),i("i")])],-1)),i("div",f,[i("p",null,[s[22]||(s[22]=a("你知道吗， ")),n(e,null,{default:l(()=>s[19]||(s[19]=[a("鲁迅")])),_:1}),s[23]||(s[23]=a(" 曾说过：“ ")),n(e,null,{default:l(()=>s[20]||(s[20]=[a("我没说过这句话！")])),_:1}),s[24]||(s[24]=a(" ” 令我醍醐灌顶，深受启发，浑身迸发出无可匹敌的 力量！于是，")),n(e,null,{default:l(()=>s[21]||(s[21]=[a("我在床上翻了个身")])),_:1}),s[25]||(s[25]=a(" ！"))])])])])}const C=d(g,[["render",c]]),E=JSON.parse('{"path":"/guide/markdown/plot/","title":"隐秘文本","lang":"zh-CN","frontmatter":{"title":"隐秘文本","createTime":"2024/09/30 14:45:35","icon":"weui:eyes-off-outlined","permalink":"/guide/markdown/plot/","description":"概述 有时候，你不想直接把文本内容毫无保留的展示出来，想要保留一些 隐秘性， 可能是为了引起读者的好奇心，也可能纯粹是故意增加点阅读障碍，让文章变得更加有趣。 为了满足这种小小的心思，主题提供了一个 “隐秘”文本 的有趣小功能。它看起来像这样： 你知道吗， 曾说过：“ ” 令我醍醐灌顶，深受启发，浑身迸发出无可匹敌的 力量！于是， ！ 读者不能直接阅读...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"隐秘文本\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-15T18:29:30.000Z\\",\\"author\\":[]}"],["meta",{"property":"og:url","content":"https://theme-plume.vuejs.press/guide/markdown/plot/"}],["meta",{"property":"og:site_name","content":"Plume 主题"}],["meta",{"property":"og:title","content":"隐秘文本"}],["meta",{"property":"og:description","content":"概述 有时候，你不想直接把文本内容毫无保留的展示出来，想要保留一些 隐秘性， 可能是为了引起读者的好奇心，也可能纯粹是故意增加点阅读障碍，让文章变得更加有趣。 为了满足这种小小的心思，主题提供了一个 “隐秘”文本 的有趣小功能。它看起来像这样： 你知道吗， 曾说过：“ ” 令我醍醐灌顶，深受启发，浑身迸发出无可匹敌的 力量！于是， ！ 读者不能直接阅读..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:locale:alternate","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2025-03-15T18:29:30.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-15T18:29:30.000Z"}],["link",{"rel":"alternate","hreflang":"en-us","href":"https://theme-plume.vuejs.press/en/guide/markdown/plot/"}]]},"readingTime":{"minutes":1.65,"words":495},"git":{"updatedTime":1742063370000,"contributors":[{"name":"pengzhanbo","username":"pengzhanbo","email":"volodymyr@foxmail.com","commits":2,"avatar":"https://avatars.githubusercontent.com/pengzhanbo?v=4","url":"https://github.com/pengzhanbo"}],"changelog":[{"hash":"0fd6cac57412002f4d72dc10378789b529adc357","time":1742063370000,"email":"volodymyr@foxmail.com","author":"pengzhanbo","message":"refactor(theme): improve types and flat config (#524)"},{"hash":"c177fd6917e42218f71845b91dbc397972334405","time":1727717214000,"email":"volodymyr@foxmail.com","author":"pengzhanbo","message":"docs: improve docs (#240)"}]},"autoDesc":true,"filePathRelative":"notes/theme/guide/markdown/plot.md","headers":[],"bulletin":false}');export{C as comp,E as data};
