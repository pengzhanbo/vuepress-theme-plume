import{_ as c,c as g,a as p,b as l,d as s,w as a,e as i,r as k,o as u}from"./app-BMManW_d.js";const m={},f={class:"code-block-title"},y={class:"code-block-title-bar"},b={class:"title"};function v(A,e){const r=k("VPIcon"),o=k("CodeTabs"),t=k("FlowChart"),n=k("MdDemo");return u(),g("div",null,[e[17]||(e[17]=p('<h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>主题支持在 文章中 嵌入由 <a href="http://flowchart.js.org/" target="_blank" rel="noopener noreferrer">flowchart</a> 。</p><p>该功能由 <a href="https://plugin-md-enhance.vuejs.press/" target="_blank" rel="noopener noreferrer">vuepress-plugin-md-enhance</a> 提供支持。</p><h2 id="配置" tabindex="-1"><a class="header-anchor" href="#配置"><span>配置</span></a></h2><p>主题默认不启用该功能。</p><p>你需要在你的项目中安装 <a href="http://flowchart.js.org/" target="_blank" rel="noopener noreferrer">flowchart.ts</a> 库。</p>',6)),l(o,{id:"0",data:[{id:"pnpm"},{id:"yarn"},{id:"npm"}],"tab-id":"npm-to-pnpm-yarn-npm"},{title0:a(({value:h,isActive:d})=>[l(r,{name:"vscode-icons:file-type-light-pnpm"}),e[0]||(e[0]=s("span",null,"pnpm",-1))]),title1:a(({value:h,isActive:d})=>[l(r,{name:"vscode-icons:file-type-yarn"}),e[1]||(e[1]=s("span",null,"yarn",-1))]),title2:a(({value:h,isActive:d})=>[l(r,{name:"logos:npm-icon"}),e[2]||(e[2]=s("span",null,"npm",-1))]),tab0:a(({value:h,isActive:d})=>e[3]||(e[3]=[s("div",{class:"language-sh","data-highlighter":"shiki","data-ext":"sh",style:{"--shiki-light":"#393a34","--shiki-dark":"#dbd7caee","--shiki-light-bg":"#ffffff","--shiki-dark-bg":"#121212"}},[s("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}},"pnpm"),s("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}}," add"),s("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}}," flowchart.ts")])])])],-1)])),tab1:a(({value:h,isActive:d})=>e[4]||(e[4]=[s("div",{class:"language-sh","data-highlighter":"shiki","data-ext":"sh",style:{"--shiki-light":"#393a34","--shiki-dark":"#dbd7caee","--shiki-light-bg":"#ffffff","--shiki-dark-bg":"#121212"}},[s("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}},"yarn"),s("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}}," add"),s("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}}," flowchart.ts")])])])],-1)])),tab2:a(({value:h,isActive:d})=>e[5]||(e[5]=[s("div",{class:"language-sh","data-highlighter":"shiki","data-ext":"sh",style:{"--shiki-light":"#393a34","--shiki-dark":"#dbd7caee","--shiki-light-bg":"#ffffff","--shiki-dark-bg":"#121212"}},[s("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}},"npm"),s("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}}," install"),s("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}}," flowchart.ts")])])])],-1)])),_:1}),e[18]||(e[18]=s("p",null,[i("然后在 "),s("code",null,".vuepress/config.ts"),i(" 配置文件中，启用该功能：")],-1)),s("div",f,[s("div",y,[s("span",b,[l(r,{name:"vscode-icons:file-type-typescript"}),e[6]||(e[6]=i(".vuepress/config.ts"))])]),e[7]||(e[7]=p(`<div class="language-ts" data-highlighter="shiki" data-ext="ts" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark has-diff vp-code"><code><span class="line"><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">export</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;"> default</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;"> defineUserConfig</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">({</span></span>
<span class="line"><span style="--shiki-light:#998418;--shiki-dark:#B8A965;">  theme</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">: </span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">plumeTheme</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">({</span></span>
<span class="line"><span style="--shiki-light:#998418;--shiki-dark:#B8A965;">    markdown</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">: {</span></span>
<span class="line diff add"><span style="--shiki-light:#998418;--shiki-dark:#B8A965;">      flowchart</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">: </span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">true</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">, </span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">    },</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">  })</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">})</span></span></code></pre></div>`,1))]),e[19]||(e[19]=p('<div class="hint-container note"><p class="hint-container-title">注</p><p>以下文档 Fork 自 <a href="https://theme-hope.vuejs.press/zh/guide/markdown/chart/flowchart.html" target="_blank" rel="noopener noreferrer">vuepress-theme-hope</a>, 遵循 <a href="https://github.com/vuepress-theme-hope/vuepress-theme-hope/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT</a> 许可证。</p></div><h2 id="语法" tabindex="-1"><a class="header-anchor" href="#语法"><span>语法</span></a></h2><div class="language-md" data-highlighter="shiki" data-ext="md" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;">&lt;!------- ↓ :preset 是可选的 --&gt;</span></span>\n<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">```</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">flow:preset</span></span>\n<span class="line"></span>\n<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">&lt;!-- 放置你的流程图代码 --&gt;</span></span>\n<span class="line"></span>\n<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">```</span></span></code></pre></div><p>目前可用的预设:</p><ul><li>vue (默认)</li><li>ant</li><li>pie</li></ul><h2 id="演示" tabindex="-1"><a class="header-anchor" href="#演示"><span>演示</span></a></h2>',6)),l(n,{title:"Vue 主题",id:"md-demo-57"},{default:a(()=>[l(t,{id:"flowchart-59",code:"eJx1UE1Lw0AQve+vyLGCSUiOgaw/RDykyTRdjbvLZtIg5NCjUEsLBRG0iCDqpXj3A/+MSfsznMQiHtrLwJuZN++9yTHkOUYGA6v+GNfPk0pHOQZ8iKgD1y3L0kmVSjNwYnV+3M8ieXbCIOQgk8Bavy+a5X01KLAwsIfDlPZCrjSYCIWSgdUspt+fd16nQ0N/x9Cv4sIYkMjyok9sqkYVKCSQy9V8/TKp32aVkKMoEwmLlUxC3laxPXLz6tbzp6Mq0tqoEST7rMUk/o9XXz421yu/MnAKMULChAq5kLpAEqcaWJuv283DVT2bNuOl4zjb5IzlaFMKr2dEOsQDuzva+epdQH5o/bX936ZUBNpovQwG7YC4ZKZdJiCUzaGF3Rp9qIU/mOynsw==",preset:"vue"})]),code:a(()=>e[8]||(e[8]=[s("div",{class:"language-md line-numbers-mode","data-highlighter":"shiki","data-ext":"md",style:{"--shiki-light":"#393a34","--shiki-dark":"#dbd7caee","--shiki-light-bg":"#ffffff","--shiki-dark-bg":"#121212"}},[s("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"```"),s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"flow")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"st=>start: 开始|past:>http://www.google.com[blank]")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"e=>end: 结束|future:>http://www.google.com")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"op1=>operation: 操作1|past")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"op2=>operation: 操作2|current")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"sub1=>subroutine: 子程序|invalid")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"cond=>condition: 是/否?|approved:>http://www.google.com")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"c2=>condition: 判断2|rejected")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"io=>inputoutput: 进行反思...|future")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"st->op1(right)->cond")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"cond(yes, right)->c2")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"cond(no)->sub1(left)->op1")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"c2(yes)->io->e")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"c2(no)->op2->e")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"```")])])]),s("div",{class:"line-numbers","aria-hidden":"true",style:{"counter-reset":"line-number 0"}},[s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"})])],-1)])),_:1}),l(n,{title:"Ant 主题",id:"md-demo-63"},{default:a(()=>[l(t,{id:"flowchart-65",code:"eJx1UE1Lw0AQve+vyLGCSUiOgaw/RDykyTRdjbvLZtIg5NCjUEsLBRG0iCDqpXj3A/+MSfsznMQiHtrLwJuZN++9yTHkOUYGA6v+GNfPk0pHOQZ8iKgD1y3L0kmVSjNwYnV+3M8ieXbCIOQgk8Bavy+a5X01KLAwsIfDlPZCrjSYCIWSgdUspt+fd16nQ0N/x9Cv4sIYkMjyok9sqkYVKCSQy9V8/TKp32aVkKMoEwmLlUxC3laxPXLz6tbzp6Mq0tqoEST7rMUk/o9XXz421yu/MnAKMULChAq5kLpAEqcaWJuv283DVT2bNuOl4zjb5IzlaFMKr2dEOsQDuzva+epdQH5o/bX936ZUBNpovQwG7YC4ZKZdJiCUzaGF3Rp9qIU/mOynsw==",preset:"ant"})]),code:a(()=>e[9]||(e[9]=[s("div",{class:"language-md line-numbers-mode","data-highlighter":"shiki","data-ext":"md",style:{"--shiki-light":"#393a34","--shiki-dark":"#dbd7caee","--shiki-light-bg":"#ffffff","--shiki-dark-bg":"#121212"}},[s("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"```"),s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"flow:ant")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"st=>start: 开始|past:>http://www.google.com[blank]")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"e=>end: 结束|future:>http://www.google.com")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"op1=>operation: 操作1|past")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"op2=>operation: 操作2|current")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"sub1=>subroutine: 子程序|invalid")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"cond=>condition: 是/否?|approved:>http://www.google.com")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"c2=>condition: 判断2|rejected")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"io=>inputoutput: 进行反思...|future")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"st->op1(right)->cond")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"cond(yes, right)->c2")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"cond(no)->sub1(left)->op1")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"c2(yes)->io->e")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"c2(no)->op2->e")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"```")])])]),s("div",{class:"line-numbers","aria-hidden":"true",style:{"counter-reset":"line-number 0"}},[s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"})])],-1)])),_:1}),l(n,{title:"Pie 主题",id:"md-demo-69"},{default:a(()=>[l(t,{id:"flowchart-71",code:"eJx1UE1Lw0AQve+vyLGCSUiOgaw/RDykyTRdjbvLZtIg5NCjUEsLBRG0iCDqpXj3A/+MSfsznMQiHtrLwJuZN++9yTHkOUYGA6v+GNfPk0pHOQZ8iKgD1y3L0kmVSjNwYnV+3M8ieXbCIOQgk8Bavy+a5X01KLAwsIfDlPZCrjSYCIWSgdUspt+fd16nQ0N/x9Cv4sIYkMjyok9sqkYVKCSQy9V8/TKp32aVkKMoEwmLlUxC3laxPXLz6tbzp6Mq0tqoEST7rMUk/o9XXz421yu/MnAKMULChAq5kLpAEqcaWJuv283DVT2bNuOl4zjb5IzlaFMKr2dEOsQDuzva+epdQH5o/bX936ZUBNpovQwG7YC4ZKZdJiCUzaGF3Rp9qIU/mOynsw==",preset:"pie"})]),code:a(()=>e[10]||(e[10]=[s("div",{class:"language-md line-numbers-mode","data-highlighter":"shiki","data-ext":"md",style:{"--shiki-light":"#393a34","--shiki-dark":"#dbd7caee","--shiki-light-bg":"#ffffff","--shiki-dark-bg":"#121212"}},[s("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"```"),s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"flow:pie")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"st=>start: 开始|past:>http://www.google.com[blank]")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"e=>end: 结束|future:>http://www.google.com")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"op1=>operation: 操作1|past")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"op2=>operation: 操作2|current")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"sub1=>subroutine: 子程序|invalid")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"cond=>condition: 是/否?|approved:>http://www.google.com")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"c2=>condition: 判断2|rejected")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"io=>inputoutput: 进行反思...|future")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"st->op1(right)->cond")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"cond(yes, right)->c2")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"cond(no)->sub1(left)->op1")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"c2(yes)->io->e")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"c2(no)->op2->e")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"```")])])]),s("div",{class:"line-numbers","aria-hidden":"true",style:{"counter-reset":"line-number 0"}},[s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"}),s("div",{class:"line-number"})])],-1)])),_:1}),e[20]||(e[20]=p('<h2 id="流程图介绍" tabindex="-1"><a class="header-anchor" href="#流程图介绍"><span>流程图介绍</span></a></h2><h3 id="节点类型" tabindex="-1"><a class="header-anchor" href="#节点类型"><span>节点类型</span></a></h3><p>定义了结点形状。</p><h4 id="开始-结束" tabindex="-1"><a class="header-anchor" href="#开始-结束"><span>开始 &amp; 结束</span></a></h4><ul><li><p><code>[Variable]-&gt;start: [Text]</code></p><p>被用于流程开始的第一个节点。 默认文字为 <code>Start</code>.</p></li><li><p><code>[Variable]-&gt;end: [Text]</code></p><p>被用于流程结束的最后一个节点。 默认文字为 <code>End</code>.</p></li></ul>',5)),l(n,{title:"开始 & 结束",id:"md-demo-105"},{default:a(()=>[l(t,{id:"flowchart-107",code:"eJwrLrG1Ky5JLCqxUni6p+Hp8m6uVFu71LwUK4Xnuyc/mzufi6u4RNculQsAZJUQyg==",preset:"vue"})]),code:a(()=>e[11]||(e[11]=[s("div",{class:"language-md","data-highlighter":"shiki","data-ext":"md",style:{"--shiki-light":"#393a34","--shiki-dark":"#dbd7caee","--shiki-light-bg":"#ffffff","--shiki-dark-bg":"#121212"}},[s("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"```"),s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"flow")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"st=>start: 开始")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"e=>end: 结束")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"st->e")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"```")])])])],-1)])),_:1}),e[21]||(e[21]=s("h4",{id:"操作",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#操作"},[s("span",null,"操作")])],-1)),e[22]||(e[22]=s("p",null,[s("code",null,"[Variable]->operation: [Text]")],-1)),l(n,{title:"操作",id:"md-demo-117"},{default:a(()=>[l(t,{id:"flowchart-119",code:"eJwrKMpPTi0utrXLL0gtSizJzM+zUng2uffJ3jlcqbZ2qXkpVgrPd09+Nnc+FxdUqa5dKhcAfbsWqA==",preset:"vue"})]),code:a(()=>e[12]||(e[12]=[s("div",{class:"language-md","data-highlighter":"shiki","data-ext":"md",style:{"--shiki-light":"#393a34","--shiki-dark":"#dbd7caee","--shiki-light-bg":"#ffffff","--shiki-dark-bg":"#121212"}},[s("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"```"),s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"flow")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"process=>operation: 操作")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"e=>end: 结束")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"process->e")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"```")])])])],-1)])),_:1}),e[23]||(e[23]=s("h4",{id:"输入输出",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#输入输出"},[s("span",null,"输入输出")])],-1)),e[24]||(e[24]=s("p",null,[s("code",null,"[Variable]->inputoutput: [Text]")],-1)),l(n,{title:"输入输出",id:"md-demo-129"},{default:a(()=>[l(t,{id:"flowchart-131",code:"eJwrKMpPTi0utrXLzCsoLckvLQGSVgov9k1+2roURLbv4kq1tUvNS7FSeL578rO587m4oFp07VK5AI5GHBw=",preset:"vue"})]),code:a(()=>e[13]||(e[13]=[s("div",{class:"language-md","data-highlighter":"shiki","data-ext":"md",style:{"--shiki-light":"#393a34","--shiki-dark":"#dbd7caee","--shiki-light-bg":"#ffffff","--shiki-dark-bg":"#121212"}},[s("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"```"),s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"flow")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"process=>inputoutput: 输入输出")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"e=>end: 结束")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"process->e")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"```")])])])],-1)])),_:1}),e[25]||(e[25]=s("h4",{id:"子程序",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#子程序"},[s("span",null,"子程序")])],-1)),e[26]||(e[26]=s("p",null,[s("code",null,"[Variable]->subroutine: [Text]")],-1)),l(n,{title:"子程序",id:"md-demo-141"},{default:a(()=>[l(t,{id:"flowchart-143",code:"eJwrKMpPTi0utrUrLk0qyi8tycxLtVJ4unbC8xXdT3f1c6Xa2qXmpVgpPN89+dnc+VxcUOW6dqlcAP5nGU4=",preset:"vue"})]),code:a(()=>e[14]||(e[14]=[s("div",{class:"language-md","data-highlighter":"shiki","data-ext":"md",style:{"--shiki-light":"#393a34","--shiki-dark":"#dbd7caee","--shiki-light-bg":"#ffffff","--shiki-dark-bg":"#121212"}},[s("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"```"),s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"flow")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"process=>subroutine: 子程序")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"e=>end: 结束")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"process->e")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"```")])])])],-1)])),_:1}),e[27]||(e[27]=s("h4",{id:"条件",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#条件"},[s("span",null,"条件")])],-1)),e[28]||(e[28]=s("ul",null,[s("li",null,[s("p",null,[s("code",null,"[Variable]->condition: [Text]")])]),s("li",null,[s("p",null,[s("code",null,"[Variable]([yesText])->[Position]")])]),s("li",null,[s("p",null,[s("code",null,"[Variable]([noText])->[Position]")])])],-1)),l(n,{title:"条件",id:"md-demo-167"},{default:a(()=>[l(t,{id:"flowchart-169",code:"eJxLzs9LsbUDkZklmfl5VgrPZqx/OmHZs87lLxb2PJvc+2TvHHuugqL85NTiYlu7/ILUokSoOrAcV6qtXWpeipXC892Tn82dz8UFMkmjMrVYU9cOqkvXLhUimpcPFEzlAgD7FTFE",preset:"vue"})]),code:a(()=>e[15]||(e[15]=[s("div",{class:"language-md","data-highlighter":"shiki","data-ext":"md",style:{"--shiki-light":"#393a34","--shiki-dark":"#dbd7caee","--shiki-light-bg":"#ffffff","--shiki-dark-bg":"#121212"}},[s("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"```"),s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"flow")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"cond=>condition: 是否执行操作?")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"process=>operation: 操作")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"e=>end: 结束")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"cond(yes)->process->e")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"cond(no)->e")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"```")])])])],-1)])),_:1}),e[29]||(e[29]=s("h4",{id:"平行",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#平行"},[s("span",null,"平行")])],-1)),e[30]||(e[30]=s("p",null,"定义同时开始的多个程序。",-1)),e[31]||(e[31]=s("ul",null,[s("li",null,[s("code",null,"[Variable]->parallel: [Text]")]),s("li",null,[s("code",null,"[Variable](path1, direction)->[Position]")]),s("li",null,[s("code",null,"[Variable](path1, direction)->[Position]")])],-1)),l(n,{title:"平行",id:"md-demo-196"},{default:a(()=>[l(t,{id:"flowchart-198",code:"eJwrSCxKtLUDkTk5qTlWCk93bn6xsOfJ7t1PuxZyFRTlJ6cWF9va5RekFiWWZObnWSk8m9z7ZO8crlRbu9S8FCuF57snP5s7n4sLZIJGQWJJhqGOQlJ+SUl+rqauHVS/rl0qQt4IKJ7KBQB5mDEV",preset:"vue"})]),code:a(()=>e[16]||(e[16]=[s("div",{class:"language-md","data-highlighter":"shiki","data-ext":"md",style:{"--shiki-light":"#393a34","--shiki-dark":"#dbd7caee","--shiki-light-bg":"#ffffff","--shiki-dark-bg":"#121212"}},[s("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code"},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"```"),s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"flow")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"para=>parallel: 平行任务")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"process=>operation: 操作")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"e=>end: 结束")]),i(`
`),s("span",{class:"line"}),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"para(path1, bottom)->process->e")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"para(path2)->e")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"```")])])])],-1)])),_:1}),e[32]||(e[32]=p(`<h3 id="链接" tabindex="-1"><a class="header-anchor" href="#链接"><span>链接</span></a></h3><p>连接方式在流程图中节点定义后描述，使用 <code>-&gt;</code> 指定一个节点之间的链接，例如 <code>nodeVar1-&gt;nodeVar2-&gt;nodeVar3</code></p><p>流程可以被分开:</p><div class="language-md" data-highlighter="shiki" data-ext="md" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">nodeVar1-&gt;nodeVar2</span></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">nodeVar2-&gt;nodeVar3</span></span></code></pre></div><p>连接格式定义如下:</p><p><code>&lt;node variable name&gt;[(&lt;specification1&gt;[, &lt;specification2])]-&gt;&lt;node variable name&gt;[[(&lt;specification1&gt;[, &lt;specification2])]-&gt;&lt;node variable name&gt;]</code></p><p>在 <code>[]</code> 中的项是可选的。</p><h3 id="方向" tabindex="-1"><a class="header-anchor" href="#方向"><span>方向</span></a></h3><p>以下方向可用，并定义了连接将从节点离开的方向。如果指定符不止一个，则总是最后一个。所有节点都有默认方向，这使其成为可选规范。<code>&lt;direction&gt;</code> 的可选值为:</p><ul><li><code>left</code></li><li><code>right</code></li><li><code>top</code></li><li><code>bottom</code></li></ul><h3 id="节点特定说明符" tabindex="-1"><a class="header-anchor" href="#节点特定说明符"><span>节点特定说明符</span></a></h3><p>每个节点变量都有可选的说明符，例如方向，有些变量有特殊的说明符，具体取决于下面定义的节点类型。在 <code>()</code> 中的变量名后添加说明符，并用<code>,</code> 分隔，例如 <code>nodeVar (spec1，spec2)</code>。</p><ul><li><p><strong>start</strong><strong>operation</strong><strong>inputoutput</strong><strong>subroutine</strong></p><p>可选方向</p><p><code>startVar(&lt;direction&gt;)-&gt;nextNode</code></p><p><code>operationVar(&lt;direction&gt;)-&gt;nextNode</code></p><p><code>inputoutputVar(&lt;direction&gt;)-&gt;nextNode</code></p><p><code>subroutineVar(&lt;direction&gt;)-&gt;nextNode</code></p></li><li><p><strong>condition</strong></p><p>必需指定 <code>yes</code> or <code>no</code></p><p>可选方向</p><div class="language-md" data-highlighter="shiki" data-ext="md" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">conditionalVar(yes, </span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">direction</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">)-&gt;nextNode1</span></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">conditionalVar(no, </span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">direction</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">)-&gt;nextNode2</span></span></code></pre></div></li><li><p><strong>parallel</strong></p><p>必需指定路径方向 <code>path1</code>, <code>path2</code>, 或 <code>path3</code></p><p>可选方向</p><div class="language-md" data-highlighter="shiki" data-ext="md" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">parallelVar(path1, </span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">direction</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">)-&gt;nextNode1</span></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">parallelVar(path2, </span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">direction</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">)-&gt;nextNode2</span></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">parallelVar(path3, </span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">direction</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">)-&gt;nextNode3</span></span></code></pre></div></li></ul><h3 id="网址" tabindex="-1"><a class="header-anchor" href="#网址"><span>网址</span></a></h3><p>可以使用 <code>:&gt;</code> 运算符将外部链接添加到节点。</p><p><code>[blank]</code> 指定打开新的页面</p><div class="language-md" data-highlighter="shiki" data-ext="md" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">st=&gt;start: Start:&gt;http://www.google.com</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">[</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">blank</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">]</span></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">e=&gt;end: End:&gt;http://www.yahoo.com</span></span></code></pre></div><h3 id="建议" tabindex="-1"><a class="header-anchor" href="#建议"><span>建议</span></a></h3><p>文本中可能不应该使用的符号: <code>=&gt;</code>、<code>-&gt;</code>、 <code>:&gt;</code>、<code>|</code>、<code>@&gt;</code> 和 <code>:$</code></p><p>如果要在流程图中强调特定路径，则可以另外定义它，如下所示:</p><div class="language-" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span>st@&gt;op1({&quot;stroke&quot;:&quot;Red&quot;})@&gt;cond({&quot;stroke&quot;:&quot;Red&quot;,&quot;stroke-width&quot;:6,&quot;arrow-end&quot;:&quot;classic-wide-long&quot;})@&gt;c2({&quot;stroke&quot;:&quot;Red&quot;})@&gt;op2({&quot;stroke&quot;:&quot;Red&quot;})@&gt;e({&quot;stroke&quot;:&quot;Red&quot;})</span></span></code></pre></div>`,21))])}const E=c(m,[["render",v]]),C=JSON.parse('{"path":"/guide/chart/flowchart/","title":"flowchart","lang":"zh-CN","frontmatter":{"title":"flowchart","createTime":"2024/03/16 19:34:31","icon":"f7:flowchart","permalink":"/guide/chart/flowchart/","description":"概述 主题支持在 文章中 嵌入由 flowchart 。 该功能由 vuepress-plugin-md-enhance 提供支持。 配置 主题默认不启用该功能。 你需要在你的项目中安装 flowchart.ts 库。 然后在 .vuepress/config.ts 配置文件中，启用该功能： 注 以下文档 Fork 自 vuepress-theme-h...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"flowchart\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-15T18:29:30.000Z\\",\\"author\\":[]}"],["meta",{"property":"og:url","content":"https://theme-plume.vuejs.press/guide/chart/flowchart/"}],["meta",{"property":"og:site_name","content":"Plume 主题"}],["meta",{"property":"og:title","content":"flowchart"}],["meta",{"property":"og:description","content":"概述 主题支持在 文章中 嵌入由 flowchart 。 该功能由 vuepress-plugin-md-enhance 提供支持。 配置 主题默认不启用该功能。 你需要在你的项目中安装 flowchart.ts 库。 然后在 .vuepress/config.ts 配置文件中，启用该功能： 注 以下文档 Fork 自 vuepress-theme-h..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-15T18:29:30.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-15T18:29:30.000Z"}]]},"readingTime":{"minutes":3.5,"words":1051},"git":{"updatedTime":1742063370000,"contributors":[{"name":"pengzhanbo","username":"pengzhanbo","email":"volodymyr@foxmail.com","commits":5,"avatar":"https://avatars.githubusercontent.com/pengzhanbo?v=4","url":"https://github.com/pengzhanbo"}],"changelog":[{"hash":"0fd6cac57412002f4d72dc10378789b529adc357","time":1742063370000,"email":"volodymyr@foxmail.com","author":"pengzhanbo","message":"refactor(theme): improve types and flat config (#524)"},{"hash":"6e6f9af12cfa52770de67ee966bd15b37c3256dc","time":1740886005000,"email":"volodymyr@foxmail.com","author":"pengzhanbo","message":"docs: improve docs (#509)"},{"hash":"1182f3edc0ba27b7a6eb4827158c106918c9f38a","time":1714643619000,"email":"volodymyr@foxmail.com","author":"pengzhanbo","message":"perf: supplement content MIT protocol"},{"hash":"822d861daef23a289c5e7720cdd7b0beb79b60c1","time":1711040997000,"email":"volodymyr@foxmail.com","author":"pengzhanbo","message":"docs: lint fix md"},{"hash":"2fb3da074776629502acf70e60da06022aa06b61","time":1710691945000,"email":"volodymyr@foxmail.com","author":"pengzhanbo","message":"docs: update theme docs"}]},"autoDesc":true,"filePathRelative":"notes/theme/guide/chart/flowchart.md","headers":[],"bulletin":false}');export{E as comp,C as data};
