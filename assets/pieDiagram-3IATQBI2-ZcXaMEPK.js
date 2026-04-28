import{t as e}from"./chunk-VELTKBKT-Cmvfv6eM.js";import"./chunk-JIN56HTB-BYe2R9gN.js";import"./chunk-QU3B7NT4-BCsLZz8e.js";import"./chunk-H3VCZNTA-COjrXyKD.js";import"./chunk-FXACKDTF-BrDsR-yl.js";import"./chunk-XGPFEOL4-BwWWFiko.js";import{t}from"./chunk-AEOMTBSW-D_jplZIJ.js";import{t as n}from"./chunk-DKKBVRCY-2qFE9OUY.js";import"./chunk-DU5LTGQ6-TqzhHRH5.js";import"./chunk-6NTNNK5N-JYbOBrj4.js";import"./chunk-RNJOYNJ4-zcbS1bdK.js";import"./chunk-A34GCYZU-DvSBRYlr.js";import"./chunk-W7ZLLLMY-CICu3U7G.js";import"./chunk-WSB5WSVC-CFZIGFy_.js";import"./chunk-DJ7UZH7F-B0z84ITd.js";import{W as r,c as i,p as a,q as o}from"./chunk-MGPAVIPZ-DeAbnxWy.js";import{$ as s,A as c,G as l,H as u,N as d,P as f,R as p,Y as m,q as h,w as g}from"./chunk-5YUVU3PZ-skphjOkw.js";import{t as _}from"./chunk-267PNR3T-5lBlfU2p.js";import"./chunk-XBXGYYE5-Bb66Hy8s.js";import{a as v,t as y}from"./chunk-2HR5LOFI-BP6BRNnK.js";import"./chunk-TYMNRAUI-CUdBPp5c.js";var b=l.pie,x={sections:new Map,showData:!1,config:b},S=x.sections,C=x.showData,w=structuredClone(b),T={getConfig:e(()=>structuredClone(w),`getConfig`),clear:e(()=>{S=new Map,C=x.showData,h()},`clear`),setDiagramTitle:d,getDiagramTitle:u,setAccTitle:c,getAccTitle:s,setAccDescription:g,getAccDescription:p,addSection:e(({label:e,value:t})=>{if(t<0)throw Error(`"${e}" has invalid value: ${t}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);S.has(e)||(S.set(e,t),o.debug(`added new section: ${e}, with value: ${t}`))},`addSection`),getSections:e(()=>S,`getSections`),setShowData:e(e=>{C=e},`setShowData`),getShowData:e(()=>C,`getShowData`)},E=e((e,n)=>{t(e,n),n.setShowData(e.showData),e.sections.map(n.addSection)},`populateDb`),D={parse:e(async e=>{let t=await n(`pie`,e);o.debug(t),E(t,T)},`parse`)},O=e(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,`getStyles`),k=e(e=>{let t=[...e.values()].reduce((e,t)=>e+t,0),n=[...e.entries()].map(([e,t])=>({label:e,value:t})).filter(e=>e.value/t*100>=1);return i().value(e=>e.value).sort(null)(n)},`createPieArcs`),A={parser:D,db:T,renderer:{draw:e((e,t,n,i)=>{o.debug(`rendering pie chart
`+e);let s=i.db,c=m(),l=v(s.getConfig(),c.pie),u=_(t),d=u.append(`g`);d.attr(`transform`,`translate(225,225)`);let{themeVariables:p}=c,[h]=y(p.pieOuterStrokeWidth);h??=2;let g=l.textPosition,b=r().innerRadius(0).outerRadius(185),x=r().innerRadius(185*g).outerRadius(185*g);d.append(`circle`).attr(`cx`,0).attr(`cy`,0).attr(`r`,185+h/2).attr(`class`,`pieOuterCircle`);let S=s.getSections(),C=k(S),w=[p.pie1,p.pie2,p.pie3,p.pie4,p.pie5,p.pie6,p.pie7,p.pie8,p.pie9,p.pie10,p.pie11,p.pie12],T=0;S.forEach(e=>{T+=e});let E=C.filter(e=>(e.data.value/T*100).toFixed(0)!==`0`),D=a(w).domain([...S.keys()]);d.selectAll(`mySlices`).data(E).enter().append(`path`).attr(`d`,b).attr(`fill`,e=>D(e.data.label)).attr(`class`,`pieCircle`),d.selectAll(`mySlices`).data(E).enter().append(`text`).text(e=>(e.data.value/T*100).toFixed(0)+`%`).attr(`transform`,e=>`translate(`+x.centroid(e)+`)`).style(`text-anchor`,`middle`).attr(`class`,`slice`);let O=d.append(`text`).text(s.getDiagramTitle()).attr(`x`,0).attr(`y`,-400/2).attr(`class`,`pieTitleText`),A=[...S.entries()].map(([e,t])=>({label:e,value:t})),j=d.selectAll(`.legend`).data(A).enter().append(`g`).attr(`class`,`legend`).attr(`transform`,(e,t)=>{let n=22*A.length/2;return`translate(216,`+(t*22-n)+`)`});j.append(`rect`).attr(`width`,18).attr(`height`,18).style(`fill`,e=>D(e.label)).style(`stroke`,e=>D(e.label)),j.append(`text`).attr(`x`,22).attr(`y`,14).text(e=>s.getShowData()?`${e.label} [${e.value}]`:e.label);let M=512+Math.max(...j.selectAll(`text`).nodes().map(e=>e?.getBoundingClientRect().width??0)),N=O.node()?.getBoundingClientRect().width??0,P=450/2-N/2,F=450/2+N/2,I=Math.min(0,P),L=Math.max(M,F)-I;u.attr(`viewBox`,`${I} 0 ${L} 450`),f(u,450,L,l.useMaxWidth)},`draw`)},styles:O};export{A as diagram};