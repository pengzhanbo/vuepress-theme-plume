import{c as G}from"./chunk-4KE642ED-DIWAGSgr.js";import{p as K}from"./gitGraph-YCYPL57B-MEVJTYR7-BQW-RqAm.js";import{ar as N,m as r,h as Q,t as y,aV as _,W as j,as as q,aT as H,aW as I,aX as R,aY as J,C as U,w as Z,B as ee,T as te,k as ae,S as ie,v as re}from"./mermaid.esm.min-BnU21yYA.js";import"./chunk-5ZJXQJOJ-D5pDXMar.js";import"./app-B2bxe5Dn.js";var M=N.pie,T={sections:new Map,showData:!1,config:M},u=T.sections,v=T.showData,le=structuredClone(M),se=r(()=>structuredClone(le),"getConfig"),oe=r(()=>{u=new Map,v=T.showData,Q()},"clear"),ne=r(({label:e,value:a})=>{u.has(e)||(u.set(e,a),y.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),pe=r(()=>u,"getSections"),de=r(e=>{v=e},"setShowData"),ce=r(()=>v,"getShowData"),B={getConfig:se,clear:oe,setDiagramTitle:Z,getDiagramTitle:ee,setAccTitle:te,getAccTitle:ae,setAccDescription:ie,getAccDescription:re,addSection:ne,getSections:pe,setShowData:de,getShowData:ce},fe=r((e,a)=>{G(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),ge={parse:r(async e=>{let a=await K("pie",e);y.debug(a),fe(a,B)},"parse")},me=r(e=>`
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
`,"getStyles"),ue=me,he=r(e=>{let a=[...e.entries()].map(l=>({label:l[0],value:l[1]})).sort((l,h)=>h.value-l.value);return _().value(l=>l.value)(a)},"createPieArcs"),Se=r((e,a,l,h)=>{y.debug(`rendering pie chart
`+e);let d=h.db,D=j(),C=q(d.getConfig(),D.pie),b=40,s=18,c=4,o=450,S=o,x=H(a),n=x.append("g");n.attr("transform","translate("+S/2+","+o/2+")");let{themeVariables:i}=D,[k]=I(i.pieOuterStrokeWidth);k??(k=2);let A=C.textPosition,f=Math.min(S,o)/2-b,F=R().innerRadius(0).outerRadius(f),L=R().innerRadius(f*A).outerRadius(f*A);n.append("circle").attr("cx",0).attr("cy",0).attr("r",f+k/2).attr("class","pieOuterCircle");let W=d.getSections(),w=he(W),P=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12],p=J(P);n.selectAll("mySlices").data(w).enter().append("path").attr("d",F).attr("fill",t=>p(t.data.label)).attr("class","pieCircle");let z=0;W.forEach(t=>{z+=t}),n.selectAll("mySlices").data(w).enter().append("text").text(t=>(t.data.value/z*100).toFixed(0)+"%").attr("transform",t=>"translate("+L.centroid(t)+")").style("text-anchor","middle").attr("class","slice"),n.append("text").text(d.getDiagramTitle()).attr("x",0).attr("y",-(o-50)/2).attr("class","pieTitleText");let $=n.selectAll(".legend").data(p.domain()).enter().append("g").attr("class","legend").attr("transform",(t,g)=>{let m=s+c,E=m*p.domain().length/2,X=12*s,Y=g*m-E;return"translate("+X+","+Y+")"});$.append("rect").attr("width",s).attr("height",s).style("fill",p).style("stroke",p),$.data(w).append("text").attr("x",s+c).attr("y",s-c).text(t=>{let{label:g,value:m}=t.data;return d.getShowData()?`${g} [${m}]`:g});let V=Math.max(...$.selectAll("text").nodes().map(t=>(t==null?void 0:t.getBoundingClientRect().width)??0)),O=S+b+s+c+V;x.attr("viewBox",`0 0 ${O} ${o}`),U(x,o,O,C.useMaxWidth)},"draw"),xe={draw:Se},De={parser:ge,db:B,renderer:xe,styles:ue};export{De as diagram};
