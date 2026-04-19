import{t as e}from"./chunk-VELTKBKT-MF1JIm2u.js";import"./chunk-JIN56HTB-CgNZbRDp.js";import"./chunk-QU3B7NT4-Cw7PUtsg.js";import"./chunk-H3VCZNTA-BFf2tOHH.js";import"./chunk-FXACKDTF-E2hqY5pn.js";import"./chunk-XGPFEOL4-BA-aI8Ji.js";import{t}from"./chunk-AEOMTBSW-yEbieymo.js";import{t as n}from"./chunk-DKKBVRCY-BkAlPj2g.js";import"./chunk-DU5LTGQ6-DwAwz2T_.js";import"./chunk-6NTNNK5N-BIB8X0lr.js";import"./chunk-RNJOYNJ4-Z-3YcsuX.js";import"./chunk-A34GCYZU-BunvEKxM.js";import"./chunk-W7ZLLLMY-B5IQFffc.js";import"./chunk-WSB5WSVC-B4s_iqpg.js";import"./chunk-DJ7UZH7F-DUPprj7S.js";import{q as r}from"./chunk-MGPAVIPZ-BiIvV5Xa.js";import{$ as i,A as a,G as o,H as s,N as c,P as l,R as u,p as d,q as f,w as p,y as m}from"./chunk-5YUVU3PZ-BK7KuoPj.js";import{t as h}from"./chunk-267PNR3T-CJ5iXtBP.js";import"./chunk-XBXGYYE5-DKC57bIp.js";import{a as g}from"./chunk-2HR5LOFI-BF6gey_n.js";import"./chunk-TYMNRAUI-kbBfS4pn.js";var _={showLegend:!0,ticks:5,max:null,min:0,graticule:`circle`},v={axes:[],curves:[],options:_},y=structuredClone(v),b=o.radar,x=e(()=>g({...b,...d().radar}),`getConfig`),S=e(()=>y.axes,`getAxes`),C=e(()=>y.curves,`getCurves`),w=e(()=>y.options,`getOptions`),T=e(e=>{y.axes=e.map(e=>({name:e.name,label:e.label??e.name}))},`setAxes`),E=e(e=>{y.curves=e.map(e=>({name:e.name,label:e.label??e.name,entries:D(e.entries)}))},`setCurves`),D=e(e=>{if(e[0].axis==null)return e.map(e=>e.value);let t=S();if(t.length===0)throw Error(`Axes must be populated before curves for reference entries`);return t.map(t=>{let n=e.find(e=>e.axis?.$refText===t.name);if(n===void 0)throw Error(`Missing entry for axis `+t.label);return n.value})},`computeCurveEntries`),O={getAxes:S,getCurves:C,getOptions:w,setAxes:T,setCurves:E,setOptions:e(e=>{let t=e.reduce((e,t)=>(e[t.name]=t,e),{});y.options={showLegend:t.showLegend?.value??_.showLegend,ticks:t.ticks?.value??_.ticks,max:t.max?.value??_.max,min:t.min?.value??_.min,graticule:t.graticule?.value??_.graticule}},`setOptions`),getConfig:x,clear:e(()=>{f(),y=structuredClone(v)},`clear`),setAccTitle:a,getAccTitle:i,setDiagramTitle:c,getDiagramTitle:s,getAccDescription:u,setAccDescription:p},k=e(e=>{t(e,O);let{axes:n,curves:r,options:i}=e;O.setAxes(n),O.setCurves(r),O.setOptions(i)},`populate`),A={parse:e(async e=>{let t=await n(`radar`,e);r.debug(t),k(t)},`parse`)},j=e((e,t,n,r)=>{let i=r.db,a=i.getAxes(),o=i.getCurves(),s=i.getOptions(),c=i.getConfig(),l=i.getDiagramTitle(),u=M(h(t),c),d=s.max??Math.max(...o.map(e=>Math.max(...e.entries))),f=s.min,p=Math.min(c.width,c.height)/2;N(u,a,p,s.ticks,s.graticule),P(u,a,p,c),F(u,a,o,f,d,s.graticule,c),R(u,o,s.showLegend,c),u.append(`text`).attr(`class`,`radarTitle`).text(l).attr(`x`,0).attr(`y`,-c.height/2-c.marginTop)},`draw`),M=e((e,t)=>{let n=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,i={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return l(e,r,n,t.useMaxWidth??!0),e.attr(`viewBox`,`0 0 ${n} ${r}`),e.append(`g`).attr(`transform`,`translate(${i.x}, ${i.y})`)},`drawFrame`),N=e((e,t,n,r,i)=>{if(i===`circle`)for(let t=0;t<r;t++){let i=n*(t+1)/r;e.append(`circle`).attr(`r`,i).attr(`class`,`radarGraticule`)}else if(i===`polygon`){let i=t.length;for(let a=0;a<r;a++){let o=n*(a+1)/r,s=t.map((e,t)=>{let n=2*t*Math.PI/i-Math.PI/2;return`${o*Math.cos(n)},${o*Math.sin(n)}`}).join(` `);e.append(`polygon`).attr(`points`,s).attr(`class`,`radarGraticule`)}}},`drawGraticule`),P=e((e,t,n,r)=>{let i=t.length;for(let a=0;a<i;a++){let o=t[a].label,s=2*a*Math.PI/i-Math.PI/2;e.append(`line`).attr(`x1`,0).attr(`y1`,0).attr(`x2`,n*r.axisScaleFactor*Math.cos(s)).attr(`y2`,n*r.axisScaleFactor*Math.sin(s)).attr(`class`,`radarAxisLine`),e.append(`text`).text(o).attr(`x`,n*r.axisLabelFactor*Math.cos(s)).attr(`y`,n*r.axisLabelFactor*Math.sin(s)).attr(`class`,`radarAxisLabel`)}},`drawAxes`);function F(e,t,n,r,i,a,o){let s=t.length,c=Math.min(o.width,o.height)/2;n.forEach((t,n)=>{if(t.entries.length!==s)return;let l=t.entries.map((e,t)=>{let n=2*Math.PI*t/s-Math.PI/2,a=I(e,r,i,c);return{x:a*Math.cos(n),y:a*Math.sin(n)}});a===`circle`?e.append(`path`).attr(`d`,L(l,o.curveTension)).attr(`class`,`radarCurve-${n}`):a===`polygon`&&e.append(`polygon`).attr(`points`,l.map(e=>`${e.x},${e.y}`).join(` `)).attr(`class`,`radarCurve-${n}`)})}e(F,`drawCurves`);function I(e,t,n,r){return r*(Math.min(Math.max(e,t),n)-t)/(n-t)}e(I,`relativeRadius`);function L(e,t){let n=e.length,r=`M${e[0].x},${e[0].y}`;for(let i=0;i<n;i++){let a=e[(i-1+n)%n],o=e[i],s=e[(i+1)%n],c=e[(i+2)%n],l={x:o.x+(s.x-a.x)*t,y:o.y+(s.y-a.y)*t},u={x:s.x-(c.x-o.x)*t,y:s.y-(c.y-o.y)*t};r+=` C${l.x},${l.y} ${u.x},${u.y} ${s.x},${s.y}`}return`${r} Z`}e(L,`closedRoundCurve`);function R(e,t,n,r){if(!n)return;let i=(r.width/2+r.marginRight)*3/4,a=-(r.height/2+r.marginTop)*3/4;t.forEach((t,n)=>{let r=e.append(`g`).attr(`transform`,`translate(${i}, ${a+n*20})`);r.append(`rect`).attr(`width`,12).attr(`height`,12).attr(`class`,`radarLegendBox-${n}`),r.append(`text`).attr(`x`,16).attr(`y`,0).attr(`class`,`radarLegendText`).text(t.label)})}e(R,`drawLegend`);var z={draw:j},B=e((e,t)=>{let n=``;for(let r=0;r<e.THEME_COLOR_LIMIT;r++){let i=e[`cScale${r}`];n+=`
		.radarCurve-${r} {
			color: ${i};
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
			stroke-width: ${t.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
		}
		`}return n},`genIndexStyles`),V=e(e=>{let t=g(m(),d().themeVariables);return{themeVariables:t,radarOptions:g(t.radar,e)}},`buildRadarStyleOptions`),H={parser:A,db:O,renderer:z,styles:e(({radar:e}={})=>{let{themeVariables:t,radarOptions:n}=V(e);return`
	.radarTitle {
		font-size: ${t.fontSize};
		color: ${t.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${n.axisColor};
		stroke-width: ${n.axisStrokeWidth};
	}
	.radarAxisLabel {
		dominant-baseline: middle;
		text-anchor: middle;
		font-size: ${n.axisLabelFontSize}px;
		color: ${n.axisColor};
	}
	.radarGraticule {
		fill: ${n.graticuleColor};
		fill-opacity: ${n.graticuleOpacity};
		stroke: ${n.graticuleColor};
		stroke-width: ${n.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${n.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${B(t,n)}
	`},`styles`)};export{H as diagram};