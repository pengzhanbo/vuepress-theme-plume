import{m as l,$ as ce,G as de,e as ue,j as he,U as fe,H as ye,a as ot,i as Tt,aq as ke,ar as me,as as pe,W as ge,at as be,au as Te,q as dt,p as wt,av as ve,aw as Ht,ax as Vt,ay as xe,az as we,aA as _e,aB as $e,aC as De,aD as Se,aE as Ce,aF as qt,aG as Ut,aH as Zt,aI as Xt,aJ as Rt,aK as Ee,h as Me,N as Ae,aL as te,f as Le,d as Ie,aM as Lt}from"./mermaid.esm.min-CNstUCuN.js";import"./app-WksTDQ1H.js";var Ye=Lt((e,r)=>{(function(i,a){typeof e=="object"&&typeof r<"u"?r.exports=a():typeof define=="function"&&define.amd?define(a):(i=typeof globalThis<"u"?globalThis:i||self).dayjs_plugin_isoWeek=a()})(e,(function(){var i="day";return function(a,s,u){var y=l(function(D){return D.add(4-D.isoWeekday(),i)},"a"),$=s.prototype;$.isoWeekYear=function(){return y(this).year()},$.isoWeek=function(D){if(!this.$utils().u(D))return this.add(7*(D-this.isoWeek()),i);var x,E,W,j,B=y(this),S=(x=this.isoWeekYear(),E=this.$u,W=(E?u.utc:u)().year(x).startOf("year"),j=4-W.isoWeekday(),W.isoWeekday()>4&&(j+=7),W.add(j,i));return B.diff(S,"week")+1},$.isoWeekday=function(D){return this.$utils().u(D)?this.day()||7:this.day(this.day()%7?D:D-7)};var L=$.startOf;$.startOf=function(D,x){var E=this.$utils(),W=!!E.u(x)||x;return E.p(D)==="isoweek"?W?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf("day"):L.bind(this)(D,x)}}}))}),We=Lt((e,r)=>{(function(i,a){typeof e=="object"&&typeof r<"u"?r.exports=a():typeof define=="function"&&define.amd?define(a):(i=typeof globalThis<"u"?globalThis:i||self).dayjs_plugin_customParseFormat=a()})(e,(function(){var i={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},a=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,s=/\d/,u=/\d\d/,y=/\d\d?/,$=/\d*[^-_:/,()\s\d]+/,L={},D=l(function(p){return(p=+p)+(p>68?1900:2e3)},"a"),x=l(function(p){return function(C){this[p]=+C}},"f"),E=[/[+-]\d\d:?(\d\d)?|Z/,function(p){(this.zone||(this.zone={})).offset=(function(C){if(!C||C==="Z")return 0;var M=C.match(/([+-]|\d\d)/g),A=60*M[1]+(+M[2]||0);return A===0?0:M[0]==="+"?-A:A})(p)}],W=l(function(p){var C=L[p];return C&&(C.indexOf?C:C.s.concat(C.f))},"u"),j=l(function(p,C){var M,A=L.meridiem;if(A){for(var G=1;G<=24;G+=1)if(p.indexOf(A(G,0,C))>-1){M=G>12;break}}else M=p===(C?"pm":"PM");return M},"d"),B={A:[$,function(p){this.afternoon=j(p,!1)}],a:[$,function(p){this.afternoon=j(p,!0)}],Q:[s,function(p){this.month=3*(p-1)+1}],S:[s,function(p){this.milliseconds=100*+p}],SS:[u,function(p){this.milliseconds=10*+p}],SSS:[/\d{3}/,function(p){this.milliseconds=+p}],s:[y,x("seconds")],ss:[y,x("seconds")],m:[y,x("minutes")],mm:[y,x("minutes")],H:[y,x("hours")],h:[y,x("hours")],HH:[y,x("hours")],hh:[y,x("hours")],D:[y,x("day")],DD:[u,x("day")],Do:[$,function(p){var C=L.ordinal,M=p.match(/\d+/);if(this.day=M[0],C)for(var A=1;A<=31;A+=1)C(A).replace(/\[|\]/g,"")===p&&(this.day=A)}],w:[y,x("week")],ww:[u,x("week")],M:[y,x("month")],MM:[u,x("month")],MMM:[$,function(p){var C=W("months"),M=(W("monthsShort")||C.map((function(A){return A.slice(0,3)}))).indexOf(p)+1;if(M<1)throw new Error;this.month=M%12||M}],MMMM:[$,function(p){var C=W("months").indexOf(p)+1;if(C<1)throw new Error;this.month=C%12||C}],Y:[/[+-]?\d+/,x("year")],YY:[u,function(p){this.year=D(p)}],YYYY:[/\d{4}/,x("year")],Z:E,ZZ:E};function S(p){var C,M;C=p,M=L&&L.formats;for(var A=(p=C.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,(function(v,b,m){var g=m&&m.toUpperCase();return b||M[m]||i[m]||M[g].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,(function(o,d,c){return d||c.slice(1)}))}))).match(a),G=A.length,N=0;N<G;N+=1){var U=A[N],H=B[U],k=H&&H[0],T=H&&H[1];A[N]=T?{regex:k,parser:T}:U.replace(/^\[|\]$/g,"")}return function(v){for(var b={},m=0,g=0;m<G;m+=1){var o=A[m];if(typeof o=="string")g+=o.length;else{var d=o.regex,c=o.parser,f=v.slice(g),t=d.exec(f)[0];c.call(b,t),v=v.replace(t,"")}}return(function(h){var n=h.afternoon;if(n!==void 0){var _=h.hours;n?_<12&&(h.hours+=12):_===12&&(h.hours=0),delete h.afternoon}})(b),b}}return l(S,"l"),function(p,C,M){M.p.customParseFormat=!0,p&&p.parseTwoDigitYear&&(D=p.parseTwoDigitYear);var A=C.prototype,G=A.parse;A.parse=function(N){var U=N.date,H=N.utc,k=N.args;this.$u=H;var T=k[1];if(typeof T=="string"){var v=k[2]===!0,b=k[3]===!0,m=v||b,g=k[2];b&&(g=k[2]),L=this.$locale(),!v&&g&&(L=M.Ls[g]),this.$d=(function(f,t,h,n){try{if(["x","X"].indexOf(t)>-1)return new Date((t==="X"?1e3:1)*f);var _=S(t)(f),w=_.year,I=_.month,Y=_.day,it=_.hours,ut=_.minutes,F=_.seconds,R=_.milliseconds,rt=_.zone,at=_.week,ht=new Date,ft=Y||(w||I?1:ht.getDate()),st=w||ht.getFullYear(),P=0;w&&!I||(P=I>0?I-1:ht.getMonth());var J,Z=it||0,O=ut||0,pt=F||0,tt=R||0;return rt?new Date(Date.UTC(st,P,ft,Z,O,pt,tt+60*rt.offset*1e3)):h?new Date(Date.UTC(st,P,ft,Z,O,pt,tt)):(J=new Date(st,P,ft,Z,O,pt,tt),at&&(J=n(J).week(at).toDate()),J)}catch{return new Date("")}})(U,T,H,M),this.init(),g&&g!==!0&&(this.$L=this.locale(g).$L),m&&U!=this.format(T)&&(this.$d=new Date("")),L={}}else if(T instanceof Array)for(var o=T.length,d=1;d<=o;d+=1){k[1]=T[d-1];var c=M.apply(this,k);if(c.isValid()){this.$d=c.$d,this.$L=c.$L,this.init();break}d===o&&(this.$d=new Date(""))}else G.call(this,N)}}}))}),Fe=Lt((e,r)=>{(function(i,a){typeof e=="object"&&typeof r<"u"?r.exports=a():typeof define=="function"&&define.amd?define(a):(i=typeof globalThis<"u"?globalThis:i||self).dayjs_plugin_advancedFormat=a()})(e,(function(){return function(i,a){var s=a.prototype,u=s.format;s.format=function(y){var $=this,L=this.$locale();if(!this.isValid())return u.bind(this)(y);var D=this.$utils(),x=(y||"YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,(function(E){switch(E){case"Q":return Math.ceil(($.$M+1)/3);case"Do":return L.ordinal($.$D);case"gggg":return $.weekYear();case"GGGG":return $.isoWeekYear();case"wo":return L.ordinal($.week(),"W");case"w":case"ww":return D.s($.week(),E==="w"?1:2,"0");case"W":case"WW":return D.s($.isoWeek(),E==="W"?1:2,"0");case"k":case"kk":return D.s(String($.$H===0?24:$.$H),E==="k"?1:2,"0");case"X":return Math.floor($.$d.getTime()/1e3);case"x":return $.$d.getTime();case"z":return"["+$.offsetName()+"]";case"zzz":return"["+$.offsetName("long")+"]";default:return E}}));return u.bind(this)(x)}}}))}),Ct=(function(){var e=l(function(g,o,d,c){for(d=d||{},c=g.length;c--;d[g[c]]=o);return d},"o"),r=[6,8,10,12,13,14,15,16,17,18,20,21,22,23,24,25,26,27,28,29,30,31,33,35,36,38,40],i=[1,26],a=[1,27],s=[1,28],u=[1,29],y=[1,30],$=[1,31],L=[1,32],D=[1,33],x=[1,34],E=[1,9],W=[1,10],j=[1,11],B=[1,12],S=[1,13],p=[1,14],C=[1,15],M=[1,16],A=[1,19],G=[1,20],N=[1,21],U=[1,22],H=[1,23],k=[1,25],T=[1,35],v={trace:l(function(){},"trace"),yy:{},symbols_:{error:2,start:3,gantt:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NL:10,weekday:11,weekday_monday:12,weekday_tuesday:13,weekday_wednesday:14,weekday_thursday:15,weekday_friday:16,weekday_saturday:17,weekday_sunday:18,weekend:19,weekend_friday:20,weekend_saturday:21,dateFormat:22,inclusiveEndDates:23,topAxis:24,axisFormat:25,tickInterval:26,excludes:27,includes:28,todayMarker:29,title:30,acc_title:31,acc_title_value:32,acc_descr:33,acc_descr_value:34,acc_descr_multiline_value:35,section:36,clickStatement:37,taskTxt:38,taskData:39,click:40,callbackname:41,callbackargs:42,href:43,clickStatementDebug:44,$accept:0,$end:1},terminals_:{2:"error",4:"gantt",6:"EOF",8:"SPACE",10:"NL",12:"weekday_monday",13:"weekday_tuesday",14:"weekday_wednesday",15:"weekday_thursday",16:"weekday_friday",17:"weekday_saturday",18:"weekday_sunday",20:"weekend_friday",21:"weekend_saturday",22:"dateFormat",23:"inclusiveEndDates",24:"topAxis",25:"axisFormat",26:"tickInterval",27:"excludes",28:"includes",29:"todayMarker",30:"title",31:"acc_title",32:"acc_title_value",33:"acc_descr",34:"acc_descr_value",35:"acc_descr_multiline_value",36:"section",38:"taskTxt",39:"taskData",40:"click",41:"callbackname",42:"callbackargs",43:"href"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[19,1],[19,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,1],[9,2],[37,2],[37,3],[37,3],[37,4],[37,3],[37,4],[37,2],[44,2],[44,3],[44,3],[44,4],[44,3],[44,4],[44,2]],performAction:l(function(g,o,d,c,f,t,h){var n=t.length-1;switch(f){case 1:return t[n-1];case 2:this.$=[];break;case 3:t[n-1].push(t[n]),this.$=t[n-1];break;case 4:case 5:this.$=t[n];break;case 6:case 7:this.$=[];break;case 8:c.setWeekday("monday");break;case 9:c.setWeekday("tuesday");break;case 10:c.setWeekday("wednesday");break;case 11:c.setWeekday("thursday");break;case 12:c.setWeekday("friday");break;case 13:c.setWeekday("saturday");break;case 14:c.setWeekday("sunday");break;case 15:c.setWeekend("friday");break;case 16:c.setWeekend("saturday");break;case 17:c.setDateFormat(t[n].substr(11)),this.$=t[n].substr(11);break;case 18:c.enableInclusiveEndDates(),this.$=t[n].substr(18);break;case 19:c.TopAxis(),this.$=t[n].substr(8);break;case 20:c.setAxisFormat(t[n].substr(11)),this.$=t[n].substr(11);break;case 21:c.setTickInterval(t[n].substr(13)),this.$=t[n].substr(13);break;case 22:c.setExcludes(t[n].substr(9)),this.$=t[n].substr(9);break;case 23:c.setIncludes(t[n].substr(9)),this.$=t[n].substr(9);break;case 24:c.setTodayMarker(t[n].substr(12)),this.$=t[n].substr(12);break;case 27:c.setDiagramTitle(t[n].substr(6)),this.$=t[n].substr(6);break;case 28:this.$=t[n].trim(),c.setAccTitle(this.$);break;case 29:case 30:this.$=t[n].trim(),c.setAccDescription(this.$);break;case 31:c.addSection(t[n].substr(8)),this.$=t[n].substr(8);break;case 33:c.addTask(t[n-1],t[n]),this.$="task";break;case 34:this.$=t[n-1],c.setClickEvent(t[n-1],t[n],null);break;case 35:this.$=t[n-2],c.setClickEvent(t[n-2],t[n-1],t[n]);break;case 36:this.$=t[n-2],c.setClickEvent(t[n-2],t[n-1],null),c.setLink(t[n-2],t[n]);break;case 37:this.$=t[n-3],c.setClickEvent(t[n-3],t[n-2],t[n-1]),c.setLink(t[n-3],t[n]);break;case 38:this.$=t[n-2],c.setClickEvent(t[n-2],t[n],null),c.setLink(t[n-2],t[n-1]);break;case 39:this.$=t[n-3],c.setClickEvent(t[n-3],t[n-1],t[n]),c.setLink(t[n-3],t[n-2]);break;case 40:this.$=t[n-1],c.setLink(t[n-1],t[n]);break;case 41:case 47:this.$=t[n-1]+" "+t[n];break;case 42:case 43:case 45:this.$=t[n-2]+" "+t[n-1]+" "+t[n];break;case 44:case 46:this.$=t[n-3]+" "+t[n-2]+" "+t[n-1]+" "+t[n];break}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},e(r,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:17,12:i,13:a,14:s,15:u,16:y,17:$,18:L,19:18,20:D,21:x,22:E,23:W,24:j,25:B,26:S,27:p,28:C,29:M,30:A,31:G,33:N,35:U,36:H,37:24,38:k,40:T},e(r,[2,7],{1:[2,1]}),e(r,[2,3]),{9:36,11:17,12:i,13:a,14:s,15:u,16:y,17:$,18:L,19:18,20:D,21:x,22:E,23:W,24:j,25:B,26:S,27:p,28:C,29:M,30:A,31:G,33:N,35:U,36:H,37:24,38:k,40:T},e(r,[2,5]),e(r,[2,6]),e(r,[2,17]),e(r,[2,18]),e(r,[2,19]),e(r,[2,20]),e(r,[2,21]),e(r,[2,22]),e(r,[2,23]),e(r,[2,24]),e(r,[2,25]),e(r,[2,26]),e(r,[2,27]),{32:[1,37]},{34:[1,38]},e(r,[2,30]),e(r,[2,31]),e(r,[2,32]),{39:[1,39]},e(r,[2,8]),e(r,[2,9]),e(r,[2,10]),e(r,[2,11]),e(r,[2,12]),e(r,[2,13]),e(r,[2,14]),e(r,[2,15]),e(r,[2,16]),{41:[1,40],43:[1,41]},e(r,[2,4]),e(r,[2,28]),e(r,[2,29]),e(r,[2,33]),e(r,[2,34],{42:[1,42],43:[1,43]}),e(r,[2,40],{41:[1,44]}),e(r,[2,35],{43:[1,45]}),e(r,[2,36]),e(r,[2,38],{42:[1,46]}),e(r,[2,37]),e(r,[2,39])],defaultActions:{},parseError:l(function(g,o){if(o.recoverable)this.trace(g);else{var d=new Error(g);throw d.hash=o,d}},"parseError"),parse:l(function(g){var o=this,d=[0],c=[],f=[null],t=[],h=this.table,n="",_=0,w=0,I=0,Y=2,it=1,ut=t.slice.call(arguments,1),F=Object.create(this.lexer),R={yy:{}};for(var rt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,rt)&&(R.yy[rt]=this.yy[rt]);F.setInput(g,R.yy),R.yy.lexer=F,R.yy.parser=this,typeof F.yylloc>"u"&&(F.yylloc={});var at=F.yylloc;t.push(at);var ht=F.options&&F.options.ranges;typeof R.yy.parseError=="function"?this.parseError=R.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function ft(V){d.length=d.length-2*V,f.length=f.length-V,t.length=t.length-V}l(ft,"popStack");function st(){var V;return V=c.pop()||F.lex()||it,typeof V!="number"&&(V instanceof Array&&(c=V,V=c.pop()),V=o.symbols_[V]||V),V}l(st,"lex");for(var P,J,Z,O,pt,tt,nt={},gt,K,Nt,bt;;){if(Z=d[d.length-1],this.defaultActions[Z]?O=this.defaultActions[Z]:((P===null||typeof P>"u")&&(P=st()),O=h[Z]&&h[Z][P]),typeof O>"u"||!O.length||!O[0]){var Dt="";bt=[];for(gt in h[Z])this.terminals_[gt]&&gt>Y&&bt.push("'"+this.terminals_[gt]+"'");F.showPosition?Dt="Parse error on line "+(_+1)+`:
`+F.showPosition()+`
Expecting `+bt.join(", ")+", got '"+(this.terminals_[P]||P)+"'":Dt="Parse error on line "+(_+1)+": Unexpected "+(P==it?"end of input":"'"+(this.terminals_[P]||P)+"'"),this.parseError(Dt,{text:F.match,token:this.terminals_[P]||P,line:F.yylineno,loc:at,expected:bt})}if(O[0]instanceof Array&&O.length>1)throw new Error("Parse Error: multiple actions possible at state: "+Z+", token: "+P);switch(O[0]){case 1:d.push(P),f.push(F.yytext),t.push(F.yylloc),d.push(O[1]),P=null,J?(P=J,J=null):(w=F.yyleng,n=F.yytext,_=F.yylineno,at=F.yylloc,I>0);break;case 2:if(K=this.productions_[O[1]][1],nt.$=f[f.length-K],nt._$={first_line:t[t.length-(K||1)].first_line,last_line:t[t.length-1].last_line,first_column:t[t.length-(K||1)].first_column,last_column:t[t.length-1].last_column},ht&&(nt._$.range=[t[t.length-(K||1)].range[0],t[t.length-1].range[1]]),tt=this.performAction.apply(nt,[n,w,_,R.yy,O[1],f,t].concat(ut)),typeof tt<"u")return tt;K&&(d=d.slice(0,-1*K*2),f=f.slice(0,-1*K),t=t.slice(0,-1*K)),d.push(this.productions_[O[1]][0]),f.push(nt.$),t.push(nt._$),Nt=h[d[d.length-2]][d[d.length-1]],d.push(Nt);break;case 3:return!0}}return!0},"parse")},b=(function(){var g={EOF:1,parseError:l(function(o,d){if(this.yy.parser)this.yy.parser.parseError(o,d);else throw new Error(o)},"parseError"),setInput:l(function(o,d){return this.yy=d||this.yy||{},this._input=o,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:l(function(){var o=this._input[0];this.yytext+=o,this.yyleng++,this.offset++,this.match+=o,this.matched+=o;var d=o.match(/(?:\r\n?|\n).*/g);return d?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),o},"input"),unput:l(function(o){var d=o.length,c=o.split(/(?:\r\n?|\n)/g);this._input=o+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-d),this.offset-=d;var f=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),c.length-1&&(this.yylineno-=c.length-1);var t=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:c?(c.length===f.length?this.yylloc.first_column:0)+f[f.length-c.length].length-c[0].length:this.yylloc.first_column-d},this.options.ranges&&(this.yylloc.range=[t[0],t[0]+this.yyleng-d]),this.yyleng=this.yytext.length,this},"unput"),more:l(function(){return this._more=!0,this},"more"),reject:l(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:l(function(o){this.unput(this.match.slice(o))},"less"),pastInput:l(function(){var o=this.matched.substr(0,this.matched.length-this.match.length);return(o.length>20?"...":"")+o.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:l(function(){var o=this.match;return o.length<20&&(o+=this._input.substr(0,20-o.length)),(o.substr(0,20)+(o.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:l(function(){var o=this.pastInput(),d=new Array(o.length+1).join("-");return o+this.upcomingInput()+`
`+d+"^"},"showPosition"),test_match:l(function(o,d){var c,f,t;if(this.options.backtrack_lexer&&(t={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(t.yylloc.range=this.yylloc.range.slice(0))),f=o[0].match(/(?:\r\n?|\n).*/g),f&&(this.yylineno+=f.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:f?f[f.length-1].length-f[f.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+o[0].length},this.yytext+=o[0],this.match+=o[0],this.matches=o,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(o[0].length),this.matched+=o[0],c=this.performAction.call(this,this.yy,this,d,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),c)return c;if(this._backtrack){for(var h in t)this[h]=t[h];return!1}return!1},"test_match"),next:l(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var o,d,c,f;this._more||(this.yytext="",this.match="");for(var t=this._currentRules(),h=0;h<t.length;h++)if(c=this._input.match(this.rules[t[h]]),c&&(!d||c[0].length>d[0].length)){if(d=c,f=h,this.options.backtrack_lexer){if(o=this.test_match(c,t[h]),o!==!1)return o;if(this._backtrack){d=!1;continue}else return!1}else if(!this.options.flex)break}return d?(o=this.test_match(d,t[f]),o!==!1?o:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:l(function(){var o=this.next();return o||this.lex()},"lex"),begin:l(function(o){this.conditionStack.push(o)},"begin"),popState:l(function(){var o=this.conditionStack.length-1;return o>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:l(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:l(function(o){return o=this.conditionStack.length-1-Math.abs(o||0),o>=0?this.conditionStack[o]:"INITIAL"},"topState"),pushState:l(function(o){this.begin(o)},"pushState"),stateStackSize:l(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:l(function(o,d,c,f){switch(c){case 0:return this.begin("open_directive"),"open_directive";case 1:return this.begin("acc_title"),31;case 2:return this.popState(),"acc_title_value";case 3:return this.begin("acc_descr"),33;case 4:return this.popState(),"acc_descr_value";case 5:this.begin("acc_descr_multiline");break;case 6:this.popState();break;case 7:return"acc_descr_multiline_value";case 8:break;case 9:break;case 10:break;case 11:return 10;case 12:break;case 13:break;case 14:this.begin("href");break;case 15:this.popState();break;case 16:return 43;case 17:this.begin("callbackname");break;case 18:this.popState();break;case 19:this.popState(),this.begin("callbackargs");break;case 20:return 41;case 21:this.popState();break;case 22:return 42;case 23:this.begin("click");break;case 24:this.popState();break;case 25:return 40;case 26:return 4;case 27:return 22;case 28:return 23;case 29:return 24;case 30:return 25;case 31:return 26;case 32:return 28;case 33:return 27;case 34:return 29;case 35:return 12;case 36:return 13;case 37:return 14;case 38:return 15;case 39:return 16;case 40:return 17;case 41:return 18;case 42:return 20;case 43:return 21;case 44:return"date";case 45:return 30;case 46:return"accDescription";case 47:return 36;case 48:return 38;case 49:return 39;case 50:return":";case 51:return 6;case 52:return"INVALID"}},"anonymous"),rules:[/^(?:%%\{)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,/^(?:weekday\s+monday\b)/i,/^(?:weekday\s+tuesday\b)/i,/^(?:weekday\s+wednesday\b)/i,/^(?:weekday\s+thursday\b)/i,/^(?:weekday\s+friday\b)/i,/^(?:weekday\s+saturday\b)/i,/^(?:weekday\s+sunday\b)/i,/^(?:weekend\s+friday\b)/i,/^(?:weekend\s+saturday\b)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,/^(?:title\s[^\n]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^\n]+)/i,/^(?:[^:\n]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[6,7],inclusive:!1},acc_descr:{rules:[4],inclusive:!1},acc_title:{rules:[2],inclusive:!1},callbackargs:{rules:[21,22],inclusive:!1},callbackname:{rules:[18,19,20],inclusive:!1},href:{rules:[15,16],inclusive:!1},click:{rules:[24,25],inclusive:!1},INITIAL:{rules:[0,1,3,5,8,9,10,11,12,13,14,17,23,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],inclusive:!0}}};return g})();v.lexer=b;function m(){this.yy={}}return l(m,"Parser"),m.prototype=v,v.Parser=m,new m})();Ct.parser=Ct;var Pe=Ct,ze=dt(Le()),q=dt(te()),Be=dt(Ye()),Oe=dt(We()),je=dt(Fe());q.default.extend(Be.default);q.default.extend(Oe.default);q.default.extend(je.default);var Kt={friday:5,saturday:6},X="",It="",Yt,Wt="",yt=[],kt=[],Ft=new Map,Pt=[],_t=[],ct="",zt="",ee=["active","done","crit","milestone","vert"],Bt=[],mt=!1,Ot=!1,jt="sunday",$t="saturday",Et=0,Ge=l(function(){Pt=[],_t=[],ct="",Bt=[],vt=0,At=void 0,xt=void 0,z=[],X="",It="",zt="",Yt=void 0,Wt="",yt=[],kt=[],mt=!1,Ot=!1,Et=0,Ft=new Map,Ae(),jt="sunday",$t="saturday"},"clear"),Ne=l(function(e){It=e},"setAxisFormat"),He=l(function(){return It},"getAxisFormat"),Ve=l(function(e){Yt=e},"setTickInterval"),qe=l(function(){return Yt},"getTickInterval"),Ue=l(function(e){Wt=e},"setTodayMarker"),Ze=l(function(){return Wt},"getTodayMarker"),Xe=l(function(e){X=e},"setDateFormat"),Re=l(function(){mt=!0},"enableInclusiveEndDates"),Ke=l(function(){return mt},"endDatesAreInclusive"),Qe=l(function(){Ot=!0},"enableTopAxis"),Je=l(function(){return Ot},"topAxisEnabled"),ti=l(function(e){zt=e},"setDisplayMode"),ei=l(function(){return zt},"getDisplayMode"),ii=l(function(){return X},"getDateFormat"),ri=l(function(e){yt=e.toLowerCase().split(/[\s,]+/)},"setIncludes"),ai=l(function(){return yt},"getIncludes"),si=l(function(e){kt=e.toLowerCase().split(/[\s,]+/)},"setExcludes"),ni=l(function(){return kt},"getExcludes"),oi=l(function(){return Ft},"getLinks"),li=l(function(e){ct=e,Pt.push(e)},"addSection"),ci=l(function(){return Pt},"getSections"),di=l(function(){let e=Qt(),r=10,i=0;for(;!e&&i<r;)e=Qt(),i++;return _t=z,_t},"getTasks"),ie=l(function(e,r,i,a){let s=e.format(r.trim()),u=e.format("YYYY-MM-DD");return a.includes(s)||a.includes(u)?!1:i.includes("weekends")&&(e.isoWeekday()===Kt[$t]||e.isoWeekday()===Kt[$t]+1)||i.includes(e.format("dddd").toLowerCase())?!0:i.includes(s)||i.includes(u)},"isInvalidDate"),ui=l(function(e){jt=e},"setWeekday"),hi=l(function(){return jt},"getWeekday"),fi=l(function(e){$t=e},"setWeekend"),re=l(function(e,r,i,a){if(!i.length||e.manualEndTime)return;let s;e.startTime instanceof Date?s=(0,q.default)(e.startTime):s=(0,q.default)(e.startTime,r,!0),s=s.add(1,"d");let u;e.endTime instanceof Date?u=(0,q.default)(e.endTime):u=(0,q.default)(e.endTime,r,!0);let[y,$]=yi(s,u,r,i,a);e.endTime=y.toDate(),e.renderEndTime=$},"checkTaskDates"),yi=l(function(e,r,i,a,s){let u=!1,y=null;for(;e<=r;)u||(y=r.toDate()),u=ie(e,i,a,s),u&&(r=r.add(1,"d")),e=e.add(1,"d");return[r,y]},"fixTaskDates"),Mt=l(function(e,r,i){if(i=i.trim(),(r.trim()==="x"||r.trim()==="X")&&/^\d+$/.test(i))return new Date(Number(i));let a=/^after\s+(?<ids>[\d\w- ]+)/.exec(i);if(a!==null){let u=null;for(let $ of a.groups.ids.split(" ")){let L=et($);L!==void 0&&(!u||L.endTime>u.endTime)&&(u=L)}if(u)return u.endTime;let y=new Date;return y.setHours(0,0,0,0),y}let s=(0,q.default)(i,r.trim(),!0);if(s.isValid())return s.toDate();{wt.debug("Invalid date:"+i),wt.debug("With date format:"+r.trim());let u=new Date(i);if(u===void 0||isNaN(u.getTime())||u.getFullYear()<-1e4||u.getFullYear()>1e4)throw new Error("Invalid date:"+i);return u}},"getStartDate"),ae=l(function(e){let r=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(e.trim());return r!==null?[Number.parseFloat(r[1]),r[2]]:[NaN,"ms"]},"parseDuration"),se=l(function(e,r,i,a=!1){i=i.trim();let s=/^until\s+(?<ids>[\d\w- ]+)/.exec(i);if(s!==null){let D=null;for(let E of s.groups.ids.split(" ")){let W=et(E);W!==void 0&&(!D||W.startTime<D.startTime)&&(D=W)}if(D)return D.startTime;let x=new Date;return x.setHours(0,0,0,0),x}let u=(0,q.default)(i,r.trim(),!0);if(u.isValid())return a&&(u=u.add(1,"d")),u.toDate();let y=(0,q.default)(e),[$,L]=ae(i);if(!Number.isNaN($)){let D=y.add($,L);D.isValid()&&(y=D)}return y.toDate()},"getEndDate"),vt=0,lt=l(function(e){return e===void 0?(vt=vt+1,"task"+vt):e},"parseId"),ki=l(function(e,r){let i;r.substr(0,1)===":"?i=r.substr(1,r.length):i=r;let a=i.split(","),s={};Gt(a,s,ee);for(let y=0;y<a.length;y++)a[y]=a[y].trim();let u="";switch(a.length){case 1:s.id=lt(),s.startTime=e.endTime,u=a[0];break;case 2:s.id=lt(),s.startTime=Mt(void 0,X,a[0]),u=a[1];break;case 3:s.id=lt(a[0]),s.startTime=Mt(void 0,X,a[1]),u=a[2];break}return u&&(s.endTime=se(s.startTime,X,u,mt),s.manualEndTime=(0,q.default)(u,"YYYY-MM-DD",!0).isValid(),re(s,X,kt,yt)),s},"compileData"),mi=l(function(e,r){let i;r.substr(0,1)===":"?i=r.substr(1,r.length):i=r;let a=i.split(","),s={};Gt(a,s,ee);for(let u=0;u<a.length;u++)a[u]=a[u].trim();switch(a.length){case 1:s.id=lt(),s.startTime={type:"prevTaskEnd",id:e},s.endTime={data:a[0]};break;case 2:s.id=lt(),s.startTime={type:"getStartDate",startData:a[0]},s.endTime={data:a[1]};break;case 3:s.id=lt(a[0]),s.startTime={type:"getStartDate",startData:a[1]},s.endTime={data:a[2]};break}return s},"parseData"),At,xt,z=[],ne={},pi=l(function(e,r){let i={section:ct,type:ct,processed:!1,manualEndTime:!1,renderEndTime:null,raw:{data:r},task:e,classes:[]},a=mi(xt,r);i.raw.startTime=a.startTime,i.raw.endTime=a.endTime,i.id=a.id,i.prevTaskId=xt,i.active=a.active,i.done=a.done,i.crit=a.crit,i.milestone=a.milestone,i.vert=a.vert,i.order=Et,Et++;let s=z.push(i);xt=i.id,ne[i.id]=s-1},"addTask"),et=l(function(e){let r=ne[e];return z[r]},"findTaskById"),gi=l(function(e,r){let i={section:ct,type:ct,description:e,task:e,classes:[]},a=ki(At,r);i.startTime=a.startTime,i.endTime=a.endTime,i.id=a.id,i.active=a.active,i.done=a.done,i.crit=a.crit,i.milestone=a.milestone,i.vert=a.vert,At=i,_t.push(i)},"addTaskOrg"),Qt=l(function(){let e=l(function(i){let a=z[i],s="";switch(z[i].raw.startTime.type){case"prevTaskEnd":{let u=et(a.prevTaskId);a.startTime=u.endTime;break}case"getStartDate":s=Mt(void 0,X,z[i].raw.startTime.startData),s&&(z[i].startTime=s);break}return z[i].startTime&&(z[i].endTime=se(z[i].startTime,X,z[i].raw.endTime.data,mt),z[i].endTime&&(z[i].processed=!0,z[i].manualEndTime=(0,q.default)(z[i].raw.endTime.data,"YYYY-MM-DD",!0).isValid(),re(z[i],X,kt,yt))),z[i].processed},"compileTask"),r=!0;for(let[i,a]of z.entries())e(i),r=r&&a.processed;return r},"compileTasks"),bi=l(function(e,r){let i=r;ot().securityLevel!=="loose"&&(i=(0,ze.sanitizeUrl)(r)),e.split(",").forEach(function(a){et(a)!==void 0&&(le(a,()=>{window.open(i,"_self")}),Ft.set(a,i))}),oe(e,"clickable")},"setLink"),oe=l(function(e,r){e.split(",").forEach(function(i){let a=et(i);a!==void 0&&a.classes.push(r)})},"setClass"),Ti=l(function(e,r,i){if(ot().securityLevel!=="loose"||r===void 0)return;let a=[];if(typeof i=="string"){a=i.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let s=0;s<a.length;s++){let u=a[s].trim();u.startsWith('"')&&u.endsWith('"')&&(u=u.substr(1,u.length-2)),a[s]=u}}a.length===0&&a.push(e),et(e)!==void 0&&le(e,()=>{Ie.runFunc(r,...a)})},"setClickFun"),le=l(function(e,r){Bt.push(function(){let i=document.querySelector(`[id="${e}"]`);i!==null&&i.addEventListener("click",function(){r()})},function(){let i=document.querySelector(`[id="${e}-text"]`);i!==null&&i.addEventListener("click",function(){r()})})},"pushFun"),vi=l(function(e,r,i){e.split(",").forEach(function(a){Ti(a,r,i)}),oe(e,"clickable")},"setClickEvent"),xi=l(function(e){Bt.forEach(function(r){r(e)})},"bindFunctions"),wi={getConfig:l(()=>ot().gantt,"getConfig"),clear:Ge,setDateFormat:Xe,getDateFormat:ii,enableInclusiveEndDates:Re,endDatesAreInclusive:Ke,enableTopAxis:Qe,topAxisEnabled:Je,setAxisFormat:Ne,getAxisFormat:He,setTickInterval:Ve,getTickInterval:qe,setTodayMarker:Ue,getTodayMarker:Ze,setAccTitle:ye,getAccTitle:fe,setDiagramTitle:he,getDiagramTitle:ue,setDisplayMode:ti,getDisplayMode:ei,setAccDescription:de,getAccDescription:ce,addSection:li,getSections:ci,getTasks:di,addTask:pi,findTaskById:et,addTaskOrg:gi,setIncludes:ri,getIncludes:ai,setExcludes:si,getExcludes:ni,setClickEvent:vi,setLink:bi,getLinks:oi,bindFunctions:xi,parseDuration:ae,isInvalidDate:ie,setWeekday:ui,getWeekday:hi,setWeekend:fi};function Gt(e,r,i){let a=!0;for(;a;)a=!1,i.forEach(function(s){let u="^\\s*"+s+"\\s*$",y=new RegExp(u);e[0].match(y)&&(r[s]=!0,e.shift(1),a=!0)})}l(Gt,"getTaskTags");var St=dt(te()),_i=l(function(){wt.debug("Something is calling, setConf, remove the call")},"setConf"),Jt={monday:Ce,tuesday:Se,wednesday:De,thursday:$e,friday:_e,saturday:we,sunday:xe},$i=l((e,r)=>{let i=[...e].map(()=>-1/0),a=[...e].sort((u,y)=>u.startTime-y.startTime||u.order-y.order),s=0;for(let u of a)for(let y=0;y<i.length;y++)if(u.startTime>=i[y]){i[y]=u.endTime,u.order=y+r,y>s&&(s=y);break}return s},"getMaxIntersections"),Q,Di=l(function(e,r,i,a){let s=ot().gantt,u=ot().securityLevel,y;u==="sandbox"&&(y=Tt("#i"+r));let $=u==="sandbox"?Tt(y.nodes()[0].contentDocument.body):Tt("body"),L=u==="sandbox"?y.nodes()[0].contentDocument:document,D=L.getElementById(r);Q=D.parentElement.offsetWidth,Q===void 0&&(Q=1200),s.useWidth!==void 0&&(Q=s.useWidth);let x=a.db.getTasks(),E=[];for(let k of x)E.push(k.type);E=H(E);let W={},j=2*s.topPadding;if(a.db.getDisplayMode()==="compact"||s.displayMode==="compact"){let k={};for(let v of x)k[v.section]===void 0?k[v.section]=[v]:k[v.section].push(v);let T=0;for(let v of Object.keys(k)){let b=$i(k[v],T)+1;T+=b,j+=b*(s.barHeight+s.barGap),W[v]=b}}else{j+=x.length*(s.barHeight+s.barGap);for(let k of E)W[k]=x.filter(T=>T.type===k).length}D.setAttribute("viewBox","0 0 "+Q+" "+j);let B=$.select(`[id="${r}"]`),S=ke().domain([me(x,function(k){return k.startTime}),pe(x,function(k){return k.endTime})]).rangeRound([0,Q-s.leftPadding-s.rightPadding]);function p(k,T){let v=k.startTime,b=T.startTime,m=0;return v>b?m=1:v<b&&(m=-1),m}l(p,"taskCompare"),x.sort(p),C(x,Q,j),ge(B,j,Q,s.useMaxWidth),B.append("text").text(a.db.getDiagramTitle()).attr("x",Q/2).attr("y",s.titleTopMargin).attr("class","titleText");function C(k,T,v){let b=s.barHeight,m=b+s.barGap,g=s.topPadding,o=s.leftPadding,d=be().domain([0,E.length]).range(["#00B9FA","#F95002"]).interpolate(Te);A(m,g,o,T,v,k,a.db.getExcludes(),a.db.getIncludes()),G(o,g,T,v),M(k,m,g,o,b,d,T),N(m,g),U(o,g,T,v)}l(C,"makeGantt");function M(k,T,v,b,m,g,o){k.sort((t,h)=>t.vert===h.vert?0:t.vert?1:-1);let d=[...new Set(k.map(t=>t.order))].map(t=>k.find(h=>h.order===t));B.append("g").selectAll("rect").data(d).enter().append("rect").attr("x",0).attr("y",function(t,h){return h=t.order,h*T+v-2}).attr("width",function(){return o-s.rightPadding/2}).attr("height",T).attr("class",function(t){for(let[h,n]of E.entries())if(t.type===n)return"section section"+h%s.numberSectionStyles;return"section section0"}).enter();let c=B.append("g").selectAll("rect").data(k).enter(),f=a.db.getLinks();if(c.append("rect").attr("id",function(t){return t.id}).attr("rx",3).attr("ry",3).attr("x",function(t){return t.milestone?S(t.startTime)+b+.5*(S(t.endTime)-S(t.startTime))-.5*m:S(t.startTime)+b}).attr("y",function(t,h){return h=t.order,t.vert?s.gridLineStartPadding:h*T+v}).attr("width",function(t){return t.milestone?m:t.vert?.08*m:S(t.renderEndTime||t.endTime)-S(t.startTime)}).attr("height",function(t){return t.vert?x.length*(s.barHeight+s.barGap)+s.barHeight*2:m}).attr("transform-origin",function(t,h){return h=t.order,(S(t.startTime)+b+.5*(S(t.endTime)-S(t.startTime))).toString()+"px "+(h*T+v+.5*m).toString()+"px"}).attr("class",function(t){let h="task",n="";t.classes.length>0&&(n=t.classes.join(" "));let _=0;for(let[I,Y]of E.entries())t.type===Y&&(_=I%s.numberSectionStyles);let w="";return t.active?t.crit?w+=" activeCrit":w=" active":t.done?t.crit?w=" doneCrit":w=" done":t.crit&&(w+=" crit"),w.length===0&&(w=" task"),t.milestone&&(w=" milestone "+w),t.vert&&(w=" vert "+w),w+=_,w+=" "+n,h+w}),c.append("text").attr("id",function(t){return t.id+"-text"}).text(function(t){return t.task}).attr("font-size",s.fontSize).attr("x",function(t){let h=S(t.startTime),n=S(t.renderEndTime||t.endTime);if(t.milestone&&(h+=.5*(S(t.endTime)-S(t.startTime))-.5*m,n=h+m),t.vert)return S(t.startTime)+b;let _=this.getBBox().width;return _>n-h?n+_+1.5*s.leftPadding>o?h+b-5:n+b+5:(n-h)/2+h+b}).attr("y",function(t,h){return t.vert?s.gridLineStartPadding+x.length*(s.barHeight+s.barGap)+60:(h=t.order,h*T+s.barHeight/2+(s.fontSize/2-2)+v)}).attr("text-height",m).attr("class",function(t){let h=S(t.startTime),n=S(t.endTime);t.milestone&&(n=h+m);let _=this.getBBox().width,w="";t.classes.length>0&&(w=t.classes.join(" "));let I=0;for(let[it,ut]of E.entries())t.type===ut&&(I=it%s.numberSectionStyles);let Y="";return t.active&&(t.crit?Y="activeCritText"+I:Y="activeText"+I),t.done?t.crit?Y=Y+" doneCritText"+I:Y=Y+" doneText"+I:t.crit&&(Y=Y+" critText"+I),t.milestone&&(Y+=" milestoneText"),t.vert&&(Y+=" vertText"),_>n-h?n+_+1.5*s.leftPadding>o?w+" taskTextOutsideLeft taskTextOutside"+I+" "+Y:w+" taskTextOutsideRight taskTextOutside"+I+" "+Y+" width-"+_:w+" taskText taskText"+I+" "+Y+" width-"+_}),ot().securityLevel==="sandbox"){let t;t=Tt("#i"+r);let h=t.nodes()[0].contentDocument;c.filter(function(n){return f.has(n.id)}).each(function(n){var _=h.querySelector("#"+n.id),w=h.querySelector("#"+n.id+"-text");let I=_.parentNode;var Y=h.createElement("a");Y.setAttribute("xlink:href",f.get(n.id)),Y.setAttribute("target","_top"),I.appendChild(Y),Y.appendChild(_),Y.appendChild(w)})}}l(M,"drawRects");function A(k,T,v,b,m,g,o,d){if(o.length===0&&d.length===0)return;let c,f;for(let{startTime:w,endTime:I}of g)(c===void 0||w<c)&&(c=w),(f===void 0||I>f)&&(f=I);if(!c||!f)return;if((0,St.default)(f).diff((0,St.default)(c),"year")>5){wt.warn("The difference between the min and max time is more than 5 years. This will cause performance issues. Skipping drawing exclude days.");return}let t=a.db.getDateFormat(),h=[],n=null,_=(0,St.default)(c);for(;_.valueOf()<=f;)a.db.isInvalidDate(_,t,o,d)?n?n.end=_:n={start:_,end:_}:n&&(h.push(n),n=null),_=_.add(1,"d");B.append("g").selectAll("rect").data(h).enter().append("rect").attr("id",w=>"exclude-"+w.start.format("YYYY-MM-DD")).attr("x",w=>S(w.start.startOf("day"))+v).attr("y",s.gridLineStartPadding).attr("width",w=>S(w.end.endOf("day"))-S(w.start.startOf("day"))).attr("height",m-T-s.gridLineStartPadding).attr("transform-origin",function(w,I){return(S(w.start)+v+.5*(S(w.end)-S(w.start))).toString()+"px "+(I*k+.5*m).toString()+"px"}).attr("class","exclude-range")}l(A,"drawExcludeDays");function G(k,T,v,b){let m=a.db.getDateFormat(),g=a.db.getAxisFormat(),o;g?o=g:m==="D"?o="%d":o=s.axisFormat??"%Y-%m-%d";let d=ve(S).tickSize(-b+T+s.gridLineStartPadding).tickFormat(Ht(o)),c=/^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/.exec(a.db.getTickInterval()||s.tickInterval);if(c!==null){let f=c[1],t=c[2],h=a.db.getWeekday()||s.weekday;switch(t){case"millisecond":d.ticks(Rt.every(f));break;case"second":d.ticks(Xt.every(f));break;case"minute":d.ticks(Zt.every(f));break;case"hour":d.ticks(Ut.every(f));break;case"day":d.ticks(qt.every(f));break;case"week":d.ticks(Jt[h].every(f));break;case"month":d.ticks(Vt.every(f));break}}if(B.append("g").attr("class","grid").attr("transform","translate("+k+", "+(b-50)+")").call(d).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10).attr("dy","1em"),a.db.topAxisEnabled()||s.topAxis){let f=Ee(S).tickSize(-b+T+s.gridLineStartPadding).tickFormat(Ht(o));if(c!==null){let t=c[1],h=c[2],n=a.db.getWeekday()||s.weekday;switch(h){case"millisecond":f.ticks(Rt.every(t));break;case"second":f.ticks(Xt.every(t));break;case"minute":f.ticks(Zt.every(t));break;case"hour":f.ticks(Ut.every(t));break;case"day":f.ticks(qt.every(t));break;case"week":f.ticks(Jt[n].every(t));break;case"month":f.ticks(Vt.every(t));break}}B.append("g").attr("class","grid").attr("transform","translate("+k+", "+T+")").call(f).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10)}}l(G,"makeGrid");function N(k,T){let v=0,b=Object.keys(W).map(m=>[m,W[m]]);B.append("g").selectAll("text").data(b).enter().append(function(m){let g=m[0].split(Me.lineBreakRegex),o=-(g.length-1)/2,d=L.createElementNS("http://www.w3.org/2000/svg","text");d.setAttribute("dy",o+"em");for(let[c,f]of g.entries()){let t=L.createElementNS("http://www.w3.org/2000/svg","tspan");t.setAttribute("alignment-baseline","central"),t.setAttribute("x","10"),c>0&&t.setAttribute("dy","1em"),t.textContent=f,d.appendChild(t)}return d}).attr("x",10).attr("y",function(m,g){if(g>0)for(let o=0;o<g;o++)return v+=b[g-1][1],m[1]*k/2+v*k+T;else return m[1]*k/2+T}).attr("font-size",s.sectionFontSize).attr("class",function(m){for(let[g,o]of E.entries())if(m[0]===o)return"sectionTitle sectionTitle"+g%s.numberSectionStyles;return"sectionTitle"})}l(N,"vertLabels");function U(k,T,v,b){let m=a.db.getTodayMarker();if(m==="off")return;let g=B.append("g").attr("class","today"),o=new Date,d=g.append("line");d.attr("x1",S(o)+k).attr("x2",S(o)+k).attr("y1",s.titleTopMargin).attr("y2",b-s.titleTopMargin).attr("class","today"),m!==""&&d.attr("style",m.replace(/,/g,";"))}l(U,"drawToday");function H(k){let T={},v=[];for(let b=0,m=k.length;b<m;++b)Object.prototype.hasOwnProperty.call(T,k[b])||(T[k[b]]=!0,v.push(k[b]));return v}l(H,"checkUnique")},"draw"),Si={setConf:_i,draw:Di},Ci=l(e=>`
  .mermaid-main-font {
        font-family: ${e.fontFamily};
  }

  .exclude-range {
    fill: ${e.excludeBkgColor};
  }

  .section {
    stroke: none;
    opacity: 0.2;
  }

  .section0 {
    fill: ${e.sectionBkgColor};
  }

  .section2 {
    fill: ${e.sectionBkgColor2};
  }

  .section1,
  .section3 {
    fill: ${e.altSectionBkgColor};
    opacity: 0.2;
  }

  .sectionTitle0 {
    fill: ${e.titleColor};
  }

  .sectionTitle1 {
    fill: ${e.titleColor};
  }

  .sectionTitle2 {
    fill: ${e.titleColor};
  }

  .sectionTitle3 {
    fill: ${e.titleColor};
  }

  .sectionTitle {
    text-anchor: start;
    font-family: ${e.fontFamily};
  }


  /* Grid and axis */

  .grid .tick {
    stroke: ${e.gridColor};
    opacity: 0.8;
    shape-rendering: crispEdges;
  }

  .grid .tick text {
    font-family: ${e.fontFamily};
    fill: ${e.textColor};
  }

  .grid path {
    stroke-width: 0;
  }


  /* Today line */

  .today {
    fill: none;
    stroke: ${e.todayLineColor};
    stroke-width: 2px;
  }


  /* Task styling */

  /* Default task */

  .task {
    stroke-width: 2;
  }

  .taskText {
    text-anchor: middle;
    font-family: ${e.fontFamily};
  }

  .taskTextOutsideRight {
    fill: ${e.taskTextDarkColor};
    text-anchor: start;
    font-family: ${e.fontFamily};
  }

  .taskTextOutsideLeft {
    fill: ${e.taskTextDarkColor};
    text-anchor: end;
  }


  /* Special case clickable */

  .task.clickable {
    cursor: pointer;
  }

  .taskText.clickable {
    cursor: pointer;
    fill: ${e.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideLeft.clickable {
    cursor: pointer;
    fill: ${e.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideRight.clickable {
    cursor: pointer;
    fill: ${e.taskTextClickableColor} !important;
    font-weight: bold;
  }


  /* Specific task settings for the sections*/

  .taskText0,
  .taskText1,
  .taskText2,
  .taskText3 {
    fill: ${e.taskTextColor};
  }

  .task0,
  .task1,
  .task2,
  .task3 {
    fill: ${e.taskBkgColor};
    stroke: ${e.taskBorderColor};
  }

  .taskTextOutside0,
  .taskTextOutside2
  {
    fill: ${e.taskTextOutsideColor};
  }

  .taskTextOutside1,
  .taskTextOutside3 {
    fill: ${e.taskTextOutsideColor};
  }


  /* Active task */

  .active0,
  .active1,
  .active2,
  .active3 {
    fill: ${e.activeTaskBkgColor};
    stroke: ${e.activeTaskBorderColor};
  }

  .activeText0,
  .activeText1,
  .activeText2,
  .activeText3 {
    fill: ${e.taskTextDarkColor} !important;
  }


  /* Completed task */

  .done0,
  .done1,
  .done2,
  .done3 {
    stroke: ${e.doneTaskBorderColor};
    fill: ${e.doneTaskBkgColor};
    stroke-width: 2;
  }

  .doneText0,
  .doneText1,
  .doneText2,
  .doneText3 {
    fill: ${e.taskTextDarkColor} !important;
  }


  /* Tasks on the critical line */

  .crit0,
  .crit1,
  .crit2,
  .crit3 {
    stroke: ${e.critBorderColor};
    fill: ${e.critBkgColor};
    stroke-width: 2;
  }

  .activeCrit0,
  .activeCrit1,
  .activeCrit2,
  .activeCrit3 {
    stroke: ${e.critBorderColor};
    fill: ${e.activeTaskBkgColor};
    stroke-width: 2;
  }

  .doneCrit0,
  .doneCrit1,
  .doneCrit2,
  .doneCrit3 {
    stroke: ${e.critBorderColor};
    fill: ${e.doneTaskBkgColor};
    stroke-width: 2;
    cursor: pointer;
    shape-rendering: crispEdges;
  }

  .milestone {
    transform: rotate(45deg) scale(0.8,0.8);
  }

  .milestoneText {
    font-style: italic;
  }
  .doneCritText0,
  .doneCritText1,
  .doneCritText2,
  .doneCritText3 {
    fill: ${e.taskTextDarkColor} !important;
  }

  .vert {
    stroke: ${e.vertLineColor};
  }

  .vertText {
    font-size: 15px;
    text-anchor: middle;
    fill: ${e.vertLineColor} !important;
  }

  .activeCritText0,
  .activeCritText1,
  .activeCritText2,
  .activeCritText3 {
    fill: ${e.taskTextDarkColor} !important;
  }

  .titleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${e.titleColor||e.textColor};
    font-family: ${e.fontFamily};
  }
`,"getStyles"),Ei=Ci,Li={parser:Pe,db:wi,renderer:Si,styles:Ei};export{Li as diagram};
