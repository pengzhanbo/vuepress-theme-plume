import{_ as p,c as r,a as d,b as h,w as t,d as i,e as s,r as k,o as c}from"./app-Cy8frGxT.js";const g={};function u(y,e){const n=k("VPIcon"),o=k("CodeTabs");return c(),r("div",null,[e[8]||(e[8]=d('<h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>主题通过 <code>&lt;Layout /&gt;</code> 和 <code>&lt;NotFound /&gt;</code> 提供了 丰富的 布局插槽，可以通过这些插槽，在 页面 的不同位置注入内容。 以便用户可以个性化的使用主题。</p><h2 id="使用" tabindex="-1"><a class="header-anchor" href="#使用"><span>使用</span></a></h2><p>以 <code>&lt;Layout /&gt;</code> 为例，首先，需要创建一个 客户端配置文件： <code>.vuepress/client.ts</code>:</p>',4)),h(o,{id:"12",data:[{id:".vuepress/client.ts"}]},{title0:t(({value:a,isActive:l})=>[h(n,{name:"vscode-icons:file-type-typescript"}),e[0]||(e[0]=i("span",null,".vuepress/client.ts",-1))]),tab0:t(({value:a,isActive:l})=>e[1]||(e[1]=[i("div",{class:"language-ts","data-ext":"ts","data-title":"ts"},[i("button",{class:"copy",title:"复制代码","data-copied":"已复制"}),i("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"import"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}}," {"),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}}," defineClientConfig"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}}," }"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}}," from"),i("span",{style:{"--shiki-light":"#B5695977","--shiki-dark":"#C98A7D77"}}," '"),i("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}},"vuepress/client"),i("span",{style:{"--shiki-light":"#B5695977","--shiki-dark":"#C98A7D77"}},"'")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"import"),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}}," Layout"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}}," from"),i("span",{style:{"--shiki-light":"#B5695977","--shiki-dark":"#C98A7D77"}}," '"),i("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}},"./layouts/Layout.vue"),i("span",{style:{"--shiki-light":"#B5695977","--shiki-dark":"#C98A7D77"}},"'")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"export"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}}," default"),i("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}}," defineClientConfig"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"({")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#998418","--shiki-dark":"#B8A965"}},"  layouts"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},": {")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}},"    Layout"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},",")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"  },")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"})")])])])],-1)])),_:1}),e[9]||(e[9]=d('<div class="hint-container info"><p class="hint-container-title">相关信息</p><p><code>layouts</code> 中的 <code>Layout</code> 名是固定的，这是 js 的简写语法， 实际上为 <code>Layout: Layout</code>，它是实现 布局插槽的关键。 <code>NotFound</code> 也是相同的规则。</p><p>你传入的其它非 <code>Layout</code> / <code>NotFound</code> 的组件，被认为是自定义布局组件。</p></div><p>然后，创建一个 <code>.vuepress/layouts/Layout.vue</code>，作为布局插槽的默认组件，在该组件中引入 当前主题的 <code>&lt;Layout /&gt;</code> 组件。</p>',2)),h(o,{id:"28",data:[{id:".vuepress/layouts/Layout.vue"}]},{title0:t(({value:a,isActive:l})=>[h(n,{name:"vscode-icons:file-type-vue"}),e[2]||(e[2]=i("span",null,".vuepress/layouts/Layout.vue",-1))]),tab0:t(({value:a,isActive:l})=>e[3]||(e[3]=[i("div",{class:"language-vue line-numbers-mode","data-ext":"vue","data-title":"vue"},[i("button",{class:"copy",title:"复制代码","data-copied":"已复制"}),i("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark has-highlighted vp-code"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"<"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"script"),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}}," setup"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},">")]),s(`
`),i("span",{class:"line highlighted"},[i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"import"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}}," {"),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}}," Layout"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}}," }"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}}," from"),i("span",{style:{"--shiki-light":"#B5695977","--shiki-dark":"#C98A7D77"}}," '"),i("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}},"vuepress-theme-plume/client"),i("span",{style:{"--shiki-light":"#B5695977","--shiki-dark":"#C98A7D77"}},"'")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"</"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"script"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},">")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"<"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"template"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},">")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"  <"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"Layout"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},">")]),s(`
`),i("span",{class:"line highlighted"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"    <"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"template"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}}," #"),i("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}},"page-bottom"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},">")]),s(`
`),i("span",{class:"line highlighted"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"      <"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"div"),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}}," class"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"="),i("span",{style:{"--shiki-light":"#B5695977","--shiki-dark":"#C98A7D77"}},'"'),i("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}},"custom-content"),i("span",{style:{"--shiki-light":"#B5695977","--shiki-dark":"#C98A7D77"}},'"'),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},">")]),s(`
`),i("span",{class:"line highlighted"},[i("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"        自定义内容")]),s(`
`),i("span",{class:"line highlighted"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"      </"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"div"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},">")]),s(`
`),i("span",{class:"line highlighted"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"    </"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"template"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},">")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"  </"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"Layout"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},">")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"</"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"template"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},">")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"<"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"style"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},">")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"."),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}},"custom-content"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}}," {")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#998418","--shiki-dark":"#B8A965"}},"  width"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},":"),i("span",{style:{"--shiki-light":"#2F798A","--shiki-dark":"#4C9A91"}}," 100"),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"%"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},";")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"}")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"</"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"style"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},">")])])]),i("div",{class:"line-numbers","aria-hidden":"true",style:{"counter-reset":"line-number 0"}},[i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"})])],-1)])),_:1}),e[10]||(e[10]=i("p",null,[s("也可以使用 渲染函数 实现注入内容，在 "),i("code",null,".vuepress/client.ts"),s(" 中：")],-1)),h(o,{id:"36",data:[{id:".vuepress/client.ts"},{id:".vuepress/components/CustomContent.vue"}]},{title0:t(({value:a,isActive:l})=>[h(n,{name:"vscode-icons:file-type-typescript"}),e[4]||(e[4]=i("span",null,".vuepress/client.ts",-1))]),title1:t(({value:a,isActive:l})=>[h(n,{name:"vscode-icons:file-type-vue"}),e[5]||(e[5]=i("span",null,".vuepress/components/CustomContent.vue",-1))]),tab0:t(({value:a,isActive:l})=>e[6]||(e[6]=[i("div",{class:"language-ts line-numbers-mode","data-ext":"ts","data-title":"ts"},[i("button",{class:"copy",title:"复制代码","data-copied":"已复制"}),i("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"import"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}}," {"),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}}," h"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}}," }"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}}," from"),i("span",{style:{"--shiki-light":"#B5695977","--shiki-dark":"#C98A7D77"}}," '"),i("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}},"vue"),i("span",{style:{"--shiki-light":"#B5695977","--shiki-dark":"#C98A7D77"}},"'")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"import"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}}," {"),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}}," Layout"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}}," }"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}}," from"),i("span",{style:{"--shiki-light":"#B5695977","--shiki-dark":"#C98A7D77"}}," '"),i("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}},"vuepress-theme-plume/client"),i("span",{style:{"--shiki-light":"#B5695977","--shiki-dark":"#C98A7D77"}},"'")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"import"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}}," {"),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}}," defineClientConfig"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}}," }"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}}," from"),i("span",{style:{"--shiki-light":"#B5695977","--shiki-dark":"#C98A7D77"}}," '"),i("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}},"vuepress/client"),i("span",{style:{"--shiki-light":"#B5695977","--shiki-dark":"#C98A7D77"}},"'")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"import"),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}}," CustomContent"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}}," from"),i("span",{style:{"--shiki-light":"#B5695977","--shiki-dark":"#C98A7D77"}}," '"),i("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}},"./components/CustomContent.vue"),i("span",{style:{"--shiki-light":"#B5695977","--shiki-dark":"#C98A7D77"}},"'")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"export"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}}," default"),i("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}}," defineClientConfig"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"({")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#998418","--shiki-dark":"#B8A965"}},"  layouts"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},": {")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}},"    Layout"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},": () => "),i("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}},"h"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"("),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}},"Layout"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},", "),i("span",{style:{"--shiki-light":"#AB5959","--shiki-dark":"#CB7676"}},"null"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},", {")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#B5695977","--shiki-dark":"#C98A7D77"}},"      '"),i("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}},"page-bottom"),i("span",{style:{"--shiki-light":"#B5695977","--shiki-dark":"#C98A7D77"}},"'"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},": () => "),i("span",{style:{"--shiki-light":"#59873A","--shiki-dark":"#80A665"}},"h"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"("),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}},"CustomContent"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"),")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"    }),")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"  },")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"})")])])]),i("div",{class:"line-numbers","aria-hidden":"true",style:{"counter-reset":"line-number 0"}},[i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"})])],-1)])),tab1:t(({value:a,isActive:l})=>e[7]||(e[7]=[i("div",{class:"language-vue","data-ext":"vue","data-title":"vue"},[i("button",{class:"copy",title:"复制代码","data-copied":"已复制"}),i("pre",{class:"shiki shiki-themes vitesse-light vitesse-dark vp-code"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"<"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"template"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},">")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"  <"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"div"),i("span",{style:{"--shiki-light":"#B07D48","--shiki-dark":"#BD976A"}}," class"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"="),i("span",{style:{"--shiki-light":"#B5695977","--shiki-dark":"#C98A7D77"}},'"'),i("span",{style:{"--shiki-light":"#B56959","--shiki-dark":"#C98A7D"}},"custom-content"),i("span",{style:{"--shiki-light":"#B5695977","--shiki-dark":"#C98A7D77"}},'"'),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},">")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#393A34","--shiki-dark":"#DBD7CAEE"}},"    Custom Content")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"  </"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"div"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},">")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},"</"),i("span",{style:{"--shiki-light":"#1E754F","--shiki-dark":"#4D9375"}},"template"),i("span",{style:{"--shiki-light":"#999999","--shiki-dark":"#666666"}},">")])])])],-1)])),_:1}),e[11]||(e[11]=d('<h2 id="插槽" tabindex="-1"><a class="header-anchor" href="#插槽"><span>插槽</span></a></h2><h3 id="layout-插槽" tabindex="-1"><a class="header-anchor" href="#layout-插槽"><span><code>&lt;Layout /&gt;</code> 插槽</span></a></h3><ul><li><p>当 <code>pageLayout: doc</code> 时：</p><ul><li><code>doc-top</code></li><li><code>doc-bottom</code></li><li><code>doc-footer-before</code></li><li><code>doc-before</code></li><li><code>doc-after</code></li><li><code>sidebar-nav-before</code></li><li><code>sidebar-nav-after</code></li><li><code>aside-top</code></li><li><code>aside-bottom</code></li><li><code>aside-outline-before</code></li><li><code>aside-outline-after</code></li></ul></li><li><p>当 <code>pageLayout: page</code> 时：</p><ul><li><code>page-top</code></li><li><code>page-bottom</code></li></ul></li><li><p>在 博客页 中 （包括 文章列表页、标签页、归档页 均适用）：</p><ul><li><code>blog-top</code></li><li><code>blog-bottom</code></li><li><code>blog-aside-top</code></li><li><code>blog-aside-bottom</code></li><li><code>blog-extract-before</code></li><li><code>blog-extract-after</code></li></ul></li><li><p>在 博客文章列表页 中：</p><ul><li><code>blog-post-list-before</code></li><li><code>blog-post-list-after</code></li><li><code>blog-post-list-pagination-after</code></li></ul></li><li><p>在 博客标签页 中：</p><ul><li><code>blog-tags-before</code></li><li><code>blog-tags-title-after</code></li><li><code>blog-tags-content-before</code></li><li><code>blog-tags-after</code></li></ul></li><li><p>在 博客归档页 中：</p><ul><li><code>blog-archives-before</code></li><li><code>blog-archives-after</code></li></ul></li><li><p>在 博客分类页 中：</p><ul><li><code>blog-categories-before</code></li><li><code>blog-categories-content-before</code></li><li><code>blog-categories-after</code></li></ul></li></ul><h3 id="notfound-插槽" tabindex="-1"><a class="header-anchor" href="#notfound-插槽"><span><code>&lt;NotFound /&gt;</code> 插槽</span></a></h3><ul><li><code>not-found</code></li></ul><h3 id="通用插槽" tabindex="-1"><a class="header-anchor" href="#通用插槽"><span>通用插槽</span></a></h3><p>以下插槽在 <code>&lt;Layout /&gt;</code> 和 <code>&lt;NotFound /&gt;</code> 中都支持：</p><ul><li><code>layout-top</code></li><li><code>layout-bottom</code></li><li><code>nav-bar-title-before</code></li><li><code>nav-bar-title-after</code></li><li><code>nav-bar-content-before</code></li><li><code>nav-bar-content-after</code></li><li><code>nav-screen-content-before</code></li><li><code>nav-screen-content-after</code></li><li><code>footer-content</code></li><li><code>bulletin-content</code></li></ul>',8))])}const b=p(g,[["render",u],["__file","index.html.vue"]]),v=JSON.parse('{"path":"/guide/layout-slots/","title":"布局插槽","lang":"zh-CN","frontmatter":{"title":"布局插槽","icon":"ph:layout-duotone","author":"Plume Theme","createTime":"2024/06/17 16:19:43","permalink":"/guide/layout-slots/","description":"概述 主题通过 <Layout /> 和 <NotFound /> 提供了 丰富的 布局插槽，可以通过这些插槽，在 页面 的不同位置注入内容。 以便用户可以个性化的使用主题。 使用 以 <Layout /> 为例，首先，需要创建一个 客户端配置文件： .vuepress/client.ts: 相关信息 layouts 中的 Layout 名是固定的，这...","head":[["meta",{"property":"og:url","content":"https://theme-plume.vuejs.press/guide/layout-slots/"}],["meta",{"property":"og:site_name","content":"Plume 主题"}],["meta",{"property":"og:title","content":"布局插槽"}],["meta",{"property":"og:description","content":"概述 主题通过 <Layout /> 和 <NotFound /> 提供了 丰富的 布局插槽，可以通过这些插槽，在 页面 的不同位置注入内容。 以便用户可以个性化的使用主题。 使用 以 <Layout /> 为例，首先，需要创建一个 客户端配置文件： .vuepress/client.ts: 相关信息 layouts 中的 Layout 名是固定的，这..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-11-29T21:59:25.000Z"}],["meta",{"property":"article:author","content":"Plume Theme"}],["meta",{"property":"article:modified_time","content":"2024-11-29T21:59:25.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"布局插槽\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-11-29T21:59:25.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Plume Theme\\"}]}"]]},"headers":[],"readingTime":{"minutes":1.79,"words":536},"git":{"updatedTime":1732917565000,"contributors":[{"name":"pengzhanbo","username":"pengzhanbo","email":"volodymyr@foxmail.com","commits":8,"avatar":"https://avatars.githubusercontent.com/pengzhanbo?v=4","url":"https://github.com/pengzhanbo"}],"changelog":[{"hash":"b079a8652a38579cfee9e31db3567a365a3d4b84","date":1718618201000,"email":"volodymyr@foxmail.com","author":"pengzhanbo","message":"docs: update docs","commitUrl":"https://github.com/pengzhanbo/vuepress-theme-plume/commit/b079a8652a38579cfee9e31db3567a365a3d4b84"},{"hash":"e35e3d99ef3bca8d9b2da681f9f86029d4e018fa","date":1721060258000,"email":"volodymyr@foxmail.com","author":"pengzhanbo","message":"docs: update docs","commitUrl":"https://github.com/pengzhanbo/vuepress-theme-plume/commit/e35e3d99ef3bca8d9b2da681f9f86029d4e018fa"},{"hash":"b4d551ff0aa237a493a766e9ad11b68264f14a69","date":1724933669000,"email":"volodymyr@foxmail.com","author":"pengzhanbo","message":"docs: update docs","commitUrl":"https://github.com/pengzhanbo/vuepress-theme-plume/commit/b4d551ff0aa237a493a766e9ad11b68264f14a69"},{"hash":"520dce22c1b037232401c4b6ddf5a90346da41a0","date":1725984193000,"email":"volodymyr@foxmail.com","author":"pengzhanbo","message":"style: lint fix","commitUrl":"https://github.com/pengzhanbo/vuepress-theme-plume/commit/520dce22c1b037232401c4b6ddf5a90346da41a0"},{"hash":"b6d0f67f2b16fde5eef7ff0c05fbab0343a3c190","date":1729446283000,"email":"volodymyr@foxmail.com","author":"pengzhanbo","message":"docs: update docs","commitUrl":"https://github.com/pengzhanbo/vuepress-theme-plume/commit/b6d0f67f2b16fde5eef7ff0c05fbab0343a3c190"},{"hash":"1bb314f245aba8160d85fc399bd8e4ea11a5fe1d","date":1729507317000,"email":"volodymyr@foxmail.com","author":"pengzhanbo","message":"docs: update docs","commitUrl":"https://github.com/pengzhanbo/vuepress-theme-plume/commit/1bb314f245aba8160d85fc399bd8e4ea11a5fe1d"},{"hash":"0c53be8f10bec3e943a493111b321be89a5952cf","date":1731083728000,"email":"volodymyr@foxmail.com","author":"pengzhanbo","message":"docs: improve docs (<a href=\\"https://github.com/pengzhanbo/vuepress-theme-plume/issues/332\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">#332</a>)","commitUrl":"https://github.com/pengzhanbo/vuepress-theme-plume/commit/0c53be8f10bec3e943a493111b321be89a5952cf"},{"hash":"597a199776e0bedf1217cf94f96f0dbed288a5cb","date":1732917565000,"email":"volodymyr@foxmail.com","author":"pengzhanbo","message":"style: lint fix","commitUrl":"https://github.com/pengzhanbo/vuepress-theme-plume/commit/597a199776e0bedf1217cf94f96f0dbed288a5cb"}]},"autoDesc":true,"filePathRelative":"notes/theme/guide/布局插槽.md","bulletin":false}');export{b as comp,v as data};