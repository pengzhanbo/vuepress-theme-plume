import{An as e,Br as t,Bt as n,En as r,Jt as i,Ln as a,Nn as o,Tt as s,Wr as c,_n as l,bn as u,hn as d,sn as f,vr as p,yn as m,zr as h}from"./common-CWW_U7Zw.js";var g=d.packet,_=class{constructor(){this.packet=[],this.setAccTitle=l,this.getAccTitle=a,this.setDiagramTitle=m,this.getDiagramTitle=e,this.getAccDescription=f,this.setAccDescription=r}static{c(this,`PacketDB`)}getConfig(){let e=s({...g,...i().packet});return e.showBits&&(e.paddingY+=10),e}getPacket(){return this.packet}pushWord(e){e.length>0&&this.packet.push(e)}clear(){o(),this.packet=[]}},v=1e4,y=c((e,n)=>{t(e,n);let r=-1,i=[],a=1,{bitsPerRow:o}=n.getConfig();for(let{start:t,end:s,bits:c,label:l}of e.blocks){if(t!==void 0&&s!==void 0&&s<t)throw Error(`Packet block ${t} - ${s} is invalid. End must be greater than start.`);if(t??=r+1,t!==r+1)throw Error(`Packet block ${t} - ${s??t} is not contiguous. It should start from ${r+1}.`);if(c===0)throw Error(`Packet block ${t} is invalid. Cannot have a zero bit field.`);for(s??=t+(c??1)-1,c??=s-t+1,r=s,p.debug(`Packet block ${t} - ${r} with label ${l}`);i.length<=o+1&&n.getPacket().length<v;){let[e,r]=b({start:t,end:s,bits:c,label:l},a,o);if(i.push(e),e.end+1===a*o&&(n.pushWord(i),i=[],a++),!r)break;({start:t,end:s,bits:c,label:l}=r)}}n.pushWord(i)},`populate`),b=c((e,t,n)=>{if(e.start===void 0)throw Error(`start should have been set during first phase`);if(e.end===void 0)throw Error(`end should have been set during first phase`);if(e.start>e.end)throw Error(`Block start ${e.start} is greater than block end ${e.end}.`);if(e.end+1<=t*n)return[e,void 0];let r=t*n-1,i=t*n;return[{start:e.start,end:r,label:e.label,bits:r-e.start},{start:i,end:e.end,label:e.label,bits:e.end-i}]},`getNextFittingBlock`),x={parser:{yy:void 0},parse:c(async e=>{let t=await h(`packet`,e),n=x.parser?.yy;if(!(n instanceof _))throw Error(`parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.`);p.debug(t),y(t,n)},`parse`)},S=c((e,t,r,i)=>{let a=i.db,o=a.getConfig(),{rowHeight:s,paddingY:c,bitWidth:l,bitsPerRow:d}=o,f=a.getPacket(),p=a.getDiagramTitle(),m=s+c,h=m*(f.length+1)-(p?0:s),g=l*d+2,_=n(t);_.attr(`viewBox`,`0 0 ${g} ${h}`),u(_,h,g,o.useMaxWidth);for(let[e,t]of f.entries())C(_,t,e,o);_.append(`text`).text(p).attr(`x`,g/2).attr(`y`,h-m/2).attr(`dominant-baseline`,`middle`).attr(`text-anchor`,`middle`).attr(`class`,`packetTitle`)},`draw`),C=c((e,t,n,{rowHeight:r,paddingX:i,paddingY:a,bitWidth:o,bitsPerRow:s,showBits:c})=>{let l=e.append(`g`),u=n*(r+a)+a;for(let e of t){let t=e.start%s*o+1,n=(e.end-e.start+1)*o-i;if(l.append(`rect`).attr(`x`,t).attr(`y`,u).attr(`width`,n).attr(`height`,r).attr(`class`,`packetBlock`),l.append(`text`).attr(`x`,t+n/2).attr(`y`,u+r/2).attr(`class`,`packetLabel`).attr(`dominant-baseline`,`middle`).attr(`text-anchor`,`middle`).text(e.label),!c)continue;let a=e.end===e.start,d=u-2;l.append(`text`).attr(`x`,t+(a?n/2:0)).attr(`y`,d).attr(`class`,`packetByte start`).attr(`dominant-baseline`,`auto`).attr(`text-anchor`,a?`middle`:`start`).text(e.start),a||l.append(`text`).attr(`x`,t+n).attr(`y`,d).attr(`class`,`packetByte end`).attr(`dominant-baseline`,`auto`).attr(`text-anchor`,`end`).text(e.end)}},`drawWord`),w={draw:S},T={byteFontSize:`10px`,startByteColor:`black`,endByteColor:`black`,labelColor:`black`,labelFontSize:`12px`,titleColor:`black`,titleFontSize:`14px`,blockStrokeColor:`black`,blockStrokeWidth:`1`,blockFillColor:`#efefef`},E={parser:x,get db(){return new _},renderer:w,styles:c(({packet:e}={})=>{let t=s(T,e);return`
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