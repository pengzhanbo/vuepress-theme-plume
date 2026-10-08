import{t as e}from"./chunk-QVIEFLGF-D7gHfkwh.js";import{q as t}from"./chunk-L2B47AAZ-D4FrZ1vo.js";import{$ as n,A as r,R as i,W as a,at as o,d as s,i as c,nt as l,t as u,z as d}from"./chunk-VSAMGZVZ-DoLblOr2.js";import{t as f}from"./chunk-V3KJR4XU-Bb0LTxUF.js";import{j as p}from"./chunk-USJJLVIZ-DvLXOKlK.js";import"./chunk-ZZ52EIBP-gwdkJnVO.js";import{o as m}from"./chunk-YF46JFGZ-DMOJUqXj.js";import{a as h}from"./mermaid.esm.min-D9iBixi7.js";var g=u.packet,_=class{constructor(){this.packet=[],this.setAccTitle=d,this.getAccTitle=a,this.setDiagramTitle=l,this.getDiagramTitle=i,this.getAccDescription=o,this.setAccDescription=r}static{e(this,`PacketDB`)}getConfig(){let e=m({...g,...s().packet});return e.showBits&&(e.paddingY+=10),e}getPacket(){return this.packet}pushWord(e){e.length>0&&this.packet.push(e)}clear(){n(),this.packet=[]}},v=1e4,y=e((e,n)=>{f(e,n);let r=-1,i=[],a=1,{bitsPerRow:o}=n.getConfig();for(let{start:s,end:c,bits:l,label:u}of e.blocks){if(s!==void 0&&c!==void 0&&c<s)throw Error(`Packet block ${s} - ${c} is invalid. End must be greater than start.`);if(s??=r+1,s!==r+1)throw Error(`Packet block ${s} - ${c??s} is not contiguous. It should start from ${r+1}.`);if(l===0)throw Error(`Packet block ${s} is invalid. Cannot have a zero bit field.`);for(c??=s+(l??1)-1,l??=c-s+1,r=c,t.debug(`Packet block ${s} - ${r} with label ${u}`);i.length<=o+1&&n.getPacket().length<v;){let[e,t]=b({start:s,end:c,bits:l,label:u},a,o);if(i.push(e),e.end+1===a*o&&(n.pushWord(i),i=[],a++),!t)break;({start:s,end:c,bits:l,label:u}=t)}}n.pushWord(i)},`populate`),b=e((e,t,n)=>{if(e.start===void 0)throw Error(`start should have been set during first phase`);if(e.end===void 0)throw Error(`end should have been set during first phase`);if(e.start>e.end)throw Error(`Block start ${e.start} is greater than block end ${e.end}.`);if(e.end+1<=t*n)return[e,void 0];let r=t*n-1,i=t*n;return[{start:e.start,end:r,label:e.label,bits:r-e.start},{start:i,end:e.end,label:e.label,bits:e.end-i}]},`getNextFittingBlock`),x={parser:{yy:void 0},parse:e(async e=>{let n=await p(`packet`,e),r=x.parser?.yy;if(!(r instanceof _))throw Error(`parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.`);t.debug(n),y(n,r)},`parse`)},S=e((e,t,n,r)=>{let i=r.db,a=i.getConfig(),{rowHeight:o,paddingY:s,bitWidth:l,bitsPerRow:u}=a,d=i.getPacket(),f=i.getDiagramTitle(),p=o+s,m=p*(d.length+1)-(f?0:o),g=l*u+2,_=h(t);_.attr(`viewBox`,`0 0 ${g} ${m}`),c(_,m,g,a.useMaxWidth);for(let[e,t]of d.entries())C(_,t,e,a);_.append(`text`).text(f).attr(`x`,g/2).attr(`y`,m-p/2).attr(`dominant-baseline`,`middle`).attr(`text-anchor`,`middle`).attr(`class`,`packetTitle`)},`draw`),C=e((e,t,n,{rowHeight:r,paddingX:i,paddingY:a,bitWidth:o,bitsPerRow:s,showBits:c,bitOrder:l})=>{let u=e.append(`g`),d=n*(r+a)+a,f=l===`descending`;for(let e of t){let t=e.end-e.start+1,n=e.start%s,a=(f?s-n-t:n)*o+1,l=t*o-i;if(u.append(`rect`).attr(`x`,a).attr(`y`,d).attr(`width`,l).attr(`height`,r).attr(`class`,`packetBlock`),u.append(`text`).attr(`x`,a+l/2).attr(`y`,d+r/2).attr(`class`,`packetLabel`).attr(`dominant-baseline`,`middle`).attr(`text-anchor`,`middle`).text(e.label),!c)continue;let[p,m]=f?[e.end,e.start]:[e.start,e.end],h=t===1,g=d-2;u.append(`text`).attr(`x`,a+(h?l/2:0)).attr(`y`,g).attr(`class`,`packetByte start`).attr(`dominant-baseline`,`auto`).attr(`text-anchor`,h?`middle`:`start`).text(p),h||u.append(`text`).attr(`x`,a+l).attr(`y`,g).attr(`class`,`packetByte end`).attr(`dominant-baseline`,`auto`).attr(`text-anchor`,`end`).text(m)}},`drawWord`),w={draw:S},T={byteFontSize:`10px`,startByteColor:`black`,endByteColor:`black`,labelColor:`black`,labelFontSize:`12px`,titleColor:`black`,titleFontSize:`14px`,blockStrokeColor:`black`,blockStrokeWidth:`1`,blockFillColor:`#efefef`},E={parser:x,get db(){return new _},renderer:w,styles:e(({packet:e}={})=>{let t=m(T,e);return`
	.packetByte {
		font-size: ${t.byteFontSize};
	}
	.packetByte.start {
		fill: ${t.startByteColor};
	}
	.packetByte.end {
		fill: ${t.endByteColor};
	}
	.packetLabel {
		fill: ${t.labelColor};
		font-size: ${t.labelFontSize};
	}
	.packetTitle {
		fill: ${t.titleColor};
		font-size: ${t.titleFontSize};
	}
	.packetBlock {
		stroke: ${t.blockStrokeColor};
		stroke-width: ${t.blockStrokeWidth};
		fill: ${t.blockFillColor};
	}
	`},`styles`)};export{E as diagram};