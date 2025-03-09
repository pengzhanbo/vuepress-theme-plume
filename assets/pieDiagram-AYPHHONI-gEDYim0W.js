import{c as Y}from"./chunk-4KE642ED-jnhLk4v1.js";import{p as G}from"./gitGraph-YCYPL57B-MEVJTYR7-jbiHj5ZD.js";import{m as r,v as K,S as N,k as Q,T as _,B as j,w as q,t as y,W as H,as as I,aT as J,aV as U,aW as R,aX as Z,C as ee,g as te,aY as ae,au as ie}from"./mermaid.esm.min-iWZqNtdk.js";import"./chunk-5ZJXQJOJ-yogz52uS.js";import"./app-ClyI-21t.js";var re=ie.pie,T={sections:new Map,showData:!1},u=T.sections,v=T.showData,le=structuredClone(re),se=r(()=>structuredClone(le),"getConfig"),oe=r(()=>{u=new Map,v=T.showData,te()},"clear"),ne=r(({label:e,value:a})=>{u.has(e)||(u.set(e,a),y.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),pe=r(()=>u,"getSections"),de=r(e=>{v=e},"setShowData"),ce=r(()=>v,"getShowData"),M={getConfig:se,clear:oe,setDiagramTitle:q,getDiagramTitle:j,setAccTitle:_,getAccTitle:Q,setAccDescription:N,getAccDescription:K,addSection:ne,getSections:pe,setShowData:de,getShowData:ce},fe=r((e,a)=>{Y(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),ge={parse:r(async e=>{let a=await G("pie",e);y.debug(a),fe(a,M)},"parse")},me=r(e=>`
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
`,"getStyles"),ue=me,he=r(e=>{let a=[...e.entries()].map(l=>({label:l[0],value:l[1]})).sort((l,h)=>h.value-l.value);return ae().value(l=>l.value)(a)},"createPieArcs"),Se=r((e,a,l,h)=>{y.debug(`rendering pie chart
`+e);let d=h.db,D=H(),C=I(d.getConfig(),D.pie),b=40,s=18,c=4,n=450,S=n,x=J(a),o=x.append("g");o.attr("transform","translate("+S/2+","+n/2+")");let{themeVariables:i}=D,[k]=U(i.pieOuterStrokeWidth);k??(k=2);let A=C.textPosition,f=Math.min(S,n)/2-b,B=R().innerRadius(0).outerRadius(f),F=R().innerRadius(f*A).outerRadius(f*A);o.append("circle").attr("cx",0).attr("cy",0).attr("r",f+k/2).attr("class","pieOuterCircle");let W=d.getSections(),w=he(W),L=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12],p=Z(L);o.selectAll("mySlices").data(w).enter().append("path").attr("d",B).attr("fill",t=>p(t.data.label)).attr("class","pieCircle");let z=0;W.forEach(t=>{z+=t}),o.selectAll("mySlices").data(w).enter().append("text").text(t=>(t.data.value/z*100).toFixed(0)+"%").attr("transform",t=>"translate("+F.centroid(t)+")").style("text-anchor","middle").attr("class","slice"),o.append("text").text(d.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");let $=o.selectAll(".legend").data(p.domain()).enter().append("g").attr("class","legend").attr("transform",(t,g)=>{let m=s+c,V=m*p.domain().length/2,E=12*s,X=g*m-V;return"translate("+E+","+X+")"});$.append("rect").attr("width",s).attr("height",s).style("fill",p).style("stroke",p),$.data(w).append("text").attr("x",s+c).attr("y",s-c).text(t=>{let{label:g,value:m}=t.data;return d.getShowData()?`${g} [${m}]`:g});let P=Math.max(...$.selectAll("text").nodes().map(t=>(t==null?void 0:t.getBoundingClientRect().width)??0)),O=S+b+s+c+P;x.attr("viewBox",`0 0 ${O} ${n}`),ee(x,n,O,C.useMaxWidth)},"draw"),xe={draw:Se},De={parser:ge,db:M,renderer:xe,styles:ue};export{De as diagram};
