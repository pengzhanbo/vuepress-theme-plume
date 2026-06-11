import{An as e,En as t,Fn as n,L as r,Ln as i,M as a,Nn as o,O as s,Wr as c,_n as l,bn as u,fr as d,hr as f,j as p,k as m,sn as h,yn as g}from"./common-CWW_U7Zw.js";var _=(function(){var e=c(function(e,t,n,r){for(n||={},r=e.length;r--;n[e[r]]=t);return n},`o`),t=[6,8,10,11,12,14,16,17,18],n=[1,9],r=[1,10],i=[1,11],a=[1,12],o=[1,13],s=[1,14],l={trace:c(function(){},`trace`),yy:{},symbols_:{error:2,start:3,journey:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NEWLINE:10,title:11,acc_title:12,acc_title_value:13,acc_descr:14,acc_descr_value:15,acc_descr_multiline_value:16,section:17,taskName:18,taskData:19,$accept:0,$end:1},terminals_:{2:`error`,4:`journey`,6:`EOF`,8:`SPACE`,10:`NEWLINE`,11:`title`,12:`acc_title`,13:`acc_title_value`,14:`acc_descr`,15:`acc_descr_value`,16:`acc_descr_multiline_value`,17:`section`,18:`taskName`,19:`taskData`},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,2]],performAction:c(function(e,t,n,r,i,a,o){var s=a.length-1;switch(i){case 1:return a[s-1];case 2:this.$=[];break;case 3:a[s-1].push(a[s]),this.$=a[s-1];break;case 4:case 5:this.$=a[s];break;case 6:case 7:this.$=[];break;case 8:r.setDiagramTitle(a[s].substr(6)),this.$=a[s].substr(6);break;case 9:this.$=a[s].trim(),r.setAccTitle(this.$);break;case 10:case 11:this.$=a[s].trim(),r.setAccDescription(this.$);break;case 12:r.addSection(a[s].substr(8)),this.$=a[s].substr(8);break;case 13:r.addTask(a[s-1],a[s]),this.$=`task`;break}},`anonymous`),table:[{3:1,4:[1,2]},{1:[3]},e(t,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:n,12:r,14:i,16:a,17:o,18:s},e(t,[2,7],{1:[2,1]}),e(t,[2,3]),{9:15,11:n,12:r,14:i,16:a,17:o,18:s},e(t,[2,5]),e(t,[2,6]),e(t,[2,8]),{13:[1,16]},{15:[1,17]},e(t,[2,11]),e(t,[2,12]),{19:[1,18]},e(t,[2,4]),e(t,[2,9]),e(t,[2,10]),e(t,[2,13])],defaultActions:{},parseError:c(function(e,t){if(t.recoverable)this.trace(e);else{var n=Error(e);throw n.hash=t,n}},`parseError`),parse:c(function(e){var t=this,n=[0],r=[],i=[null],a=[],o=this.table,s=``,l=0,u=0,d=0,f=2,p=1,m=a.slice.call(arguments,1),h=Object.create(this.lexer),g={yy:{}};for(var _ in this.yy)Object.prototype.hasOwnProperty.call(this.yy,_)&&(g.yy[_]=this.yy[_]);h.setInput(e,g.yy),g.yy.lexer=h,g.yy.parser=this,typeof h.yylloc>`u`&&(h.yylloc={});var v=h.yylloc;a.push(v);var y=h.options&&h.options.ranges;typeof g.yy.parseError==`function`?this.parseError=g.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function b(e){n.length-=2*e,i.length-=e,a.length-=e}c(b,`popStack`);function x(){var e;return e=r.pop()||h.lex()||p,typeof e!=`number`&&(e instanceof Array&&(r=e,e=r.pop()),e=t.symbols_[e]||e),e}c(x,`lex`);for(var S,C,w,T,E,D={},O,k,A,j;;){if(w=n[n.length-1],this.defaultActions[w]?T=this.defaultActions[w]:((S===null||typeof S>`u`)&&(S=x()),T=o[w]&&o[w][S]),typeof T>`u`||!T.length||!T[0]){var M=``;for(O in j=[],o[w])this.terminals_[O]&&O>f&&j.push(`'`+this.terminals_[O]+`'`);M=h.showPosition?`Parse error on line `+(l+1)+`:
`+h.showPosition()+`
Expecting `+j.join(`, `)+`, got '`+(this.terminals_[S]||S)+`'`:`Parse error on line `+(l+1)+`: Unexpected `+(S==p?`end of input`:`'`+(this.terminals_[S]||S)+`'`),this.parseError(M,{text:h.match,token:this.terminals_[S]||S,line:h.yylineno,loc:v,expected:j})}if(T[0]instanceof Array&&T.length>1)throw Error(`Parse Error: multiple actions possible at state: `+w+`, token: `+S);switch(T[0]){case 1:n.push(S),i.push(h.yytext),a.push(h.yylloc),n.push(T[1]),S=null,C?(S=C,C=null):(u=h.yyleng,s=h.yytext,l=h.yylineno,v=h.yylloc,d>0&&d--);break;case 2:if(k=this.productions_[T[1]][1],D.$=i[i.length-k],D._$={first_line:a[a.length-(k||1)].first_line,last_line:a[a.length-1].last_line,first_column:a[a.length-(k||1)].first_column,last_column:a[a.length-1].last_column},y&&(D._$.range=[a[a.length-(k||1)].range[0],a[a.length-1].range[1]]),E=this.performAction.apply(D,[s,u,l,g.yy,T[1],i,a].concat(m)),typeof E<`u`)return E;k&&(n=n.slice(0,-1*k*2),i=i.slice(0,-1*k),a=a.slice(0,-1*k)),n.push(this.productions_[T[1]][0]),i.push(D.$),a.push(D._$),A=o[n[n.length-2]][n[n.length-1]],n.push(A);break;case 3:return!0}}return!0},`parse`)};l.lexer=(function(){return{EOF:1,parseError:c(function(e,t){if(this.yy.parser)this.yy.parser.parseError(e,t);else throw Error(e)},`parseError`),setInput:c(function(e,t){return this.yy=t||this.yy||{},this._input=e,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match=``,this.conditionStack=[`INITIAL`],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},`setInput`),input:c(function(){var e=this._input[0];return this.yytext+=e,this.yyleng++,this.offset++,this.match+=e,this.matched+=e,e.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),e},`input`),unput:c(function(e){var t=e.length,n=e.split(/(?:\r\n?|\n)/g);this._input=e+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-t),this.offset-=t;var r=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),n.length-1&&(this.yylineno-=n.length-1);var i=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:n?(n.length===r.length?this.yylloc.first_column:0)+r[r.length-n.length].length-n[0].length:this.yylloc.first_column-t},this.options.ranges&&(this.yylloc.range=[i[0],i[0]+this.yyleng-t]),this.yyleng=this.yytext.length,this},`unput`),more:c(function(){return this._more=!0,this},`more`),reject:c(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError(`Lexical error on line `+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:``,token:null,line:this.yylineno});return this},`reject`),less:c(function(e){this.unput(this.match.slice(e))},`less`),pastInput:c(function(){var e=this.matched.substr(0,this.matched.length-this.match.length);return(e.length>20?`...`:``)+e.substr(-20).replace(/\n/g,``)},`pastInput`),upcomingInput:c(function(){var e=this.match;return e.length<20&&(e+=this._input.substr(0,20-e.length)),(e.substr(0,20)+(e.length>20?`...`:``)).replace(/\n/g,``)},`upcomingInput`),showPosition:c(function(){var e=this.pastInput(),t=Array(e.length+1).join(`-`);return e+this.upcomingInput()+`
`+t+`^`},`showPosition`),test_match:c(function(e,t){var n,r,i;if(this.options.backtrack_lexer&&(i={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(i.yylloc.range=this.yylloc.range.slice(0))),r=e[0].match(/(?:\r\n?|\n).*/g),r&&(this.yylineno+=r.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:r?r[r.length-1].length-r[r.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+e[0].length},this.yytext+=e[0],this.match+=e[0],this.matches=e,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(e[0].length),this.matched+=e[0],n=this.performAction.call(this,this.yy,this,t,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),n)return n;if(this._backtrack){for(var a in i)this[a]=i[a];return!1}return!1},`test_match`),next:c(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var e,t,n,r;this._more||(this.yytext=``,this.match=``);for(var i=this._currentRules(),a=0;a<i.length;a++)if(n=this._input.match(this.rules[i[a]]),n&&(!t||n[0].length>t[0].length)){if(t=n,r=a,this.options.backtrack_lexer){if(e=this.test_match(n,i[a]),e!==!1)return e;if(this._backtrack){t=!1;continue}else return!1}else if(!this.options.flex)break}return t?(e=this.test_match(t,i[r]),e===!1?!1:e):this._input===``?this.EOF:this.parseError(`Lexical error on line `+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:``,token:null,line:this.yylineno})},`next`),lex:c(function(){return this.next()||this.lex()},`lex`),begin:c(function(e){this.conditionStack.push(e)},`begin`),popState:c(function(){return this.conditionStack.length-1>0?this.conditionStack.pop():this.conditionStack[0]},`popState`),_currentRules:c(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},`_currentRules`),topState:c(function(e){return e=this.conditionStack.length-1-Math.abs(e||0),e>=0?this.conditionStack[e]:`INITIAL`},`topState`),pushState:c(function(e){this.begin(e)},`pushState`),stateStackSize:c(function(){return this.conditionStack.length},`stateStackSize`),options:{"case-insensitive":!0},performAction:c(function(e,t,n,r){switch(n){case 0:break;case 1:break;case 2:return 10;case 3:break;case 4:break;case 5:return 4;case 6:return 11;case 7:return this.begin(`acc_title`),12;case 8:return this.popState(),`acc_title_value`;case 9:return this.begin(`acc_descr`),14;case 10:return this.popState(),`acc_descr_value`;case 11:this.begin(`acc_descr_multiline`);break;case 12:this.popState();break;case 13:return`acc_descr_multiline_value`;case 14:return 17;case 15:return 18;case 16:return 19;case 17:return`:`;case 18:return 6;case 19:return`INVALID`}},`anonymous`),rules:[/^(?:%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:#[^\n]*)/i,/^(?:journey\b)/i,/^(?:title\s[^#\n;]+)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:section\s[^#:\n;]+)/i,/^(?:[^#:\n;]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[12,13],inclusive:!1},acc_descr:{rules:[10],inclusive:!1},acc_title:{rules:[8],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,9,11,14,15,16,17,18,19],inclusive:!0}}}})();function u(){this.yy={}}return c(u,`Parser`),u.prototype=l,l.Parser=u,new u})();_.parser=_;var v=_,y=``,b=[],x=[],S=[],C=c(function(){b.length=0,x.length=0,y=``,S.length=0,o()},`clear`),w=c(function(e){y=e,b.push(e)},`addSection`),T=c(function(){return b},`getSections`),E=c(function(){let e=A(),t=0;for(;!e&&t<100;)e=A(),t++;return x.push(...S),x},`getTasks`),D=c(function(){let e=[];return x.forEach(t=>{t.people&&e.push(...t.people)}),[...new Set(e)].sort()},`updateActors`),O=c(function(e,t){let n=t.substr(1).split(`:`),r=0,i=[];n.length===1?(r=Number(n[0]),i=[]):(r=Number(n[0]),i=n[1].split(`,`));let a=i.map(e=>e.trim()),o={section:y,type:y,people:a,task:e,score:r};S.push(o)},`addTask`),k=c(function(e){let t={section:y,type:y,description:e,task:e,classes:[]};x.push(t)},`addTaskOrg`),A=c(function(){let e=c(function(e){return S[e].processed},`compileTask`),t=!0;for(let[n,r]of S.entries())e(n),t&&=r.processed;return t},`compileTasks`),j=c(function(){return D()},`getActors`),M={getConfig:c(()=>n().journey,`getConfig`),clear:C,setDiagramTitle:g,getDiagramTitle:e,setAccTitle:l,getAccTitle:i,setAccDescription:t,getAccDescription:h,addSection:w,getSections:T,getTasks:E,addTask:O,addTaskOrg:k,getActors:j},N=c(e=>`.label {
    font-family: ${e.fontFamily};
    color: ${e.textColor};
  }
  .mouth {
    stroke: #666;
  }

  line {
    stroke: ${e.textColor}
  }

  .legend {
    fill: ${e.textColor};
    font-family: ${e.fontFamily};
  }

  .label text {
    fill: #333;
  }
  .label {
    color: ${e.textColor}
  }

  .face {
    ${e.faceColor?`fill: ${e.faceColor}`:`fill: #FFF8DC`};
    stroke: #999;
  }

  .node rect,
  .node circle,
  .node ellipse,
  .node polygon,
  .node path {
    fill: ${e.mainBkg};
    stroke: ${e.nodeBorder};
    stroke-width: 1px;
  }

  .node .label {
    text-align: center;
  }
  .node.clickable {
    cursor: pointer;
  }

  .arrowheadPath {
    fill: ${e.arrowheadColor};
  }

  .edgePath .path {
    stroke: ${e.lineColor};
    stroke-width: 1.5px;
  }

  .flowchart-link {
    stroke: ${e.lineColor};
    fill: none;
  }

  .edgeLabel {
    background-color: ${e.edgeLabelBackground};
    rect {
      opacity: 0.5;
    }
    text-align: center;
  }

  .cluster rect {
  }

  .cluster text {
    fill: ${e.titleColor};
  }

  div.mermaidTooltip {
    position: absolute;
    text-align: center;
    max-width: 200px;
    padding: 2px;
    font-family: ${e.fontFamily};
    font-size: 12px;
    background: ${e.tertiaryColor};
    border: 1px solid ${e.border2};
    border-radius: 2px;
    pointer-events: none;
    z-index: 100;
  }

  .task-type-0, .section-type-0  {
    ${e.fillType0?`fill: ${e.fillType0}`:``};
  }
  .task-type-1, .section-type-1  {
    ${e.fillType0?`fill: ${e.fillType1}`:``};
  }
  .task-type-2, .section-type-2  {
    ${e.fillType0?`fill: ${e.fillType2}`:``};
  }
  .task-type-3, .section-type-3  {
    ${e.fillType0?`fill: ${e.fillType3}`:``};
  }
  .task-type-4, .section-type-4  {
    ${e.fillType0?`fill: ${e.fillType4}`:``};
  }
  .task-type-5, .section-type-5  {
    ${e.fillType0?`fill: ${e.fillType5}`:``};
  }
  .task-type-6, .section-type-6  {
    ${e.fillType0?`fill: ${e.fillType6}`:``};
  }
  .task-type-7, .section-type-7  {
    ${e.fillType0?`fill: ${e.fillType7}`:``};
  }

  .actor-0 {
    ${e.actor0?`fill: ${e.actor0}`:``};
  }
  .actor-1 {
    ${e.actor1?`fill: ${e.actor1}`:``};
  }
  .actor-2 {
    ${e.actor2?`fill: ${e.actor2}`:``};
  }
  .actor-3 {
    ${e.actor3?`fill: ${e.actor3}`:``};
  }
  .actor-4 {
    ${e.actor4?`fill: ${e.actor4}`:``};
  }
  .actor-5 {
    ${e.actor5?`fill: ${e.actor5}`:``};
  }
  ${r()}
`,`getStyles`),P=c(function(e,t){return a(e,t)},`drawRect`),F=c(function(e,t){let n=e.append(`circle`).attr(`cx`,t.cx).attr(`cy`,t.cy).attr(`class`,`face`).attr(`r`,15).attr(`stroke-width`,2).attr(`overflow`,`visible`),r=e.append(`g`);r.append(`circle`).attr(`cx`,t.cx-15/3).attr(`cy`,t.cy-15/3).attr(`r`,1.5).attr(`stroke-width`,2).attr(`fill`,`#666`).attr(`stroke`,`#666`),r.append(`circle`).attr(`cx`,t.cx+15/3).attr(`cy`,t.cy-15/3).attr(`r`,1.5).attr(`stroke-width`,2).attr(`fill`,`#666`).attr(`stroke`,`#666`);function i(e){let n=f().startAngle(Math.PI/2).endAngle(Math.PI/2*3).innerRadius(7.5).outerRadius(6.8181818181818175);e.append(`path`).attr(`class`,`mouth`).attr(`d`,n).attr(`transform`,`translate(`+t.cx+`,`+(t.cy+2)+`)`)}c(i,`smile`);function a(e){let n=f().startAngle(3*Math.PI/2).endAngle(Math.PI/2*5).innerRadius(7.5).outerRadius(6.8181818181818175);e.append(`path`).attr(`class`,`mouth`).attr(`d`,n).attr(`transform`,`translate(`+t.cx+`,`+(t.cy+7)+`)`)}c(a,`sad`);function o(e){e.append(`line`).attr(`class`,`mouth`).attr(`stroke`,2).attr(`x1`,t.cx-5).attr(`y1`,t.cy+7).attr(`x2`,t.cx+5).attr(`y2`,t.cy+7).attr(`class`,`mouth`).attr(`stroke-width`,`1px`).attr(`stroke`,`#666`)}return c(o,`ambivalent`),t.score>3?i(r):t.score<3?a(r):o(r),n},`drawFace`),I=c(function(e,t){let n=e.append(`circle`);return n.attr(`cx`,t.cx),n.attr(`cy`,t.cy),n.attr(`class`,`actor-`+t.pos),n.attr(`fill`,t.fill),n.attr(`stroke`,t.stroke),n.attr(`r`,t.r),n.class!==void 0&&n.attr(`class`,n.class),t.title!==void 0&&n.append(`title`).text(t.title),n},`drawCircle`),L=c(function(e,t){return s(e,t)},`drawText`),R=c(function(e,t){function n(e,t,n,r,i){return e+`,`+t+` `+(e+n)+`,`+t+` `+(e+n)+`,`+(t+r-i)+` `+(e+n-i*1.2)+`,`+(t+r)+` `+e+`,`+(t+r)}c(n,`genPoints`);let r=e.append(`polygon`);r.attr(`points`,n(t.x,t.y,50,20,7)),r.attr(`class`,`labelBox`),t.y+=t.labelMargin,t.x+=.5*t.labelMargin,L(e,t)},`drawLabel`),z=c(function(e,t,n){let r=e.append(`g`),i=p();i.x=t.x,i.y=t.y,i.fill=t.fill,i.width=n.width*t.taskCount+n.diagramMarginX*(t.taskCount-1),i.height=n.height,i.class=`journey-section section-type-`+t.num,i.rx=3,i.ry=3,P(r,i),V(n)(t.text,r,i.x,i.y,i.width,i.height,{class:`journey-section section-type-`+t.num},n,t.colour)},`drawSection`),B=-1,ee=c(function(e,t,n,r){let i=t.x+n.width/2,a=e.append(`g`);B++,a.append(`line`).attr(`id`,r+`-task`+B).attr(`x1`,i).attr(`y1`,t.y).attr(`x2`,i).attr(`y2`,450).attr(`class`,`task-line`).attr(`stroke-width`,`1px`).attr(`stroke-dasharray`,`4 2`).attr(`stroke`,`#666`),F(a,{cx:i,cy:300+(5-t.score)*30,score:t.score});let o=p();o.x=t.x,o.y=t.y,o.fill=t.fill,o.width=n.width,o.height=n.height,o.class=`task task-type-`+t.num,o.rx=3,o.ry=3,P(a,o);let s=t.x+14;t.people.forEach(e=>{let n=t.actors[e].color;I(a,{cx:s,cy:t.y,r:7,fill:n,stroke:`#000`,title:e,pos:t.actors[e].position}),s+=10}),V(n)(t.task,a,o.x,o.y,o.width,o.height,{class:`task`},n,t.colour)},`drawTask`),te=c(function(e,t){m(e,t)},`drawBackgroundRect`),V=(function(){function e(e,t,n,i,a,o,s,c){r(t.append(`text`).attr(`x`,n+a/2).attr(`y`,i+o/2+5).style(`font-color`,c).style(`text-anchor`,`middle`).text(e),s)}c(e,`byText`);function t(e,t,n,i,a,o,s,c,l){let{taskFontSize:u,taskFontFamily:d}=c,f=e.split(/<br\s*\/?>/gi);for(let e=0;e<f.length;e++){let c=e*u-u*(f.length-1)/2,p=t.append(`text`).attr(`x`,n+a/2).attr(`y`,i).attr(`fill`,l).style(`text-anchor`,`middle`).style(`font-size`,u).style(`font-family`,d);p.append(`tspan`).attr(`x`,n+a/2).attr(`dy`,c).text(f[e]),p.attr(`y`,i+o/2).attr(`dominant-baseline`,`central`).attr(`alignment-baseline`,`central`),r(p,s)}}c(t,`byTspan`);function n(e,n,i,a,o,s,c,l){let u=n.append(`switch`),d=u.append(`foreignObject`).attr(`x`,i).attr(`y`,a).attr(`width`,o).attr(`height`,s).attr(`position`,`fixed`).append(`xhtml:div`).style(`display`,`table`).style(`height`,`100%`).style(`width`,`100%`);d.append(`div`).attr(`class`,`label`).style(`display`,`table-cell`).style(`text-align`,`center`).style(`vertical-align`,`middle`).text(e),t(e,u,i,a,o,s,c,l),r(d,c)}c(n,`byFo`);function r(e,t){for(let n in t)n in t&&e.attr(n,t[n])}return c(r,`_setTextAttrs`),function(r){return r.textPlacement===`fo`?n:r.textPlacement===`old`?e:t}})(),H={drawRect:P,drawCircle:I,drawSection:z,drawText:L,drawLabel:R,drawTask:ee,drawBackgroundRect:te,initGraphics:c(function(e,t){B=-1,e.append(`defs`).append(`marker`).attr(`id`,t+`-arrowhead`).attr(`refX`,5).attr(`refY`,2).attr(`markerWidth`,6).attr(`markerHeight`,4).attr(`orient`,`auto`).append(`path`).attr(`d`,`M 0,0 V 4 L6,2 Z`)},`initGraphics`)},U=c(function(e){Object.keys(e).forEach(function(t){q[t]=e[t]})},`setConf`),W={},G=0;function K(e){let t=n().journey,r=t.maxLabelWidth;G=0;let i=60;Object.keys(W).forEach(n=>{let a=W[n].color,o={cx:20,cy:i,r:7,fill:a,stroke:`#000`,pos:W[n].position};H.drawCircle(e,o);let s=e.append(`text`).attr(`visibility`,`hidden`).text(n),c=s.node().getBoundingClientRect().width;s.remove();let l=[];if(c<=r)l=[n];else{let t=n.split(` `),i=``;s=e.append(`text`).attr(`visibility`,`hidden`),t.forEach(e=>{let t=i?`${i} ${e}`:e;if(s.text(t),s.node().getBoundingClientRect().width>r){if(i&&l.push(i),i=e,s.text(e),s.node().getBoundingClientRect().width>r){let t=``;for(let n of e)t+=n,s.text(t+`-`),s.node().getBoundingClientRect().width>r&&(l.push(t.slice(0,-1)+`-`),t=n);i=t}}else i=t}),i&&l.push(i),s.remove()}l.forEach((n,r)=>{let a={x:40,y:i+7+r*20,fill:`#666`,text:n,textMargin:t.boxTextMargin??5},o=H.drawText(e,a).node().getBoundingClientRect().width;o>G&&o>t.leftMargin-o&&(G=o)}),i+=Math.max(20,l.length*20)})}c(K,`drawActorLegend`);var q=n().journey,J=0,Y=c(function(e,t,r,i){let a=n(),o=a.journey.titleColor,s=a.journey.titleFontSize,c=a.journey.titleFontFamily,l=a.securityLevel,f;l===`sandbox`&&(f=d(`#i`+t));let p=d(l===`sandbox`?f.nodes()[0].contentDocument.body:`body`);X.init();let m=p.select(`#`+t);H.initGraphics(m,t);let h=i.db.getTasks(),g=i.db.getDiagramTitle(),_=i.db.getActors();for(let e in W)delete W[e];let v=0;_.forEach(e=>{W[e]={color:q.actorColours[v%q.actorColours.length],position:v},v++}),K(m),J=q.leftMargin+G,X.insert(0,0,J,Object.keys(W).length*50),ne(m,h,0,t);let y=X.getBounds();g&&m.append(`text`).text(g).attr(`x`,J).attr(`font-size`,s).attr(`font-weight`,`bold`).attr(`y`,25).attr(`fill`,o).attr(`font-family`,c);let b=y.stopy-y.starty+2*q.diagramMarginY,x=J+y.stopx+2*q.diagramMarginX;u(m,b,x,q.useMaxWidth),m.append(`line`).attr(`x1`,J).attr(`y1`,q.height*4).attr(`x2`,x-J-4).attr(`y2`,q.height*4).attr(`stroke-width`,4).attr(`stroke`,`black`).attr(`marker-end`,`url(#`+t+`-arrowhead)`);let S=g?70:0;m.attr(`viewBox`,`${y.startx} -25 ${x} ${b+S}`),m.attr(`preserveAspectRatio`,`xMinYMin meet`),m.attr(`height`,b+S+25)},`draw`),X={data:{startx:void 0,stopx:void 0,starty:void 0,stopy:void 0},verticalPos:0,sequenceItems:[],init:c(function(){this.sequenceItems=[],this.data={startx:void 0,stopx:void 0,starty:void 0,stopy:void 0},this.verticalPos=0},`init`),updateVal:c(function(e,t,n,r){e[t]===void 0?e[t]=n:e[t]=r(n,e[t])},`updateVal`),updateBounds:c(function(e,t,r,i){let a=n().journey,o=this,s=0;function l(n){return c(function(c){s++;let l=o.sequenceItems.length-s+1;o.updateVal(c,`starty`,t-l*a.boxMargin,Math.min),o.updateVal(c,`stopy`,i+l*a.boxMargin,Math.max),o.updateVal(X.data,`startx`,e-l*a.boxMargin,Math.min),o.updateVal(X.data,`stopx`,r+l*a.boxMargin,Math.max),n!==`activation`&&(o.updateVal(c,`startx`,e-l*a.boxMargin,Math.min),o.updateVal(c,`stopx`,r+l*a.boxMargin,Math.max),o.updateVal(X.data,`starty`,t-l*a.boxMargin,Math.min),o.updateVal(X.data,`stopy`,i+l*a.boxMargin,Math.max))},`updateItemBounds`)}c(l,`updateFn`),this.sequenceItems.forEach(l())},`updateBounds`),insert:c(function(e,t,n,r){let i=Math.min(e,n),a=Math.max(e,n),o=Math.min(t,r),s=Math.max(t,r);this.updateVal(X.data,`startx`,i,Math.min),this.updateVal(X.data,`starty`,o,Math.min),this.updateVal(X.data,`stopx`,a,Math.max),this.updateVal(X.data,`stopy`,s,Math.max),this.updateBounds(i,o,a,s)},`insert`),bumpVerticalPos:c(function(e){this.verticalPos+=e,this.data.stopy=this.verticalPos},`bumpVerticalPos`),getVerticalPos:c(function(){return this.verticalPos},`getVerticalPos`),getBounds:c(function(){return this.data},`getBounds`)},Z=q.sectionFills,Q=q.sectionColours,ne=c(function(e,t,r,i){let a=n().journey,o=``,s=r+(a.height*2+a.diagramMarginY),c=0,l=`#CCC`,u=`black`,d=0;for(let[n,r]of t.entries()){if(o!==r.section){l=Z[c%Z.length],d=c%Z.length,u=Q[c%Q.length];let i=0,s=r.section;for(let e=n;e<t.length&&t[e].section==s;e++)i+=1;let f={x:n*a.taskMargin+n*a.width+J,y:50,text:r.section,fill:l,num:d,colour:u,taskCount:i};H.drawSection(e,f,a),o=r.section,c++}let f=r.people.reduce((e,t)=>(W[t]&&(e[t]=W[t]),e),{});r.x=n*a.taskMargin+n*a.width+J,r.y=s,r.width=a.diagramMarginX,r.height=a.diagramMarginY,r.colour=u,r.fill=l,r.num=d,r.actors=f,H.drawTask(e,r,a,i),X.insert(r.x,r.y,r.x+r.width+a.taskMargin,450)}},`drawTasks`),$={setConf:U,draw:Y},re={parser:v,db:M,renderer:$,styles:N,init:c(e=>{$.setConf(e.journey),M.clear()},`init`)};export{re as diagram};