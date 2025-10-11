import{m as Qt}from"./chunk-6EQESGSB-OzRrtNJS.js";import{y as Zt}from"./chunk-T244DUNM-DAs1BYFH.js";import{m as u,p as _,a as R,c as te,d as ee,U as se,H as ie,$ as re,G as ae,j as ne,e as oe,b2 as le,h as z,N as ce}from"./mermaid.esm.min-BR4XFesH.js";var Ct=(function(){var t=u(function(N,a,n,g){for(n=n||{},g=N.length;g--;n[N[g]]=a);return n},"o"),e=[1,2],s=[1,3],o=[1,4],r=[2,4],h=[1,9],d=[1,11],y=[1,16],p=[1,17],S=[1,18],m=[1,19],b=[1,33],x=[1,20],O=[1,21],c=[1,22],$=[1,23],E=[1,24],w=[1,26],L=[1,27],F=[1,28],Y=[1,29],tt=[1,30],et=[1,31],st=[1,32],it=[1,35],rt=[1,36],at=[1,37],nt=[1,38],M=[1,34],f=[1,4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],ot=[1,4,5,14,15,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,39,40,41,45,48,51,52,53,54,57],vt=[4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],mt={trace:u(function(){},"trace"),yy:{},symbols_:{error:2,start:3,SPACE:4,NL:5,SD:6,document:7,line:8,statement:9,classDefStatement:10,styleStatement:11,cssClassStatement:12,idStatement:13,DESCR:14,"-->":15,HIDE_EMPTY:16,scale:17,WIDTH:18,COMPOSIT_STATE:19,STRUCT_START:20,STRUCT_STOP:21,STATE_DESCR:22,AS:23,ID:24,FORK:25,JOIN:26,CHOICE:27,CONCURRENT:28,note:29,notePosition:30,NOTE_TEXT:31,direction:32,acc_title:33,acc_title_value:34,acc_descr:35,acc_descr_value:36,acc_descr_multiline_value:37,CLICK:38,STRING:39,HREF:40,classDef:41,CLASSDEF_ID:42,CLASSDEF_STYLEOPTS:43,DEFAULT:44,style:45,STYLE_IDS:46,STYLEDEF_STYLEOPTS:47,class:48,CLASSENTITY_IDS:49,STYLECLASS:50,direction_tb:51,direction_bt:52,direction_rl:53,direction_lr:54,eol:55,";":56,EDGE_STATE:57,STYLE_SEPARATOR:58,left_of:59,right_of:60,$accept:0,$end:1},terminals_:{2:"error",4:"SPACE",5:"NL",6:"SD",14:"DESCR",15:"-->",16:"HIDE_EMPTY",17:"scale",18:"WIDTH",19:"COMPOSIT_STATE",20:"STRUCT_START",21:"STRUCT_STOP",22:"STATE_DESCR",23:"AS",24:"ID",25:"FORK",26:"JOIN",27:"CHOICE",28:"CONCURRENT",29:"note",31:"NOTE_TEXT",33:"acc_title",34:"acc_title_value",35:"acc_descr",36:"acc_descr_value",37:"acc_descr_multiline_value",38:"CLICK",39:"STRING",40:"HREF",41:"classDef",42:"CLASSDEF_ID",43:"CLASSDEF_STYLEOPTS",44:"DEFAULT",45:"style",46:"STYLE_IDS",47:"STYLEDEF_STYLEOPTS",48:"class",49:"CLASSENTITY_IDS",50:"STYLECLASS",51:"direction_tb",52:"direction_bt",53:"direction_rl",54:"direction_lr",56:";",57:"EDGE_STATE",58:"STYLE_SEPARATOR",59:"left_of",60:"right_of"},productions_:[0,[3,2],[3,2],[3,2],[7,0],[7,2],[8,2],[8,1],[8,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,3],[9,4],[9,1],[9,2],[9,1],[9,4],[9,3],[9,6],[9,1],[9,1],[9,1],[9,1],[9,4],[9,4],[9,1],[9,2],[9,2],[9,1],[9,5],[9,5],[10,3],[10,3],[11,3],[12,3],[32,1],[32,1],[32,1],[32,1],[55,1],[55,1],[13,1],[13,1],[13,3],[13,3],[30,1],[30,1]],performAction:u(function(N,a,n,g,T,i,v){var l=i.length-1;switch(T){case 3:return g.setRootDoc(i[l]),i[l];case 4:this.$=[];break;case 5:i[l]!="nl"&&(i[l-1].push(i[l]),this.$=i[l-1]);break;case 6:case 7:this.$=i[l];break;case 8:this.$="nl";break;case 12:this.$=i[l];break;case 13:let ht=i[l-1];ht.description=g.trimColon(i[l]),this.$=ht;break;case 14:this.$={stmt:"relation",state1:i[l-2],state2:i[l]};break;case 15:let dt=g.trimColon(i[l]);this.$={stmt:"relation",state1:i[l-3],state2:i[l-1],description:dt};break;case 19:this.$={stmt:"state",id:i[l-3],type:"default",description:"",doc:i[l-1]};break;case 20:var G=i[l],K=i[l-2].trim();if(i[l].match(":")){var ct=i[l].split(":");G=ct[0],K=[K,ct[1]]}this.$={stmt:"state",id:G,type:"default",description:K};break;case 21:this.$={stmt:"state",id:i[l-3],type:"default",description:i[l-5],doc:i[l-1]};break;case 22:this.$={stmt:"state",id:i[l],type:"fork"};break;case 23:this.$={stmt:"state",id:i[l],type:"join"};break;case 24:this.$={stmt:"state",id:i[l],type:"choice"};break;case 25:this.$={stmt:"state",id:g.getDividerId(),type:"divider"};break;case 26:this.$={stmt:"state",id:i[l-1].trim(),note:{position:i[l-2].trim(),text:i[l].trim()}};break;case 29:this.$=i[l].trim(),g.setAccTitle(this.$);break;case 30:case 31:this.$=i[l].trim(),g.setAccDescription(this.$);break;case 32:this.$={stmt:"click",id:i[l-3],url:i[l-2],tooltip:i[l-1]};break;case 33:this.$={stmt:"click",id:i[l-3],url:i[l-1],tooltip:""};break;case 34:case 35:this.$={stmt:"classDef",id:i[l-1].trim(),classes:i[l].trim()};break;case 36:this.$={stmt:"style",id:i[l-1].trim(),styleClass:i[l].trim()};break;case 37:this.$={stmt:"applyClass",id:i[l-1].trim(),styleClass:i[l].trim()};break;case 38:g.setDirection("TB"),this.$={stmt:"dir",value:"TB"};break;case 39:g.setDirection("BT"),this.$={stmt:"dir",value:"BT"};break;case 40:g.setDirection("RL"),this.$={stmt:"dir",value:"RL"};break;case 41:g.setDirection("LR"),this.$={stmt:"dir",value:"LR"};break;case 44:case 45:this.$={stmt:"state",id:i[l].trim(),type:"default",description:""};break;case 46:this.$={stmt:"state",id:i[l-2].trim(),classes:[i[l].trim()],type:"default",description:""};break;case 47:this.$={stmt:"state",id:i[l-2].trim(),classes:[i[l].trim()],type:"default",description:""};break}},"anonymous"),table:[{3:1,4:e,5:s,6:o},{1:[3]},{3:5,4:e,5:s,6:o},{3:6,4:e,5:s,6:o},t([1,4,5,16,17,19,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],r,{7:7}),{1:[2,1]},{1:[2,2]},{1:[2,3],4:h,5:d,8:8,9:10,10:12,11:13,12:14,13:15,16:y,17:p,19:S,22:m,24:b,25:x,26:O,27:c,28:$,29:E,32:25,33:w,35:L,37:F,38:Y,41:tt,45:et,48:st,51:it,52:rt,53:at,54:nt,57:M},t(f,[2,5]),{9:39,10:12,11:13,12:14,13:15,16:y,17:p,19:S,22:m,24:b,25:x,26:O,27:c,28:$,29:E,32:25,33:w,35:L,37:F,38:Y,41:tt,45:et,48:st,51:it,52:rt,53:at,54:nt,57:M},t(f,[2,7]),t(f,[2,8]),t(f,[2,9]),t(f,[2,10]),t(f,[2,11]),t(f,[2,12],{14:[1,40],15:[1,41]}),t(f,[2,16]),{18:[1,42]},t(f,[2,18],{20:[1,43]}),{23:[1,44]},t(f,[2,22]),t(f,[2,23]),t(f,[2,24]),t(f,[2,25]),{30:45,31:[1,46],59:[1,47],60:[1,48]},t(f,[2,28]),{34:[1,49]},{36:[1,50]},t(f,[2,31]),{13:51,24:b,57:M},{42:[1,52],44:[1,53]},{46:[1,54]},{49:[1,55]},t(ot,[2,44],{58:[1,56]}),t(ot,[2,45],{58:[1,57]}),t(f,[2,38]),t(f,[2,39]),t(f,[2,40]),t(f,[2,41]),t(f,[2,6]),t(f,[2,13]),{13:58,24:b,57:M},t(f,[2,17]),t(vt,r,{7:59}),{24:[1,60]},{24:[1,61]},{23:[1,62]},{24:[2,48]},{24:[2,49]},t(f,[2,29]),t(f,[2,30]),{39:[1,63],40:[1,64]},{43:[1,65]},{43:[1,66]},{47:[1,67]},{50:[1,68]},{24:[1,69]},{24:[1,70]},t(f,[2,14],{14:[1,71]}),{4:h,5:d,8:8,9:10,10:12,11:13,12:14,13:15,16:y,17:p,19:S,21:[1,72],22:m,24:b,25:x,26:O,27:c,28:$,29:E,32:25,33:w,35:L,37:F,38:Y,41:tt,45:et,48:st,51:it,52:rt,53:at,54:nt,57:M},t(f,[2,20],{20:[1,73]}),{31:[1,74]},{24:[1,75]},{39:[1,76]},{39:[1,77]},t(f,[2,34]),t(f,[2,35]),t(f,[2,36]),t(f,[2,37]),t(ot,[2,46]),t(ot,[2,47]),t(f,[2,15]),t(f,[2,19]),t(vt,r,{7:78}),t(f,[2,26]),t(f,[2,27]),{5:[1,79]},{5:[1,80]},{4:h,5:d,8:8,9:10,10:12,11:13,12:14,13:15,16:y,17:p,19:S,21:[1,81],22:m,24:b,25:x,26:O,27:c,28:$,29:E,32:25,33:w,35:L,37:F,38:Y,41:tt,45:et,48:st,51:it,52:rt,53:at,54:nt,57:M},t(f,[2,32]),t(f,[2,33]),t(f,[2,21])],defaultActions:{5:[2,1],6:[2,2],47:[2,48],48:[2,49]},parseError:u(function(N,a){if(a.recoverable)this.trace(N);else{var n=new Error(N);throw n.hash=a,n}},"parseError"),parse:u(function(N){var a=this,n=[0],g=[],T=[null],i=[],v=this.table,l="",G=0,K=0,ct=0,ht=2,dt=1,qt=i.slice.call(arguments,1),k=Object.create(this.lexer),j={yy:{}};for(var St in this.yy)Object.prototype.hasOwnProperty.call(this.yy,St)&&(j.yy[St]=this.yy[St]);k.setInput(N,j.yy),j.yy.lexer=k,j.yy.parser=this,typeof k.yylloc>"u"&&(k.yylloc={});var Tt=k.yylloc;i.push(Tt);var Ht=k.options&&k.options.ranges;typeof j.yy.parseError=="function"?this.parseError=j.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function Xt(I){n.length=n.length-2*I,T.length=T.length-I,i.length=i.length-I}u(Xt,"popStack");function It(){var I;return I=g.pop()||k.lex()||dt,typeof I!="number"&&(I instanceof Array&&(g=I,I=g.pop()),I=a.symbols_[I]||I),I}u(It,"lex");for(var D,_t,U,A,Re,kt,J={},ut,B,Lt,pt;;){if(U=n[n.length-1],this.defaultActions[U]?A=this.defaultActions[U]:((D===null||typeof D>"u")&&(D=It()),A=v[U]&&v[U][D]),typeof A>"u"||!A.length||!A[0]){var bt="";pt=[];for(ut in v[U])this.terminals_[ut]&&ut>ht&&pt.push("'"+this.terminals_[ut]+"'");k.showPosition?bt="Parse error on line "+(G+1)+`:
`+k.showPosition()+`
Expecting `+pt.join(", ")+", got '"+(this.terminals_[D]||D)+"'":bt="Parse error on line "+(G+1)+": Unexpected "+(D==dt?"end of input":"'"+(this.terminals_[D]||D)+"'"),this.parseError(bt,{text:k.match,token:this.terminals_[D]||D,line:k.yylineno,loc:Tt,expected:pt})}if(A[0]instanceof Array&&A.length>1)throw new Error("Parse Error: multiple actions possible at state: "+U+", token: "+D);switch(A[0]){case 1:n.push(D),T.push(k.yytext),i.push(k.yylloc),n.push(A[1]),D=null,_t?(D=_t,_t=null):(K=k.yyleng,l=k.yytext,G=k.yylineno,Tt=k.yylloc,ct>0);break;case 2:if(B=this.productions_[A[1]][1],J.$=T[T.length-B],J._$={first_line:i[i.length-(B||1)].first_line,last_line:i[i.length-1].last_line,first_column:i[i.length-(B||1)].first_column,last_column:i[i.length-1].last_column},Ht&&(J._$.range=[i[i.length-(B||1)].range[0],i[i.length-1].range[1]]),kt=this.performAction.apply(J,[l,K,G,j.yy,A[1],T,i].concat(qt)),typeof kt<"u")return kt;B&&(n=n.slice(0,-1*B*2),T=T.slice(0,-1*B),i=i.slice(0,-1*B)),n.push(this.productions_[A[1]][0]),T.push(J.$),i.push(J._$),Lt=v[n[n.length-2]][n[n.length-1]],n.push(Lt);break;case 3:return!0}}return!0},"parse")},Vt=(function(){var N={EOF:1,parseError:u(function(a,n){if(this.yy.parser)this.yy.parser.parseError(a,n);else throw new Error(a)},"parseError"),setInput:u(function(a,n){return this.yy=n||this.yy||{},this._input=a,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:u(function(){var a=this._input[0];this.yytext+=a,this.yyleng++,this.offset++,this.match+=a,this.matched+=a;var n=a.match(/(?:\r\n?|\n).*/g);return n?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),a},"input"),unput:u(function(a){var n=a.length,g=a.split(/(?:\r\n?|\n)/g);this._input=a+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-n),this.offset-=n;var T=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),g.length-1&&(this.yylineno-=g.length-1);var i=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:g?(g.length===T.length?this.yylloc.first_column:0)+T[T.length-g.length].length-g[0].length:this.yylloc.first_column-n},this.options.ranges&&(this.yylloc.range=[i[0],i[0]+this.yyleng-n]),this.yyleng=this.yytext.length,this},"unput"),more:u(function(){return this._more=!0,this},"more"),reject:u(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:u(function(a){this.unput(this.match.slice(a))},"less"),pastInput:u(function(){var a=this.matched.substr(0,this.matched.length-this.match.length);return(a.length>20?"...":"")+a.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:u(function(){var a=this.match;return a.length<20&&(a+=this._input.substr(0,20-a.length)),(a.substr(0,20)+(a.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:u(function(){var a=this.pastInput(),n=new Array(a.length+1).join("-");return a+this.upcomingInput()+`
`+n+"^"},"showPosition"),test_match:u(function(a,n){var g,T,i;if(this.options.backtrack_lexer&&(i={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(i.yylloc.range=this.yylloc.range.slice(0))),T=a[0].match(/(?:\r\n?|\n).*/g),T&&(this.yylineno+=T.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:T?T[T.length-1].length-T[T.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+a[0].length},this.yytext+=a[0],this.match+=a[0],this.matches=a,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(a[0].length),this.matched+=a[0],g=this.performAction.call(this,this.yy,this,n,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),g)return g;if(this._backtrack){for(var v in i)this[v]=i[v];return!1}return!1},"test_match"),next:u(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var a,n,g,T;this._more||(this.yytext="",this.match="");for(var i=this._currentRules(),v=0;v<i.length;v++)if(g=this._input.match(this.rules[i[v]]),g&&(!n||g[0].length>n[0].length)){if(n=g,T=v,this.options.backtrack_lexer){if(a=this.test_match(g,i[v]),a!==!1)return a;if(this._backtrack){n=!1;continue}else return!1}else if(!this.options.flex)break}return n?(a=this.test_match(n,i[T]),a!==!1?a:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:u(function(){var a=this.next();return a||this.lex()},"lex"),begin:u(function(a){this.conditionStack.push(a)},"begin"),popState:u(function(){var a=this.conditionStack.length-1;return a>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:u(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:u(function(a){return a=this.conditionStack.length-1-Math.abs(a||0),a>=0?this.conditionStack[a]:"INITIAL"},"topState"),pushState:u(function(a){this.begin(a)},"pushState"),stateStackSize:u(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:u(function(a,n,g,T){switch(g){case 0:return 38;case 1:return 40;case 2:return 39;case 3:return 44;case 4:return 51;case 5:return 52;case 6:return 53;case 7:return 54;case 8:break;case 9:break;case 10:return 5;case 11:break;case 12:break;case 13:break;case 14:break;case 15:return this.pushState("SCALE"),17;case 16:return 18;case 17:this.popState();break;case 18:return this.begin("acc_title"),33;case 19:return this.popState(),"acc_title_value";case 20:return this.begin("acc_descr"),35;case 21:return this.popState(),"acc_descr_value";case 22:this.begin("acc_descr_multiline");break;case 23:this.popState();break;case 24:return"acc_descr_multiline_value";case 25:return this.pushState("CLASSDEF"),41;case 26:return this.popState(),this.pushState("CLASSDEFID"),"DEFAULT_CLASSDEF_ID";case 27:return this.popState(),this.pushState("CLASSDEFID"),42;case 28:return this.popState(),43;case 29:return this.pushState("CLASS"),48;case 30:return this.popState(),this.pushState("CLASS_STYLE"),49;case 31:return this.popState(),50;case 32:return this.pushState("STYLE"),45;case 33:return this.popState(),this.pushState("STYLEDEF_STYLES"),46;case 34:return this.popState(),47;case 35:return this.pushState("SCALE"),17;case 36:return 18;case 37:this.popState();break;case 38:this.pushState("STATE");break;case 39:return this.popState(),n.yytext=n.yytext.slice(0,-8).trim(),25;case 40:return this.popState(),n.yytext=n.yytext.slice(0,-8).trim(),26;case 41:return this.popState(),n.yytext=n.yytext.slice(0,-10).trim(),27;case 42:return this.popState(),n.yytext=n.yytext.slice(0,-8).trim(),25;case 43:return this.popState(),n.yytext=n.yytext.slice(0,-8).trim(),26;case 44:return this.popState(),n.yytext=n.yytext.slice(0,-10).trim(),27;case 45:return 51;case 46:return 52;case 47:return 53;case 48:return 54;case 49:this.pushState("STATE_STRING");break;case 50:return this.pushState("STATE_ID"),"AS";case 51:return this.popState(),"ID";case 52:this.popState();break;case 53:return"STATE_DESCR";case 54:return 19;case 55:this.popState();break;case 56:return this.popState(),this.pushState("struct"),20;case 57:break;case 58:return this.popState(),21;case 59:break;case 60:return this.begin("NOTE"),29;case 61:return this.popState(),this.pushState("NOTE_ID"),59;case 62:return this.popState(),this.pushState("NOTE_ID"),60;case 63:this.popState(),this.pushState("FLOATING_NOTE");break;case 64:return this.popState(),this.pushState("FLOATING_NOTE_ID"),"AS";case 65:break;case 66:return"NOTE_TEXT";case 67:return this.popState(),"ID";case 68:return this.popState(),this.pushState("NOTE_TEXT"),24;case 69:return this.popState(),n.yytext=n.yytext.substr(2).trim(),31;case 70:return this.popState(),n.yytext=n.yytext.slice(0,-8).trim(),31;case 71:return 6;case 72:return 6;case 73:return 16;case 74:return 57;case 75:return 24;case 76:return n.yytext=n.yytext.trim(),14;case 77:return 15;case 78:return 28;case 79:return 58;case 80:return 5;case 81:return"INVALID"}},"anonymous"),rules:[/^(?:click\b)/i,/^(?:href\b)/i,/^(?:"[^"]*")/i,/^(?:default\b)/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:[\s]+)/i,/^(?:((?!\n)\s)+)/i,/^(?:#[^\n]*)/i,/^(?:%[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:classDef\s+)/i,/^(?:DEFAULT\s+)/i,/^(?:\w+\s+)/i,/^(?:[^\n]*)/i,/^(?:class\s+)/i,/^(?:(\w+)+((,\s*\w+)*))/i,/^(?:[^\n]*)/i,/^(?:style\s+)/i,/^(?:[\w,]+\s+)/i,/^(?:[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:state\s+)/i,/^(?:.*<<fork>>)/i,/^(?:.*<<join>>)/i,/^(?:.*<<choice>>)/i,/^(?:.*\[\[fork\]\])/i,/^(?:.*\[\[join\]\])/i,/^(?:.*\[\[choice\]\])/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:["])/i,/^(?:\s*as\s+)/i,/^(?:[^\n\{]*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n\s\{]+)/i,/^(?:\n)/i,/^(?:\{)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:\})/i,/^(?:[\n])/i,/^(?:note\s+)/i,/^(?:left of\b)/i,/^(?:right of\b)/i,/^(?:")/i,/^(?:\s*as\s*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n]*)/i,/^(?:\s*[^:\n\s\-]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:[\s\S]*?end note\b)/i,/^(?:stateDiagram\s+)/i,/^(?:stateDiagram-v2\s+)/i,/^(?:hide empty description\b)/i,/^(?:\[\*\])/i,/^(?:[^:\n\s\-\{]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:-->)/i,/^(?:--)/i,/^(?::::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{LINE:{rules:[12,13],inclusive:!1},struct:{rules:[12,13,25,29,32,38,45,46,47,48,57,58,59,60,74,75,76,77,78],inclusive:!1},FLOATING_NOTE_ID:{rules:[67],inclusive:!1},FLOATING_NOTE:{rules:[64,65,66],inclusive:!1},NOTE_TEXT:{rules:[69,70],inclusive:!1},NOTE_ID:{rules:[68],inclusive:!1},NOTE:{rules:[61,62,63],inclusive:!1},STYLEDEF_STYLEOPTS:{rules:[],inclusive:!1},STYLEDEF_STYLES:{rules:[34],inclusive:!1},STYLE_IDS:{rules:[],inclusive:!1},STYLE:{rules:[33],inclusive:!1},CLASS_STYLE:{rules:[31],inclusive:!1},CLASS:{rules:[30],inclusive:!1},CLASSDEFID:{rules:[28],inclusive:!1},CLASSDEF:{rules:[26,27],inclusive:!1},acc_descr_multiline:{rules:[23,24],inclusive:!1},acc_descr:{rules:[21],inclusive:!1},acc_title:{rules:[19],inclusive:!1},SCALE:{rules:[16,17,36,37],inclusive:!1},ALIAS:{rules:[],inclusive:!1},STATE_ID:{rules:[51],inclusive:!1},STATE_STRING:{rules:[52,53],inclusive:!1},FORK_STATE:{rules:[],inclusive:!1},STATE:{rules:[12,13,39,40,41,42,43,44,49,50,54,55,56],inclusive:!1},ID:{rules:[12,13],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,8,9,10,11,13,14,15,18,20,22,25,29,32,35,38,56,60,71,72,73,74,75,76,77,79,80,81],inclusive:!0}}};return N})();mt.lexer=Vt;function lt(){this.yy={}}return u(lt,"Parser"),lt.prototype=mt,mt.Parser=lt,new lt})();Ct.parser=Ct;var Ye=Ct,q="state",V="root",xt="relation",he="classDef",de="style",ue="applyClass",Q="default",Ft="divider",Yt="fill:none",Pt="fill: #333",Gt="text",jt="normal",Et="rect",Dt="rectWithTitle",pe="stateStart",ye="stateEnd",At="divider",Ot="roundedWithTitle",fe="note",ge="noteGroup",Z="statediagram",me="state",Se=`${Z}-${me}`,Ut="transition",Te="note",_e="note-edge",ke=`${Ut} ${_e}`,be=`${Z}-${Te}`,Ee="cluster",De=`${Z}-${Ee}`,Ce="cluster-alt",xe=`${Z}-${Ce}`,zt="parent",Wt="note",$e="state",$t="----",ve=`${$t}${Wt}`,Nt=`${$t}${zt}`,Mt=u((t,e="TB")=>{if(!t.doc)return e;let s=e;for(let o of t.doc)o.stmt==="dir"&&(s=o.value);return s},"getDir"),Ie=u(function(t,e){return e.db.getClasses()},"getClasses"),Le=u(async function(t,e,s,o){_.info("REF0:"),_.info("Drawing state diagram (v2)",e);let{securityLevel:r,state:h,layout:d}=R();o.db.extract(o.db.getRootDocV2());let y=o.db.getData(),p=Qt(e,r);y.type=o.type,y.layoutAlgorithm=d,y.nodeSpacing=h?.nodeSpacing||50,y.rankSpacing=h?.rankSpacing||50,y.markers=["barb"],y.diagramId=e,await te(y,p);let S=8;try{(typeof o.db.getLinks=="function"?o.db.getLinks():new Map).forEach((m,b)=>{let x=typeof b=="string"?b:typeof b?.id=="string"?b.id:"";if(!x){_.warn("⚠️ Invalid or missing stateId from key:",JSON.stringify(b));return}let O=p.node()?.querySelectorAll("g"),c;if(O?.forEach(L=>{L.textContent?.trim()===x&&(c=L)}),!c){_.warn("⚠️ Could not find node matching text:",x);return}let $=c.parentNode;if(!$){_.warn("⚠️ Node has no parent, cannot wrap:",x);return}let E=document.createElementNS("http://www.w3.org/2000/svg","a"),w=m.url.replace(/^"+|"+$/g,"");if(E.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",w),E.setAttribute("target","_blank"),m.tooltip){let L=m.tooltip.replace(/^"+|"+$/g,"");E.setAttribute("title",L)}$.replaceChild(E,c),E.appendChild(c),_.info("🔗 Wrapped node in <a> tag for:",x,m.url)})}catch(m){_.error("❌ Error injecting clickable links:",m)}ee.insertTitle(p,"statediagramTitleText",h?.titleTopMargin??25,o.db.getDiagramTitle()),Zt(p,S,Z,h?.useMaxWidth??!0)},"draw"),Pe={getClasses:Ie,draw:Le,getDir:Mt},ft=new Map,P=0;function gt(t="",e=0,s="",o=$t){let r=s!==null&&s.length>0?`${o}${s}`:"";return`${$e}-${t}${r}-${e}`}u(gt,"stateDomId");var Ae=u((t,e,s,o,r,h,d,y)=>{_.trace("items",e),e.forEach(p=>{switch(p.stmt){case q:X(t,p,s,o,r,h,d,y);break;case Q:X(t,p,s,o,r,h,d,y);break;case xt:{X(t,p.state1,s,o,r,h,d,y),X(t,p.state2,s,o,r,h,d,y);let S={id:"edge"+P,start:p.state1.id,end:p.state2.id,arrowhead:"normal",arrowTypeEnd:"arrow_barb",style:Yt,labelStyle:"",label:z.sanitizeText(p.description??"",R()),arrowheadStyle:Pt,labelpos:"c",labelType:Gt,thickness:jt,classes:Ut,look:d};r.push(S),P++}break}})},"setupDoc"),Rt=u((t,e="TB")=>{let s=e;if(t.doc)for(let o of t.doc)o.stmt==="dir"&&(s=o.value);return s},"getDir");function H(t,e,s){if(!e.id||e.id==="</join></fork>"||e.id==="</choice>")return;e.cssClasses&&(Array.isArray(e.cssCompiledStyles)||(e.cssCompiledStyles=[]),e.cssClasses.split(" ").forEach(r=>{let h=s.get(r);h&&(e.cssCompiledStyles=[...e.cssCompiledStyles??[],...h.styles])}));let o=t.find(r=>r.id===e.id);o?Object.assign(o,e):t.push(e)}u(H,"insertOrUpdateNode");function Kt(t){return t?.classes?.join(" ")??""}u(Kt,"getClassesFromDbInfo");function Jt(t){return t?.styles??[]}u(Jt,"getStylesFromDbInfo");var X=u((t,e,s,o,r,h,d,y)=>{let p=e.id,S=s.get(p),m=Kt(S),b=Jt(S),x=R();if(_.info("dataFetcher parsedItem",e,S,b),p!=="root"){let O=Et;e.start===!0?O=pe:e.start===!1&&(O=ye),e.type!==Q&&(O=e.type),ft.get(p)||ft.set(p,{id:p,shape:O,description:z.sanitizeText(p,x),cssClasses:`${m} ${Se}`,cssStyles:b});let c=ft.get(p);e.description&&(Array.isArray(c.description)?(c.shape=Dt,c.description.push(e.description)):c.description?.length&&c.description.length>0?(c.shape=Dt,c.description===p?c.description=[e.description]:c.description=[c.description,e.description]):(c.shape=Et,c.description=e.description),c.description=z.sanitizeTextOrArray(c.description,x)),c.description?.length===1&&c.shape===Dt&&(c.type==="group"?c.shape=Ot:c.shape=Et),!c.type&&e.doc&&(_.info("Setting cluster for XCX",p,Rt(e)),c.type="group",c.isGroup=!0,c.dir=Rt(e),c.shape=e.type===Ft?At:Ot,c.cssClasses=`${c.cssClasses} ${De} ${h?xe:""}`);let $={labelStyle:"",shape:c.shape,label:c.description,cssClasses:c.cssClasses,cssCompiledStyles:[],cssStyles:c.cssStyles,id:p,dir:c.dir,domId:gt(p,P),type:c.type,isGroup:c.type==="group",padding:8,rx:10,ry:10,look:d};if($.shape===At&&($.label=""),t&&t.id!=="root"&&(_.trace("Setting node ",p," to be child of its parent ",t.id),$.parentId=t.id),$.centerLabel=!0,e.note){let E={labelStyle:"",shape:fe,label:e.note.text,cssClasses:be,cssStyles:[],cssCompiledStyles:[],id:p+ve+"-"+P,domId:gt(p,P,Wt),type:c.type,isGroup:c.type==="group",padding:x.flowchart?.padding,look:d,position:e.note.position},w=p+Nt,L={labelStyle:"",shape:ge,label:e.note.text,cssClasses:c.cssClasses,cssStyles:[],id:p+Nt,domId:gt(p,P,zt),type:"group",isGroup:!0,padding:16,look:d,position:e.note.position};P++,L.id=w,E.parentId=w,H(o,L,y),H(o,E,y),H(o,$,y);let F=p,Y=E.id;e.note.position==="left of"&&(F=E.id,Y=p),r.push({id:F+"-"+Y,start:F,end:Y,arrowhead:"none",arrowTypeEnd:"",style:Yt,labelStyle:"",classes:ke,arrowheadStyle:Pt,labelpos:"c",labelType:Gt,thickness:jt,look:d})}else H(o,$,y)}e.doc&&(_.trace("Adding nodes children "),Ae(e,e.doc,s,o,r,!h,d,y))},"dataFetcher"),Oe=u(()=>{ft.clear(),P=0},"reset"),C={START_NODE:"[*]",START_TYPE:"start",END_NODE:"[*]",END_TYPE:"end",COLOR_KEYWORD:"color",FILL_KEYWORD:"fill",BG_FILL:"bgFill",STYLECLASS_SEP:","},wt=u(()=>new Map,"newClassesList"),Bt=u(()=>({relations:[],states:new Map,documents:{}}),"newDoc"),yt=u(t=>JSON.parse(JSON.stringify(t)),"clone"),W,Ge=(W=class{constructor(e){this.version=e,this.nodes=[],this.edges=[],this.rootDoc=[],this.classes=wt(),this.documents={root:Bt()},this.currentDocument=this.documents.root,this.startEndCount=0,this.dividerCnt=0,this.links=new Map,this.getAccTitle=se,this.setAccTitle=ie,this.getAccDescription=re,this.setAccDescription=ae,this.setDiagramTitle=ne,this.getDiagramTitle=oe,this.clear(),this.setRootDoc=this.setRootDoc.bind(this),this.getDividerId=this.getDividerId.bind(this),this.setDirection=this.setDirection.bind(this),this.trimColon=this.trimColon.bind(this)}extract(e){this.clear(!0);for(let r of Array.isArray(e)?e:e.doc)switch(r.stmt){case q:this.addState(r.id.trim(),r.type,r.doc,r.description,r.note);break;case xt:this.addRelation(r.state1,r.state2,r.description);break;case he:this.addStyleClass(r.id.trim(),r.classes);break;case de:this.handleStyleDef(r);break;case ue:this.setCssClass(r.id.trim(),r.styleClass);break;case"click":this.addLink(r.id,r.url,r.tooltip);break}let s=this.getStates(),o=R();Oe(),X(void 0,this.getRootDocV2(),s,this.nodes,this.edges,!0,o.look,this.classes);for(let r of this.nodes)if(Array.isArray(r.label)){if(r.description=r.label.slice(1),r.isGroup&&r.description.length>0)throw new Error(`Group nodes can only have label. Remove the additional description for node [${r.id}]`);r.label=r.label[0]}}handleStyleDef(e){let s=e.id.trim().split(","),o=e.styleClass.split(",");for(let r of s){let h=this.getState(r);if(!h){let d=r.trim();this.addState(d),h=this.getState(d)}h&&(h.styles=o.map(d=>d.replace(/;/g,"")?.trim()))}}setRootDoc(e){_.info("Setting root doc",e),this.rootDoc=e,this.version===1?this.extract(e):this.extract(this.getRootDocV2())}docTranslator(e,s,o){if(s.stmt===xt){this.docTranslator(e,s.state1,!0),this.docTranslator(e,s.state2,!1);return}if(s.stmt===q&&(s.id===C.START_NODE?(s.id=e.id+(o?"_start":"_end"),s.start=o):s.id=s.id.trim()),s.stmt!==V&&s.stmt!==q||!s.doc)return;let r=[],h=[];for(let d of s.doc)if(d.type===Ft){let y=yt(d);y.doc=yt(h),r.push(y),h=[]}else h.push(d);if(r.length>0&&h.length>0){let d={stmt:q,id:le(),type:"divider",doc:yt(h)};r.push(yt(d)),s.doc=r}s.doc.forEach(d=>this.docTranslator(s,d,!0))}getRootDocV2(){return this.docTranslator({id:V,stmt:V},{id:V,stmt:V,doc:this.rootDoc},!0),{id:V,doc:this.rootDoc}}addState(e,s=Q,o=void 0,r=void 0,h=void 0,d=void 0,y=void 0,p=void 0){let S=e?.trim();if(!this.currentDocument.states.has(S))_.info("Adding state ",S,r),this.currentDocument.states.set(S,{stmt:q,id:S,descriptions:[],type:s,doc:o,note:h,classes:[],styles:[],textStyles:[]});else{let m=this.currentDocument.states.get(S);if(!m)throw new Error(`State not found: ${S}`);m.doc||(m.doc=o),m.type||(m.type=s)}if(r&&(_.info("Setting state description",S,r),(Array.isArray(r)?r:[r]).forEach(m=>this.addDescription(S,m.trim()))),h){let m=this.currentDocument.states.get(S);if(!m)throw new Error(`State not found: ${S}`);m.note=h,m.note.text=z.sanitizeText(m.note.text,R())}d&&(_.info("Setting state classes",S,d),(Array.isArray(d)?d:[d]).forEach(m=>this.setCssClass(S,m.trim()))),y&&(_.info("Setting state styles",S,y),(Array.isArray(y)?y:[y]).forEach(m=>this.setStyle(S,m.trim()))),p&&(_.info("Setting state styles",S,y),(Array.isArray(p)?p:[p]).forEach(m=>this.setTextStyle(S,m.trim())))}clear(e){this.nodes=[],this.edges=[],this.documents={root:Bt()},this.currentDocument=this.documents.root,this.startEndCount=0,this.classes=wt(),e||(this.links=new Map,ce())}getState(e){return this.currentDocument.states.get(e)}getStates(){return this.currentDocument.states}logDocuments(){_.info("Documents = ",this.documents)}getRelations(){return this.currentDocument.relations}addLink(e,s,o){this.links.set(e,{url:s,tooltip:o}),_.warn("Adding link",e,s,o)}getLinks(){return this.links}startIdIfNeeded(e=""){return e===C.START_NODE?(this.startEndCount++,`${C.START_TYPE}${this.startEndCount}`):e}startTypeIfNeeded(e="",s=Q){return e===C.START_NODE?C.START_TYPE:s}endIdIfNeeded(e=""){return e===C.END_NODE?(this.startEndCount++,`${C.END_TYPE}${this.startEndCount}`):e}endTypeIfNeeded(e="",s=Q){return e===C.END_NODE?C.END_TYPE:s}addRelationObjs(e,s,o=""){let r=this.startIdIfNeeded(e.id.trim()),h=this.startTypeIfNeeded(e.id.trim(),e.type),d=this.startIdIfNeeded(s.id.trim()),y=this.startTypeIfNeeded(s.id.trim(),s.type);this.addState(r,h,e.doc,e.description,e.note,e.classes,e.styles,e.textStyles),this.addState(d,y,s.doc,s.description,s.note,s.classes,s.styles,s.textStyles),this.currentDocument.relations.push({id1:r,id2:d,relationTitle:z.sanitizeText(o,R())})}addRelation(e,s,o){if(typeof e=="object"&&typeof s=="object")this.addRelationObjs(e,s,o);else if(typeof e=="string"&&typeof s=="string"){let r=this.startIdIfNeeded(e.trim()),h=this.startTypeIfNeeded(e),d=this.endIdIfNeeded(s.trim()),y=this.endTypeIfNeeded(s);this.addState(r,h),this.addState(d,y),this.currentDocument.relations.push({id1:r,id2:d,relationTitle:o?z.sanitizeText(o,R()):void 0})}}addDescription(e,s){let o=this.currentDocument.states.get(e),r=s.startsWith(":")?s.replace(":","").trim():s;o?.descriptions?.push(z.sanitizeText(r,R()))}cleanupLabel(e){return e.startsWith(":")?e.slice(2).trim():e.trim()}getDividerId(){return this.dividerCnt++,`divider-id-${this.dividerCnt}`}addStyleClass(e,s=""){this.classes.has(e)||this.classes.set(e,{id:e,styles:[],textStyles:[]});let o=this.classes.get(e);s&&o&&s.split(C.STYLECLASS_SEP).forEach(r=>{let h=r.replace(/([^;]*);/,"$1").trim();if(RegExp(C.COLOR_KEYWORD).exec(r)){let d=h.replace(C.FILL_KEYWORD,C.BG_FILL).replace(C.COLOR_KEYWORD,C.FILL_KEYWORD);o.textStyles.push(d)}o.styles.push(h)})}getClasses(){return this.classes}setCssClass(e,s){e.split(",").forEach(o=>{let r=this.getState(o);if(!r){let h=o.trim();this.addState(h),r=this.getState(h)}r?.classes?.push(s)})}setStyle(e,s){this.getState(e)?.styles?.push(s)}setTextStyle(e,s){this.getState(e)?.textStyles?.push(s)}getDirectionStatement(){return this.rootDoc.find(e=>e.stmt==="dir")}getDirection(){return this.getDirectionStatement()?.value??"TB"}setDirection(e){let s=this.getDirectionStatement();s?s.value=e:this.rootDoc.unshift({stmt:"dir",value:e})}trimColon(e){return e.startsWith(":")?e.slice(1).trim():e.trim()}getData(){let e=R();return{nodes:this.nodes,edges:this.edges,other:{},config:e,direction:Mt(this.getRootDocV2())}}getConfig(){return R().state}},u(W,"StateDB"),W.relationType={AGGREGATION:0,EXTENSION:1,COMPOSITION:2,DEPENDENCY:3},W),Ne=u(t=>`
defs #statediagram-barbEnd {
    fill: ${t.transitionColor};
    stroke: ${t.transitionColor};
  }
g.stateGroup text {
  fill: ${t.nodeBorder};
  stroke: none;
  font-size: 10px;
}
g.stateGroup text {
  fill: ${t.textColor};
  stroke: none;
  font-size: 10px;

}
g.stateGroup .state-title {
  font-weight: bolder;
  fill: ${t.stateLabelColor};
}

g.stateGroup rect {
  fill: ${t.mainBkg};
  stroke: ${t.nodeBorder};
}

g.stateGroup line {
  stroke: ${t.lineColor};
  stroke-width: 1;
}

.transition {
  stroke: ${t.transitionColor};
  stroke-width: 1;
  fill: none;
}

.stateGroup .composit {
  fill: ${t.background};
  border-bottom: 1px
}

.stateGroup .alt-composit {
  fill: #e0e0e0;
  border-bottom: 1px
}

.state-note {
  stroke: ${t.noteBorderColor};
  fill: ${t.noteBkgColor};

  text {
    fill: ${t.noteTextColor};
    stroke: none;
    font-size: 10px;
  }
}

.stateLabel .box {
  stroke: none;
  stroke-width: 0;
  fill: ${t.mainBkg};
  opacity: 0.5;
}

.edgeLabel .label rect {
  fill: ${t.labelBackgroundColor};
  opacity: 0.5;
}
.edgeLabel {
  background-color: ${t.edgeLabelBackground};
  p {
    background-color: ${t.edgeLabelBackground};
  }
  rect {
    opacity: 0.5;
    background-color: ${t.edgeLabelBackground};
    fill: ${t.edgeLabelBackground};
  }
  text-align: center;
}
.edgeLabel .label text {
  fill: ${t.transitionLabelColor||t.tertiaryTextColor};
}
.label div .edgeLabel {
  color: ${t.transitionLabelColor||t.tertiaryTextColor};
}

.stateLabel text {
  fill: ${t.stateLabelColor};
  font-size: 10px;
  font-weight: bold;
}

.node circle.state-start {
  fill: ${t.specialStateColor};
  stroke: ${t.specialStateColor};
}

.node .fork-join {
  fill: ${t.specialStateColor};
  stroke: ${t.specialStateColor};
}

.node circle.state-end {
  fill: ${t.innerEndBackground};
  stroke: ${t.background};
  stroke-width: 1.5
}
.end-state-inner {
  fill: ${t.compositeBackground||t.background};
  // stroke: ${t.background};
  stroke-width: 1.5
}

.node rect {
  fill: ${t.stateBkg||t.mainBkg};
  stroke: ${t.stateBorder||t.nodeBorder};
  stroke-width: 1px;
}
.node polygon {
  fill: ${t.mainBkg};
  stroke: ${t.stateBorder||t.nodeBorder};;
  stroke-width: 1px;
}
#statediagram-barbEnd {
  fill: ${t.lineColor};
}

.statediagram-cluster rect {
  fill: ${t.compositeTitleBackground};
  stroke: ${t.stateBorder||t.nodeBorder};
  stroke-width: 1px;
}

.cluster-label, .nodeLabel {
  color: ${t.stateLabelColor};
  // line-height: 1;
}

.statediagram-cluster rect.outer {
  rx: 5px;
  ry: 5px;
}
.statediagram-state .divider {
  stroke: ${t.stateBorder||t.nodeBorder};
}

.statediagram-state .title-state {
  rx: 5px;
  ry: 5px;
}
.statediagram-cluster.statediagram-cluster .inner {
  fill: ${t.compositeBackground||t.background};
}
.statediagram-cluster.statediagram-cluster-alt .inner {
  fill: ${t.altBackground?t.altBackground:"#efefef"};
}

.statediagram-cluster .inner {
  rx:0;
  ry:0;
}

.statediagram-state rect.basic {
  rx: 5px;
  ry: 5px;
}
.statediagram-state rect.divider {
  stroke-dasharray: 10,10;
  fill: ${t.altBackground?t.altBackground:"#efefef"};
}

.note-edge {
  stroke-dasharray: 5;
}

.statediagram-note rect {
  fill: ${t.noteBkgColor};
  stroke: ${t.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}
.statediagram-note rect {
  fill: ${t.noteBkgColor};
  stroke: ${t.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}

.statediagram-note text {
  fill: ${t.noteTextColor};
}

.statediagram-note .nodeLabel {
  color: ${t.noteTextColor};
}
.statediagram .edgeLabel {
  color: red; // ${t.noteTextColor};
}

#dependencyStart, #dependencyEnd {
  fill: ${t.lineColor};
  stroke: ${t.lineColor};
  stroke-width: 1;
}

.statediagramTitleText {
  text-anchor: middle;
  font-size: 18px;
  fill: ${t.textColor};
}
`,"getStyles"),je=Ne;export{Ye as B,Ge as _,je as g,Pe as q};
