import{c as Y}from"./chunk-4KE642ED-C0MiyEHB.js";import{p as Z}from"./treemap-75Q7IDZK-HKTH2UG6-CBzsGUrx.js";import{m as r,K as B,Z as E,j as J,X as N,J as V,Q as G,t as y,h as I,L as U,aN as q,aP as H,aQ as M,aR as _,Y as ee,l as te,aS as ae,u as ie}from"./mermaid.esm.min-CqNuWDjC.js";import"./chunk-5ZJXQJOJ-Dge5rpui.js";import"./app-BXooy4HZ.js";var re=ie.pie,D={sections:new Map,showData:!1},m=D.sections,T=D.showData,le=structuredClone(re),se=r(()=>structuredClone(le),"getConfig"),oe=r(()=>{m=new Map,T=D.showData,te()},"clear"),ne=r(({label:e,value:t})=>{m.has(e)||(m.set(e,t),y.debug(`added new section: ${e}, with value: ${t}`))},"addSection"),pe=r(()=>m,"getSections"),de=r(e=>{T=e},"setShowData"),ce=r(()=>T,"getShowData"),F={getConfig:se,clear:oe,setDiagramTitle:G,getDiagramTitle:V,setAccTitle:N,getAccTitle:J,setAccDescription:E,getAccDescription:B,addSection:ne,getSections:pe,setShowData:de,getShowData:ce},fe=r((e,t)=>{Y(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},"populateDb"),ge={parse:r(async e=>{let t=await Z("pie",e);y.debug(t),fe(t,F)},"parse")},he=r(e=>`
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
`,"getStyles"),me=he,ue=r(e=>{let t=[...e.entries()].map(l=>({label:l[0],value:l[1]})).sort((l,u)=>u.value-l.value);return ae().value(l=>l.value)(t)},"createPieArcs"),Se=r((e,t,l,u)=>{y.debug(`rendering pie chart
`+e);let d=u.db,v=I(),C=U(d.getConfig(),v.pie),b=40,s=18,c=4,n=450,S=n,x=q(t),o=x.append("g");o.attr("transform","translate("+S/2+","+n/2+")");let{themeVariables:a}=v,[k]=H(a.pieOuterStrokeWidth);k??=2;let A=C.textPosition,f=Math.min(S,n)/2-b,L=M().innerRadius(0).outerRadius(f),P=M().innerRadius(f*A).outerRadius(f*A);o.append("circle").attr("cx",0).attr("cy",0).attr("r",f+k/2).attr("class","pieOuterCircle");let R=d.getSections(),w=ue(R),Q=[a.pie1,a.pie2,a.pie3,a.pie4,a.pie5,a.pie6,a.pie7,a.pie8,a.pie9,a.pie10,a.pie11,a.pie12],p=_(Q);o.selectAll("mySlices").data(w).enter().append("path").attr("d",L).attr("fill",i=>p(i.data.label)).attr("class","pieCircle");let z=0;R.forEach(i=>{z+=i}),o.selectAll("mySlices").data(w).enter().append("text").text(i=>(i.data.value/z*100).toFixed(0)+"%").attr("transform",i=>"translate("+P.centroid(i)+")").style("text-anchor","middle").attr("class","slice"),o.append("text").text(d.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");let $=o.selectAll(".legend").data(p.domain()).enter().append("g").attr("class","legend").attr("transform",(i,g)=>{let h=s+c,j=h*p.domain().length/2,K=12*s,X=g*h-j;return"translate("+K+","+X+")"});$.append("rect").attr("width",s).attr("height",s).style("fill",p).style("stroke",p),$.data(w).append("text").attr("x",s+c).attr("y",s-c).text(i=>{let{label:g,value:h}=i.data;return d.getShowData()?`${g} [${h}]`:g});let W=Math.max(...$.selectAll("text").nodes().map(i=>i?.getBoundingClientRect().width??0)),O=S+b+s+c+W;x.attr("viewBox",`0 0 ${O} ${n}`),ee(x,n,O,C.useMaxWidth)},"draw"),xe={draw:Se},ve={parser:ge,db:F,renderer:xe,styles:me};export{ve as diagram};
