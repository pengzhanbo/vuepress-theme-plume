import{i as e,n as t,t as n}from"./chunk-AQ6EADP3-CZhslHi-.js";import{A as r,B as i,C as a,E as o,G as s,H as c,J as l,N as u,P as d,R as f,U as p,V as m,X as h,Z as g,et as _,i as v,k as y,l as b,m as x,q as S,s as C,v as w,w as T,y as E}from"./chunk-H7VHZCWX-DeYY8PhK.js";import{B as D,F as O,O as k,Q as A,R as j,V as M,X as N,Y as P,h as F,q as I}from"./chunk-QJSWEUOL-D9afpxQA.js";import{t as ee}from"./chunk-STOV2HOB-GnExfzIX.js";import{o as te}from"./chunk-VY2OSTJR-CRhFZ0yu.js";var ne=t((e,t)=>{(function(n,r){typeof e==`object`&&typeof t<`u`?t.exports=r():typeof define==`function`&&define.amd?define(r):(n=typeof globalThis<`u`?globalThis:n||self).dayjs_plugin_isoWeek=r()})(e,(function(){return function(e,t,r){var i=n(function(e){return e.add(4-e.isoWeekday(),`day`)},`a`),a=t.prototype;a.isoWeekYear=function(){return i(this).year()},a.isoWeek=function(e){if(!this.$utils().u(e))return this.add(7*(e-this.isoWeek()),`day`);var t,n,a,o,s=i(this),c=(t=this.isoWeekYear(),n=this.$u,a=(n?r.utc:r)().year(t).startOf(`year`),o=4-a.isoWeekday(),a.isoWeekday()>4&&(o+=7),a.add(o,`day`));return s.diff(c,`week`)+1},a.isoWeekday=function(e){return this.$utils().u(e)?this.day()||7:this.day(this.day()%7?e:e-7)};var o=a.startOf;a.startOf=function(e,t){var n=this.$utils(),r=!!n.u(t)||t;return n.p(e)===`isoweek`?r?this.date(this.date()-(this.isoWeekday()-1)).startOf(`day`):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf(`day`):o.bind(this)(e,t)}}}))}),re=t((e,t)=>{(function(n,r){typeof e==`object`&&typeof t<`u`?t.exports=r():typeof define==`function`&&define.amd?define(r):(n=typeof globalThis<`u`?globalThis:n||self).dayjs_plugin_customParseFormat=r()})(e,(function(){var e={LTS:`h:mm:ss A`,LT:`h:mm A`,L:`MM/DD/YYYY`,LL:`MMMM D, YYYY`,LLL:`MMMM D, YYYY h:mm A`,LLLL:`dddd, MMMM D, YYYY h:mm A`},t=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,r=/\d/,i=/\d\d/,a=/\d\d?/,o=/\d*[^-_:/,()\s\d]+/,s={},c=n(function(e){return(e=+e)+(e>68?1900:2e3)},`a`),l=n(function(e){return function(t){this[e]=+t}},`f`),u=[/[+-]\d\d:?(\d\d)?|Z/,function(e){(this.zone||={}).offset=(function(e){if(!e||e===`Z`)return 0;var t=e.match(/([+-]|\d\d)/g),n=60*t[1]+(+t[2]||0);return n===0?0:t[0]===`+`?-n:n})(e)}],d=n(function(e){var t=s[e];return t&&(t.indexOf?t:t.s.concat(t.f))},`u`),f=n(function(e,t){var n,r=s.meridiem;if(r){for(var i=1;i<=24;i+=1)if(e.indexOf(r(i,0,t))>-1){n=i>12;break}}else n=e===(t?`pm`:`PM`);return n},`d`),p={A:[o,function(e){this.afternoon=f(e,!1)}],a:[o,function(e){this.afternoon=f(e,!0)}],Q:[r,function(e){this.month=3*(e-1)+1}],S:[r,function(e){this.milliseconds=100*e}],SS:[i,function(e){this.milliseconds=10*e}],SSS:[/\d{3}/,function(e){this.milliseconds=+e}],s:[a,l(`seconds`)],ss:[a,l(`seconds`)],m:[a,l(`minutes`)],mm:[a,l(`minutes`)],H:[a,l(`hours`)],h:[a,l(`hours`)],HH:[a,l(`hours`)],hh:[a,l(`hours`)],D:[a,l(`day`)],DD:[i,l(`day`)],Do:[o,function(e){var t=s.ordinal,n=e.match(/\d+/);if(this.day=n[0],t)for(var r=1;r<=31;r+=1)t(r).replace(/\[|\]/g,``)===e&&(this.day=r)}],w:[a,l(`week`)],ww:[i,l(`week`)],M:[a,l(`month`)],MM:[i,l(`month`)],MMM:[o,function(e){var t=d(`months`),n=(d(`monthsShort`)||t.map((function(e){return e.slice(0,3)}))).indexOf(e)+1;if(n<1)throw Error();this.month=n%12||n}],MMMM:[o,function(e){var t=d(`months`).indexOf(e)+1;if(t<1)throw Error();this.month=t%12||t}],Y:[/[+-]?\d+/,l(`year`)],YY:[i,function(e){this.year=c(e)}],YYYY:[/\d{4}/,l(`year`)],Z:u,ZZ:u};function m(n){for(var r=n,i=s&&s.formats,a=(n=r.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,(function(t,n,r){var a=r&&r.toUpperCase();return n||i[r]||e[r]||i[a].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,(function(e,t,n){return t||n.slice(1)}))}))).match(t),o=a.length,c=0;c<o;c+=1){var l=a[c],u=p[l],d=u&&u[0],f=u&&u[1];a[c]=f?{regex:d,parser:f}:l.replace(/^\[|\]$/g,``)}return function(e){for(var t={},n=0,r=0;n<o;n+=1){var i=a[n];if(typeof i==`string`)r+=i.length;else{var s=i.regex,c=i.parser,l=e.slice(r),u=s.exec(l)[0];c.call(t,u),e=e.replace(u,``)}}return(function(e){var t=e.afternoon;if(t!==void 0){var n=e.hours;t?n<12&&(e.hours+=12):n===12&&(e.hours=0),delete e.afternoon}})(t),t}}return n(m,`l`),function(e,t,n){n.p.customParseFormat=!0,e&&e.parseTwoDigitYear&&(c=e.parseTwoDigitYear);var r=t.prototype,i=r.parse;r.parse=function(e){var t=e.date,r=e.utc,a=e.args;this.$u=r;var o=a[1];if(typeof o==`string`){var c=a[2]===!0,l=a[3]===!0,u=c||l,d=a[2];l&&(d=a[2]),s=this.$locale(),!c&&d&&(s=n.Ls[d]),this.$d=(function(e,t,n,r){try{if([`x`,`X`].indexOf(t)>-1)return new Date((t===`X`?1e3:1)*e);var i=m(t)(e),a=i.year,o=i.month,s=i.day,c=i.hours,l=i.minutes,u=i.seconds,d=i.milliseconds,f=i.zone,p=i.week,h=new Date,g=s||(a||o?1:h.getDate()),_=a||h.getFullYear(),v=0;a&&!o||(v=o>0?o-1:h.getMonth());var y,b=c||0,x=l||0,S=u||0,C=d||0;return f?new Date(Date.UTC(_,v,g,b,x,S,C+60*f.offset*1e3)):n?new Date(Date.UTC(_,v,g,b,x,S,C)):(y=new Date(_,v,g,b,x,S,C),p&&(y=r(y).week(p).toDate()),y)}catch{return new Date(``)}})(t,o,r,n),this.init(),d&&d!==!0&&(this.$L=this.locale(d).$L),u&&t!=this.format(o)&&(this.$d=new Date(``)),s={}}else if(o instanceof Array)for(var f=o.length,p=1;p<=f;p+=1){a[1]=o[p-1];var h=n.apply(this,a);if(h.isValid()){this.$d=h.$d,this.$L=h.$L,this.init();break}p===f&&(this.$d=new Date(``))}else i.call(this,e)}}}))}),L=t((e,t)=>{(function(n,r){typeof e==`object`&&typeof t<`u`?t.exports=r():typeof define==`function`&&define.amd?define(r):(n=typeof globalThis<`u`?globalThis:n||self).dayjs_plugin_advancedFormat=r()})(e,(function(){return function(e,t){var n=t.prototype,r=n.format;n.format=function(e){var t=this,n=this.$locale();if(!this.isValid())return r.bind(this)(e);var i=this.$utils(),a=(e||`YYYY-MM-DDTHH:mm:ssZ`).replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,(function(e){switch(e){case`Q`:return Math.ceil((t.$M+1)/3);case`Do`:return n.ordinal(t.$D);case`gggg`:return t.weekYear();case`GGGG`:return t.isoWeekYear();case`wo`:return n.ordinal(t.week(),`W`);case`w`:case`ww`:return i.s(t.week(),e===`w`?1:2,`0`);case`W`:case`WW`:return i.s(t.isoWeek(),e===`W`?1:2,`0`);case`k`:case`kk`:return i.s(String(t.$H===0?24:t.$H),e===`k`?1:2,`0`);case`X`:return Math.floor(t.$d.getTime()/1e3);case`x`:return t.$d.getTime();case`z`:return`[`+t.offsetName()+`]`;case`zzz`:return`[`+t.offsetName(`long`)+`]`;default:return e}}));return r.bind(this)(a)}}}))}),ie=t((e,t)=>{(function(n,r){typeof e==`object`&&typeof t<`u`?t.exports=r():typeof define==`function`&&define.amd?define(r):(n=typeof globalThis<`u`?globalThis:n||self).dayjs_plugin_duration=r()})(e,(function(){var e,t,r=1e3,i=6e4,a=36e5,o=864e5,s=31536e6,c=2628e6,l=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/,u=/\[([^\]]+)]|YYYY|YY|Y|M{1,2}|D{1,2}|H{1,2}|m{1,2}|s{1,2}|SSS/g,d={years:s,months:c,days:o,hours:a,minutes:i,seconds:r,milliseconds:1,weeks:6048e5},f=n(function(e){return e instanceof y},`c`),p=n(function(e,t,n){return new y(e,n,t.$l)},`f`),m=n(function(e){return t.p(e)+`s`},`m`),h=n(function(e){return e<0},`l`),g=n(function(e){return h(e)?Math.ceil(e):Math.floor(e)},`$`),_=n(function(e){return Math.abs(e)},`y`),v=n(function(e,t){return e?h(e)?{negative:!0,format:``+_(e)+t}:{negative:!1,format:``+e+t}:{negative:!1,format:``}},`v`),y=(function(){function h(e,t,n){var r=this;if(this.$d={},this.$l=n,e===void 0&&(this.$ms=0,this.parseFromMilliseconds()),t)return p(e*d[m(t)],this);if(typeof e==`number`)return this.$ms=e,this.parseFromMilliseconds(),this;if(typeof e==`object`)return Object.keys(e).forEach((function(t){r.$d[m(t)]=e[t]})),this.calMilliseconds(),this;if(typeof e==`string`){var i=e.match(l);if(i){var a=i.slice(2).map((function(e){return e==null?0:Number(e)}));return this.$d.years=a[0],this.$d.months=a[1],this.$d.weeks=a[2],this.$d.days=a[3],this.$d.hours=a[4],this.$d.minutes=a[5],this.$d.seconds=a[6],this.calMilliseconds(),this}}return this}n(h,`l`);var _=h.prototype;return _.calMilliseconds=function(){var e=this;this.$ms=Object.keys(this.$d).reduce((function(t,n){return t+(e.$d[n]||0)*d[n]}),0)},_.parseFromMilliseconds=function(){var e=this.$ms;this.$d.years=g(e/s),e%=s,this.$d.months=g(e/c),e%=c,this.$d.days=g(e/o),e%=o,this.$d.hours=g(e/a),e%=a,this.$d.minutes=g(e/i),e%=i,this.$d.seconds=g(e/r),e%=r,this.$d.milliseconds=e},_.toISOString=function(){var e=v(this.$d.years,`Y`),t=v(this.$d.months,`M`),n=+this.$d.days||0;this.$d.weeks&&(n+=7*this.$d.weeks);var r=v(n,`D`),i=v(this.$d.hours,`H`),a=v(this.$d.minutes,`M`),o=this.$d.seconds||0;this.$d.milliseconds&&(o+=this.$d.milliseconds/1e3,o=Math.round(1e3*o)/1e3);var s=v(o,`S`),c=e.negative||t.negative||r.negative||i.negative||a.negative||s.negative,l=i.format||a.format||s.format?`T`:``,u=(c?`-`:``)+`P`+e.format+t.format+r.format+l+i.format+a.format+s.format;return u===`P`||u===`-P`?`P0D`:u},_.toJSON=function(){return this.toISOString()},_.format=function(e){var n=e||`YYYY-MM-DDTHH:mm:ss`,r={Y:this.$d.years,YY:t.s(this.$d.years,2,`0`),YYYY:t.s(this.$d.years,4,`0`),M:this.$d.months,MM:t.s(this.$d.months,2,`0`),D:this.$d.days,DD:t.s(this.$d.days,2,`0`),H:this.$d.hours,HH:t.s(this.$d.hours,2,`0`),m:this.$d.minutes,mm:t.s(this.$d.minutes,2,`0`),s:this.$d.seconds,ss:t.s(this.$d.seconds,2,`0`),SSS:t.s(this.$d.milliseconds,3,`0`)};return n.replace(u,(function(e,t){return t||String(r[e])}))},_.as=function(e){return this.$ms/d[m(e)]},_.get=function(e){var t=this.$ms,n=m(e);return n===`milliseconds`?t%=1e3:t=n===`weeks`?g(t/d[n]):this.$d[n],t||0},_.add=function(e,t,n){var r=t?e*d[m(t)]:f(e)?e.$ms:p(e,this).$ms;return p(this.$ms+r*(n?-1:1),this)},_.subtract=function(e,t){return this.add(e,t,!0)},_.locale=function(e){var t=this.clone();return t.$l=e,t},_.clone=function(){return p(this.$ms,this)},_.humanize=function(t){return e().add(this.$ms,`ms`).locale(this.$l).fromNow(!t)},_.valueOf=function(){return this.asMilliseconds()},_.milliseconds=function(){return this.get(`milliseconds`)},_.asMilliseconds=function(){return this.as(`milliseconds`)},_.seconds=function(){return this.get(`seconds`)},_.asSeconds=function(){return this.as(`seconds`)},_.minutes=function(){return this.get(`minutes`)},_.asMinutes=function(){return this.as(`minutes`)},_.hours=function(){return this.get(`hours`)},_.asHours=function(){return this.as(`hours`)},_.days=function(){return this.get(`days`)},_.asDays=function(){return this.as(`days`)},_.weeks=function(){return this.get(`weeks`)},_.asWeeks=function(){return this.as(`weeks`)},_.months=function(){return this.get(`months`)},_.asMonths=function(){return this.as(`months`)},_.years=function(){return this.get(`years`)},_.asYears=function(){return this.as(`years`)},h})(),b=n(function(e,t,n){return e.add(t.years()*n,`y`).add(t.months()*n,`M`).add(t.days()*n,`d`).add(t.hours()*n,`h`).add(t.minutes()*n,`m`).add(t.seconds()*n,`s`).add(t.milliseconds()*n,`ms`)},`p`);return function(n,r,i){e=i,t=i().$utils(),i.duration=function(e,t){return p(e,{$l:i.locale()},t)},i.isDuration=f;var a=r.prototype.add,o=r.prototype.subtract;r.prototype.add=function(e,t){return f(e)?b(this,e,1):a.bind(this)(e,t)},r.prototype.subtract=function(e,t){return f(e)?b(this,e,-1):o.bind(this)(e,t)}}}))}),R=(function(){var e=n(function(e,t,n,r){for(n||={},r=e.length;r--;n[e[r]]=t);return n},`o`),t=[6,8,10,12,13,14,15,16,17,18,20,21,22,23,24,25,26,27,28,29,30,31,33,35,36,38,40],r=[1,26],i=[1,27],a=[1,28],o=[1,29],s=[1,30],c=[1,31],l=[1,32],u=[1,33],d=[1,34],f=[1,9],p=[1,10],m=[1,11],h=[1,12],g=[1,13],_=[1,14],v=[1,15],y=[1,16],b=[1,19],x=[1,20],S=[1,21],C=[1,22],w=[1,23],T=[1,25],E=[1,35],D={trace:n(function(){},`trace`),yy:{},symbols_:{error:2,start:3,gantt:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NL:10,weekday:11,weekday_monday:12,weekday_tuesday:13,weekday_wednesday:14,weekday_thursday:15,weekday_friday:16,weekday_saturday:17,weekday_sunday:18,weekend:19,weekend_friday:20,weekend_saturday:21,dateFormat:22,inclusiveEndDates:23,topAxis:24,axisFormat:25,tickInterval:26,excludes:27,includes:28,todayMarker:29,title:30,acc_title:31,acc_title_value:32,acc_descr:33,acc_descr_value:34,acc_descr_multiline_value:35,section:36,clickStatement:37,taskTxt:38,taskData:39,click:40,callbackname:41,callbackargs:42,href:43,clickStatementDebug:44,$accept:0,$end:1},terminals_:{2:`error`,4:`gantt`,6:`EOF`,8:`SPACE`,10:`NL`,12:`weekday_monday`,13:`weekday_tuesday`,14:`weekday_wednesday`,15:`weekday_thursday`,16:`weekday_friday`,17:`weekday_saturday`,18:`weekday_sunday`,20:`weekend_friday`,21:`weekend_saturday`,22:`dateFormat`,23:`inclusiveEndDates`,24:`topAxis`,25:`axisFormat`,26:`tickInterval`,27:`excludes`,28:`includes`,29:`todayMarker`,30:`title`,31:`acc_title`,32:`acc_title_value`,33:`acc_descr`,34:`acc_descr_value`,35:`acc_descr_multiline_value`,36:`section`,38:`taskTxt`,39:`taskData`,40:`click`,41:`callbackname`,42:`callbackargs`,43:`href`},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[19,1],[19,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,1],[9,2],[37,2],[37,3],[37,3],[37,4],[37,3],[37,4],[37,2],[44,2],[44,3],[44,3],[44,4],[44,3],[44,4],[44,2]],performAction:n(function(e,t,n,r,i,a,o){var s=a.length-1;switch(i){case 1:return a[s-1];case 2:this.$=[];break;case 3:a[s-1].push(a[s]),this.$=a[s-1];break;case 4:case 5:this.$=a[s];break;case 6:case 7:this.$=[];break;case 8:r.setWeekday(`monday`);break;case 9:r.setWeekday(`tuesday`);break;case 10:r.setWeekday(`wednesday`);break;case 11:r.setWeekday(`thursday`);break;case 12:r.setWeekday(`friday`);break;case 13:r.setWeekday(`saturday`);break;case 14:r.setWeekday(`sunday`);break;case 15:r.setWeekend(`friday`);break;case 16:r.setWeekend(`saturday`);break;case 17:r.setDateFormat(a[s].substr(11)),this.$=a[s].substr(11);break;case 18:r.enableInclusiveEndDates(),this.$=a[s].substr(18);break;case 19:r.TopAxis(),this.$=a[s].substr(8);break;case 20:r.setAxisFormat(a[s].substr(11)),this.$=a[s].substr(11);break;case 21:r.setTickInterval(a[s].substr(13)),this.$=a[s].substr(13);break;case 22:r.setExcludes(a[s].substr(9)),this.$=a[s].substr(9);break;case 23:r.setIncludes(a[s].substr(9)),this.$=a[s].substr(9);break;case 24:r.setTodayMarker(a[s].substr(12)),this.$=a[s].substr(12);break;case 27:r.setDiagramTitle(a[s].substr(6)),this.$=a[s].substr(6);break;case 28:this.$=a[s].trim(),r.setAccTitle(this.$);break;case 29:case 30:this.$=a[s].trim(),r.setAccDescription(this.$);break;case 31:r.addSection(a[s].substr(8)),this.$=a[s].substr(8);break;case 33:r.addTask(a[s-1],a[s]),this.$=`task`;break;case 34:this.$=a[s-1],r.setClickEvent(a[s-1],a[s],null);break;case 35:this.$=a[s-2],r.setClickEvent(a[s-2],a[s-1],a[s]);break;case 36:this.$=a[s-2],r.setClickEvent(a[s-2],a[s-1],null),r.setLink(a[s-2],a[s]);break;case 37:this.$=a[s-3],r.setClickEvent(a[s-3],a[s-2],a[s-1]),r.setLink(a[s-3],a[s]);break;case 38:this.$=a[s-2],r.setClickEvent(a[s-2],a[s],null),r.setLink(a[s-2],a[s-1]);break;case 39:this.$=a[s-3],r.setClickEvent(a[s-3],a[s-1],a[s]),r.setLink(a[s-3],a[s-2]);break;case 40:this.$=a[s-1],r.setLink(a[s-1],a[s]);break;case 41:case 47:this.$=a[s-1]+` `+a[s];break;case 42:case 43:case 45:this.$=a[s-2]+` `+a[s-1]+` `+a[s];break;case 44:case 46:this.$=a[s-3]+` `+a[s-2]+` `+a[s-1]+` `+a[s]}},`anonymous`),table:[{3:1,4:[1,2]},{1:[3]},e(t,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:17,12:r,13:i,14:a,15:o,16:s,17:c,18:l,19:18,20:u,21:d,22:f,23:p,24:m,25:h,26:g,27:_,28:v,29:y,30:b,31:x,33:S,35:C,36:w,37:24,38:T,40:E},e(t,[2,7],{1:[2,1]}),e(t,[2,3]),{9:36,11:17,12:r,13:i,14:a,15:o,16:s,17:c,18:l,19:18,20:u,21:d,22:f,23:p,24:m,25:h,26:g,27:_,28:v,29:y,30:b,31:x,33:S,35:C,36:w,37:24,38:T,40:E},e(t,[2,5]),e(t,[2,6]),e(t,[2,17]),e(t,[2,18]),e(t,[2,19]),e(t,[2,20]),e(t,[2,21]),e(t,[2,22]),e(t,[2,23]),e(t,[2,24]),e(t,[2,25]),e(t,[2,26]),e(t,[2,27]),{32:[1,37]},{34:[1,38]},e(t,[2,30]),e(t,[2,31]),e(t,[2,32]),{39:[1,39]},e(t,[2,8]),e(t,[2,9]),e(t,[2,10]),e(t,[2,11]),e(t,[2,12]),e(t,[2,13]),e(t,[2,14]),e(t,[2,15]),e(t,[2,16]),{41:[1,40],43:[1,41]},e(t,[2,4]),e(t,[2,28]),e(t,[2,29]),e(t,[2,33]),e(t,[2,34],{42:[1,42],43:[1,43]}),e(t,[2,40],{41:[1,44]}),e(t,[2,35],{43:[1,45]}),e(t,[2,36]),e(t,[2,38],{42:[1,46]}),e(t,[2,37]),e(t,[2,39])],defaultActions:{},parseError:n(function(e,t){if(t.recoverable)this.trace(e);else{var n=Error(e);throw n.hash=t,n}},`parseError`),parse:n(function(e){var t=this,r=[0],i=[],a=[null],o=[],s=this.table,c=``,l=0,u=0,d=0,f=2,p=1,m=o.slice.call(arguments,1),h=Object.create(this.lexer),g={yy:{}};for(var _ in this.yy)Object.prototype.hasOwnProperty.call(this.yy,_)&&(g.yy[_]=this.yy[_]);h.setInput(e,g.yy),g.yy.lexer=h,g.yy.parser=this,typeof h.yylloc>`u`&&(h.yylloc={});var v=h.yylloc;o.push(v);var y=h.options&&h.options.ranges;this.parseError=typeof g.yy.parseError==`function`?g.yy.parseError:Object.getPrototypeOf(this).parseError;function b(e){r.length-=2*e,a.length-=e,o.length-=e}n(b,`popStack`);function x(){var e=i.pop()||h.lex()||p;return typeof e!=`number`&&(e instanceof Array&&(i=e,e=i.pop()),e=t.symbols_[e]||e),e}n(x,`lex`);for(var S,C,w,T,E,D={},O,k,A,j;;){if(w=r[r.length-1],this.defaultActions[w]?T=this.defaultActions[w]:((S===null||typeof S>`u`)&&(S=x()),T=s[w]&&s[w][S]),typeof T>`u`||!T.length||!T[0]){var M=``;for(O in j=[],s[w])this.terminals_[O]&&O>f&&j.push(`'`+this.terminals_[O]+`'`);M=h.showPosition?`Parse error on line `+(l+1)+`:
`+h.showPosition()+`
Expecting `+j.join(`, `)+`, got '`+(this.terminals_[S]||S)+`'`:`Parse error on line `+(l+1)+`: Unexpected `+(S==p?`end of input`:`'`+(this.terminals_[S]||S)+`'`),this.parseError(M,{text:h.match,token:this.terminals_[S]||S,line:h.yylineno,loc:v,expected:j})}if(T[0]instanceof Array&&T.length>1)throw Error(`Parse Error: multiple actions possible at state: `+w+`, token: `+S);switch(T[0]){case 1:r.push(S),a.push(h.yytext),o.push(h.yylloc),r.push(T[1]),S=null,C?(S=C,C=null):(u=h.yyleng,c=h.yytext,l=h.yylineno,v=h.yylloc,d>0&&d--);break;case 2:if(k=this.productions_[T[1]][1],D.$=a[a.length-k],D._$={first_line:o[o.length-(k||1)].first_line,last_line:o[o.length-1].last_line,first_column:o[o.length-(k||1)].first_column,last_column:o[o.length-1].last_column},y&&(D._$.range=[o[o.length-(k||1)].range[0],o[o.length-1].range[1]]),E=this.performAction.apply(D,[c,u,l,g.yy,T[1],a,o].concat(m)),typeof E<`u`)return E;k&&(r=r.slice(0,-1*k*2),a=a.slice(0,-1*k),o=o.slice(0,-1*k)),r.push(this.productions_[T[1]][0]),a.push(D.$),o.push(D._$),A=s[r[r.length-2]][r[r.length-1]],r.push(A);break;case 3:return!0}}return!0},`parse`)};D.lexer=(function(){return{EOF:1,parseError:n(function(e,t){if(this.yy.parser)this.yy.parser.parseError(e,t);else throw Error(e)},`parseError`),setInput:n(function(e,t){return this.yy=t||this.yy||{},this._input=e,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match=``,this.conditionStack=[`INITIAL`],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},`setInput`),input:n(function(){var e=this._input[0];return this.yytext+=e,this.yyleng++,this.offset++,this.match+=e,this.matched+=e,e.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),e},`input`),unput:n(function(e){var t=e.length,n=e.split(/(?:\r\n?|\n)/g);this._input=e+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-t),this.offset-=t;var r=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),n.length-1&&(this.yylineno-=n.length-1);var i=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:n?(n.length===r.length?this.yylloc.first_column:0)+r[r.length-n.length].length-n[0].length:this.yylloc.first_column-t},this.options.ranges&&(this.yylloc.range=[i[0],i[0]+this.yyleng-t]),this.yyleng=this.yytext.length,this},`unput`),more:n(function(){return this._more=!0,this},`more`),reject:n(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError(`Lexical error on line `+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:``,token:null,line:this.yylineno});return this},`reject`),less:n(function(e){this.unput(this.match.slice(e))},`less`),pastInput:n(function(){var e=this.matched.substr(0,this.matched.length-this.match.length);return(e.length>20?`...`:``)+e.substr(-20).replace(/\n/g,``)},`pastInput`),upcomingInput:n(function(){var e=this.match;return e.length<20&&(e+=this._input.substr(0,20-e.length)),(e.substr(0,20)+(e.length>20?`...`:``)).replace(/\n/g,``)},`upcomingInput`),showPosition:n(function(){var e=this.pastInput(),t=Array(e.length+1).join(`-`);return e+this.upcomingInput()+`
`+t+`^`},`showPosition`),test_match:n(function(e,t){var n,r,i;if(this.options.backtrack_lexer&&(i={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(i.yylloc.range=this.yylloc.range.slice(0))),r=e[0].match(/(?:\r\n?|\n).*/g),r&&(this.yylineno+=r.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:r?r[r.length-1].length-r[r.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+e[0].length},this.yytext+=e[0],this.match+=e[0],this.matches=e,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(e[0].length),this.matched+=e[0],n=this.performAction.call(this,this.yy,this,t,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),n)return n;if(this._backtrack){for(var a in i)this[a]=i[a];return!1}return!1},`test_match`),next:n(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var e,t,n,r;this._more||(this.yytext=``,this.match=``);for(var i=this._currentRules(),a=0;a<i.length;a++)if(n=this._input.match(this.rules[i[a]]),n&&(!t||n[0].length>t[0].length)){if(t=n,r=a,this.options.backtrack_lexer){if(e=this.test_match(n,i[a]),e!==!1)return e;if(this._backtrack){t=!1;continue}return!1}if(!this.options.flex)break}return t?(e=this.test_match(t,i[r]),e!==!1&&e):this._input===``?this.EOF:this.parseError(`Lexical error on line `+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:``,token:null,line:this.yylineno})},`next`),lex:n(function(){return this.next()||this.lex()},`lex`),begin:n(function(e){this.conditionStack.push(e)},`begin`),popState:n(function(){return this.conditionStack.length-1>0?this.conditionStack.pop():this.conditionStack[0]},`popState`),_currentRules:n(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},`_currentRules`),topState:n(function(e){return e=this.conditionStack.length-1-Math.abs(e||0),e>=0?this.conditionStack[e]:`INITIAL`},`topState`),pushState:n(function(e){this.begin(e)},`pushState`),stateStackSize:n(function(){return this.conditionStack.length},`stateStackSize`),options:{"case-insensitive":!0},performAction:n(function(e,t,n,r){switch(n){case 0:return this.begin(`open_directive`),`open_directive`;case 1:return this.begin(`acc_title`),31;case 2:return this.popState(),`acc_title_value`;case 3:return this.begin(`acc_descr`),33;case 4:return this.popState(),`acc_descr_value`;case 5:this.begin(`acc_descr_multiline`);break;case 6:this.popState();break;case 7:return`acc_descr_multiline_value`;case 8:break;case 9:break;case 10:break;case 11:return 10;case 12:break;case 13:break;case 14:this.begin(`href`);break;case 15:this.popState();break;case 16:return 43;case 17:this.begin(`callbackname`);break;case 18:this.popState();break;case 19:this.popState(),this.begin(`callbackargs`);break;case 20:return 41;case 21:this.popState();break;case 22:return 42;case 23:this.begin(`click`);break;case 24:this.popState();break;case 25:return 40;case 26:return 4;case 27:return 22;case 28:return 23;case 29:return 24;case 30:return 25;case 31:return 26;case 32:return 28;case 33:return 27;case 34:return 29;case 35:return 12;case 36:return 13;case 37:return 14;case 38:return 15;case 39:return 16;case 40:return 17;case 41:return 18;case 42:return 20;case 43:return 21;case 44:return`date`;case 45:return 30;case 46:return`accDescription`;case 47:return 36;case 48:return 38;case 49:return 39;case 50:return`:`;case 51:return 6;case 52:return`INVALID`}},`anonymous`),rules:[/^(?:%%\{)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,/^(?:weekday\s+monday\b)/i,/^(?:weekday\s+tuesday\b)/i,/^(?:weekday\s+wednesday\b)/i,/^(?:weekday\s+thursday\b)/i,/^(?:weekday\s+friday\b)/i,/^(?:weekday\s+saturday\b)/i,/^(?:weekday\s+sunday\b)/i,/^(?:weekend\s+friday\b)/i,/^(?:weekend\s+saturday\b)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,/^(?:title\s[^\n]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^\n]+)/i,/^(?:[^:\n]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[6,7],inclusive:!1},acc_descr:{rules:[4],inclusive:!1},acc_title:{rules:[2],inclusive:!1},callbackargs:{rules:[21,22],inclusive:!1},callbackname:{rules:[18,19,20],inclusive:!1},href:{rules:[15,16],inclusive:!1},click:{rules:[24,25],inclusive:!1},INITIAL:{rules:[0,1,3,5,8,9,10,11,12,13,14,17,23,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],inclusive:!0}}}})();function O(){this.yy={}}return n(O,`Parser`),O.prototype=D,D.Parser=O,new O})();R.parser=R;var ae=R,oe=e(ee(),1),z=e(C(),1),se=e(ne(),1),ce=e(re(),1),le=e(L(),1);z.default.extend(se.default),z.default.extend(ce.default),z.default.extend(le.default);var ue={friday:5,saturday:6},B=``,de=``,fe,pe=``,V=[],H=[],me=new Map,he=[],U=[],W=``,ge=``,_e=[`active`,`done`,`crit`,`milestone`,`vert`],ve=[],G=``,K=!1,ye=!1,be=`sunday`,q=`saturday`,xe=0,Se=n(function(){he=[],U=[],W=``,ve=[],nt=0,at=void 0,Y=void 0,X=[],B=``,de=``,ge=``,fe=void 0,pe=``,V=[],H=[],K=!1,ye=!1,xe=0,me=new Map,G=``,F(),be=`sunday`,q=`saturday`},`clear`),Ce=n(function(e){G=e},`setDiagramId`),we=n(function(e){de=e},`setAxisFormat`),Te=n(function(){return de},`getAxisFormat`),Ee=n(function(e){fe=e},`setTickInterval`),De=n(function(){return fe},`getTickInterval`),Oe=n(function(e){pe=e},`setTodayMarker`),ke=n(function(){return pe},`getTodayMarker`),Ae=n(function(e){B=e},`setDateFormat`),je=n(function(){K=!0},`enableInclusiveEndDates`),Me=n(function(){return K},`endDatesAreInclusive`),Ne=n(function(){ye=!0},`enableTopAxis`),Pe=n(function(){return ye},`topAxisEnabled`),Fe=n(function(e){ge=e},`setDisplayMode`),Ie=n(function(){return ge},`getDisplayMode`),Le=n(function(){return B},`getDateFormat`),Re=n((e,t)=>{let n=t.toLowerCase().split(/[\s,]+/).filter(e=>e!==``);return[...new Set([...e,...n])]},`mergeTokens`),ze=n(function(e){V=Re(V,e)},`setIncludes`),Be=n(function(){return V},`getIncludes`),Ve=n(function(e){H=Re(H,e)},`setExcludes`),He=n(function(){return H},`getExcludes`),Ue=n(function(){return me},`getLinks`),We=n(function(e){W=e,he.push(e)},`addSection`),Ge=n(function(){return he},`getSections`),Ke=n(function(){let e=lt(),t=0;for(;!e&&t<10;)e=lt(),t++;return U=X,U},`getTasks`),qe=n(function(e,t,n,r){let i=e.format(t.trim()),a=e.format(`YYYY-MM-DD`);return r.includes(i)||r.includes(a)?!1:n.includes(`weekends`)&&(e.isoWeekday()===ue[q]||e.isoWeekday()===ue[q]+1)||n.includes(e.format(`dddd`).toLowerCase())?!0:n.includes(i)||n.includes(a)},`isInvalidDate`),Je=n(function(e){be=e},`setWeekday`),Ye=n(function(){return be},`getWeekday`),Xe=n(function(e){q=e},`setWeekend`),Ze=n(function(e,t,n,r){if(!n.length||e.manualEndTime)return;let i;i=e.startTime instanceof Date?(0,z.default)(e.startTime):(0,z.default)(e.startTime,t,!0),i=i.add(1,`d`);let a;a=e.endTime instanceof Date?(0,z.default)(e.endTime):(0,z.default)(e.endTime,t,!0);let[o,s]=Qe(i,a,t,n,r);e.endTime=o.toDate(),e.renderEndTime=s},`checkTaskDates`),Qe=n(function(e,t,n,r,i){let a=!1,o=null,s=t.add(1e4,`d`);for(;e<=t;){if(a||(o=t.toDate()),a=qe(e,n,r,i),a&&(t=t.add(1,`d`),t>s))throw Error("Failed to find a valid date that was not excluded by `excludes` after 10,000 iterations.");e=e.add(1,`d`)}return[t,o]},`fixTaskDates`),$e=n(function(e,t,r){if(r=r.trim(),n(e=>{let t=e.trim();return t===`x`||t===`X`},`isTimestampFormat`)(t)&&/^\d+$/.test(r))return new Date(Number(r));let i=/^after\s+(?<ids>[\d\w- ]+)/.exec(r);if(i!==null){let e=null;for(let t of i.groups.ids.split(` `)){let n=Z(t);n!==void 0&&(!e||n.endTime>e.endTime)&&(e=n)}if(e)return e.endTime;let t=new Date;return t.setHours(0,0,0,0),t}let a=(0,z.default)(r,t.trim(),!0);if(a.isValid())return a.toDate();{S.debug(`Invalid date:`+r),S.debug(`With date format:`+t.trim());let e=new Date(r);if(e===void 0||isNaN(e.getTime())||e.getFullYear()<-1e4||e.getFullYear()>1e4)throw Error(`Invalid date:`+r);return e}},`getStartDate`),et=n(function(e){let t=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(e.trim());return t===null?[NaN,`ms`]:[Number.parseFloat(t[1]),t[2]]},`parseDuration`),tt=n(function(e,t,n,r=!1){n=n.trim();let i=/^until\s+(?<ids>[\d\w- ]+)/.exec(n);if(i!==null){let e=null;for(let t of i.groups.ids.split(` `)){let n=Z(t);n!==void 0&&(!e||n.startTime<e.startTime)&&(e=n)}if(e)return e.startTime;let t=new Date;return t.setHours(0,0,0,0),t}let a=(0,z.default)(n,t.trim(),!0);if(a.isValid())return r&&(a=a.add(1,`d`)),a.toDate();let o=(0,z.default)(e),[s,c]=et(n);if(!Number.isNaN(s)){let e=o.add(s,c);e.isValid()&&(o=e)}return o.toDate()},`getEndDate`),nt=0,J=n(function(e){return e===void 0?(nt+=1,`task`+nt):e},`parseId`),rt=n(function(e,t){let n;n=t.substr(0,1)===`:`?t.substr(1,t.length):t;let r=n.split(`,`),i={};_t(r,i,_e);for(let e=0;e<r.length;e++)r[e]=r[e].trim();let a=``;switch(r.length){case 1:i.id=J(),i.startTime=e.endTime,a=r[0];break;case 2:i.id=J(),i.startTime=$e(void 0,B,r[0]),a=r[1];break;case 3:i.id=J(r[0]),i.startTime=$e(void 0,B,r[1]),a=r[2]}return a&&(i.endTime=tt(i.startTime,B,a,K),i.manualEndTime=(0,z.default)(a,`YYYY-MM-DD`,!0).isValid(),Ze(i,B,H,V)),i},`compileData`),it=n(function(e,t){let n;n=t.substr(0,1)===`:`?t.substr(1,t.length):t;let r=n.split(`,`),i={};_t(r,i,_e);for(let e=0;e<r.length;e++)r[e]=r[e].trim();switch(r.length){case 1:i.id=J(),i.startTime={type:`prevTaskEnd`,id:e},i.endTime={data:r[0]};break;case 2:i.id=J(),i.startTime={type:`getStartDate`,startData:r[0]},i.endTime={data:r[1]};break;case 3:i.id=J(r[0]),i.startTime={type:`getStartDate`,startData:r[1]},i.endTime={data:r[2]}}return i},`parseData`),at,Y,X=[],ot={},st=n(function(e,t){let n={section:W,type:W,processed:!1,manualEndTime:!1,renderEndTime:null,raw:{data:t},task:e,classes:[]},r=it(Y,t);n.raw.startTime=r.startTime,n.raw.endTime=r.endTime,n.id=r.id,n.prevTaskId=Y,n.active=r.active,n.done=r.done,n.crit=r.crit,n.milestone=r.milestone,n.vert=r.vert,n.vert?n.order=-1:(n.order=xe,xe++);let i=X.push(n);Y=n.id,ot[n.id]=i-1},`addTask`),Z=n(function(e){let t=ot[e];return X[t]},`findTaskById`),ct=n(function(e,t){let n={section:W,type:W,description:e,task:e,classes:[]},r=rt(at,t);n.startTime=r.startTime,n.endTime=r.endTime,n.id=r.id,n.active=r.active,n.done=r.done,n.crit=r.crit,n.milestone=r.milestone,n.vert=r.vert,at=n,U.push(n)},`addTaskOrg`),lt=n(function(){let e=n(function(e){let t=X[e],n=``;switch(X[e].raw.startTime.type){case`prevTaskEnd`:t.startTime=Z(t.prevTaskId).endTime;break;case`getStartDate`:n=$e(void 0,B,X[e].raw.startTime.startData),n&&(X[e].startTime=n)}return X[e].startTime&&(X[e].endTime=tt(X[e].startTime,B,X[e].raw.endTime.data,K),X[e].endTime&&(X[e].processed=!0,X[e].manualEndTime=(0,z.default)(X[e].raw.endTime.data,`YYYY-MM-DD`,!0).isValid(),Ze(X[e],B,H,V))),X[e].processed},`compileTask`),t=!0;for(let[n,r]of X.entries())e(n),t&&=r.processed;return t},`compileTasks`),ut=n(function(e,t){let n=t;D().securityLevel!==`loose`&&(n=(0,oe.sanitizeUrl)(t)),e.split(`,`).forEach(function(e){Z(e)!==void 0&&(pt(e,()=>{window.open(n,`_self`)}),me.set(e,n))}),dt(e,`clickable`)},`setLink`),dt=n(function(e,t){e.split(`,`).forEach(function(e){let n=Z(e);n!==void 0&&n.classes.push(t)})},`setClass`),ft=n(function(e,t,n){if(D().securityLevel!==`loose`||t===void 0)return;let r=[];if(typeof n==`string`){r=n.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let e=0;e<r.length;e++){let t=r[e].trim();t.startsWith(`"`)&&t.endsWith(`"`)&&(t=t.substr(1,t.length-2)),r[e]=t}}r.length===0&&r.push(e),Z(e)!==void 0&&pt(e,()=>{te.runFunc(t,...r)})},`setClickFun`),pt=n(function(e,t){ve.push(function(){let n=G?`${G}-${e}`:e,r=document.querySelector(`[id="${n}"]`);r!==null&&r.addEventListener(`click`,function(){t()})},function(){let n=G?`${G}-${e}`:e,r=document.querySelector(`[id="${n}-text"]`);r!==null&&r.addEventListener(`click`,function(){t()})})},`pushFun`),mt=n(function(e,t,n){e.split(`,`).forEach(function(e){ft(e,t,n)}),dt(e,`clickable`)},`setClickEvent`),ht=n(function(e){ve.forEach(function(t){t(e)})},`bindFunctions`),gt={getConfig:n(()=>D().gantt,`getConfig`),clear:Se,setDateFormat:Ae,getDateFormat:Le,enableInclusiveEndDates:je,endDatesAreInclusive:Me,enableTopAxis:Ne,topAxisEnabled:Pe,setAxisFormat:we,getAxisFormat:Te,setTickInterval:Ee,getTickInterval:De,setTodayMarker:Oe,getTodayMarker:ke,setAccTitle:A,getAccTitle:M,setDiagramTitle:O,getDiagramTitle:N,setDiagramId:Ce,setDisplayMode:Fe,getDisplayMode:Ie,setAccDescription:P,getAccDescription:I,addSection:We,getSections:Ge,getTasks:Ke,addTask:st,findTaskById:Z,addTaskOrg:ct,setIncludes:ze,getIncludes:Be,setExcludes:Ve,getExcludes:He,setClickEvent:mt,setLink:ut,getLinks:Ue,bindFunctions:ht,parseDuration:et,isInvalidDate:qe,setWeekday:Je,getWeekday:Ye,setWeekend:Xe};function _t(e,t,n){let r=!0;for(;r;)r=!1,n.forEach(function(n){let i=`^\\s*`+n+`\\s*$`,a=new RegExp(i);e[0].match(a)&&(t[n]=!0,e.shift(1),r=!0)})}n(_t,`getTaskTags`);var Q=e(C(),1),vt=e(ie(),1);Q.default.extend(vt.default);var yt=n(function(){S.debug(`Something is calling, setConf, remove the call`)},`setConf`),bt={monday:w,tuesday:l,wednesday:r,thursday:_,friday:o,saturday:d,sunday:v},xt=n((e,t)=>{let n=[...e].map(()=>-1/0),r=[...e].sort((e,t)=>e.startTime-t.startTime||e.order-t.order),i=0;for(let e of r)for(let r=0;r<n.length;r++)if(e.startTime>=n[r]){n[r]=e.endTime,e.order=r+t,r>i&&(i=r);break}return i},`getMaxIntersections`),$,St=1e4,Ct={parser:ae,db:gt,renderer:{setConf:yt,draw:n(function(e,t,r,o){let l=D().gantt;o.db.setDiagramId(t);let d=D().securityLevel,_;d===`sandbox`&&(_=m(`#i`+t));let v=m(d===`sandbox`?_.nodes()[0].contentDocument.body:`body`),C=d===`sandbox`?_.nodes()[0].contentDocument:document,w=C.getElementById(t);$=w.parentElement.offsetWidth,$===void 0&&($=1200),l.useWidth!==void 0&&($=l.useWidth);let O=o.db.getTasks(),A=O.filter(e=>!e.vert),M=[];for(let e of A)M.push(e.type);M=oe(M);let N={},P=2*l.topPadding;if(o.db.getDisplayMode()===`compact`||l.displayMode===`compact`){let e={};for(let t of A)e[t.section]===void 0?e[t.section]=[t]:e[t.section].push(t);let t=0;for(let n of Object.keys(e)){let r=xt(e[n],t)+1;t+=r,P+=r*(l.barHeight+l.barGap),N[n]=r}}else{P+=A.length*(l.barHeight+l.barGap);for(let e of M)N[e]=A.filter(t=>t.type===e).length}w.setAttribute(`viewBox`,`0 0 `+$+` `+P);let F=v.select(`[id="${t}"]`),I=h().domain([y(O,function(e){return e.startTime}),u(O,function(e){return e.endTime})]).rangeRound([0,$-l.leftPadding-l.rightPadding]);function ee(e,t){let n=e.startTime,r=t.startTime,i=0;return n>r?i=1:n<r&&(i=-1),i}n(ee,`taskCompare`),O.sort(ee),te(O,$,P),k(F,P,$,l.useMaxWidth),F.append(`text`).text(o.db.getDiagramTitle()).attr(`x`,$/2).attr(`y`,l.titleTopMargin).attr(`class`,`titleText`);function te(e,t,n){let r=l.barHeight,i=r+l.barGap,a=l.topPadding,s=l.leftPadding,c=f().domain([0,M.length]).range([`#00B9FA`,`#F95002`]).interpolate(E);re(i,a,s,t,n,e,o.db.getExcludes(),o.db.getIncludes()),ie(s,a,t,n),ne(e,i,a,s,r,c,t,n),R(i,a,s,r,c),ae(s,a,t,n)}n(te,`makeGantt`);function ne(e,n,r,i,a,s,c){e.sort((e,t)=>e.vert===t.vert?0:e.vert?1:-1);let u=e.filter(e=>!e.vert),d=[...new Set(u.map(e=>e.order))].map(e=>u.find(t=>t.order===e));F.append(`g`).selectAll(`rect`).data(d).enter().append(`rect`).attr(`x`,0).attr(`y`,function(e,t){return t=e.order,t*n+r-2}).attr(`width`,function(){return c-l.rightPadding/2}).attr(`height`,n).attr(`class`,function(e){for(let[t,n]of M.entries())if(e.type===n)return`section section`+t%l.numberSectionStyles;return`section section0`}).enter();let f=F.append(`g`).selectAll(`rect`).data(e).enter(),p=o.db.getLinks();if(f.append(`rect`).attr(`id`,function(e){return t+`-`+e.id}).attr(`rx`,3).attr(`ry`,3).attr(`x`,function(e){return e.milestone?I(e.startTime)+i+.5*(I(e.endTime)-I(e.startTime))-.5*a:I(e.startTime)+i}).attr(`y`,function(e,t){return t=e.order,e.vert?l.gridLineStartPadding:t*n+r}).attr(`width`,function(e){return e.milestone?a:e.vert?.08*a:I(e.renderEndTime||e.endTime)-I(e.startTime)}).attr(`height`,function(e){return e.vert?u.length*(l.barHeight+l.barGap)+l.barHeight*2:a}).attr(`transform-origin`,function(e,t){return t=e.order,(I(e.startTime)+i+.5*(I(e.endTime)-I(e.startTime))).toString()+`px `+(t*n+r+.5*a).toString()+`px`}).attr(`class`,function(e){let t=``;e.classes.length>0&&(t=e.classes.join(` `));let n=0;for(let[t,r]of M.entries())e.type===r&&(n=t%l.numberSectionStyles);let r=``;return e.active?e.crit?r+=` activeCrit`:r=` active`:e.done?r=e.crit?` doneCrit`:` done`:e.crit&&(r+=` crit`),r.length===0&&(r=` task`),e.milestone&&(r=` milestone `+r),e.vert&&(r=` vert `+r),r+=n,r+=` `+t,`task`+r}),f.append(`text`).attr(`id`,function(e){return t+`-`+e.id+`-text`}).text(function(e){return e.task}).attr(`font-size`,l.fontSize).attr(`x`,function(e){let t=I(e.startTime),n=I(e.renderEndTime||e.endTime);if(e.milestone&&(t+=.5*(I(e.endTime)-I(e.startTime))-.5*a,n=t+a),e.vert)return I(e.startTime)+i;let r=this.getBBox().width;return r>n-t?n+r+1.5*l.leftPadding>c?t+i-5:n+i+5:(n-t)/2+t+i}).attr(`y`,function(e,t){return e.vert?l.gridLineStartPadding+u.length*(l.barHeight+l.barGap)+60:(t=e.order,t*n+l.barHeight/2+(l.fontSize/2-2)+r)}).attr(`text-height`,a).attr(`class`,function(e){let t=I(e.startTime),n=I(e.endTime);e.milestone&&(n=t+a);let r=this.getBBox().width,i=``;e.classes.length>0&&(i=e.classes.join(` `));let o=0;for(let[t,n]of M.entries())e.type===n&&(o=t%l.numberSectionStyles);let s=``;return e.active&&(s=e.crit?`activeCritText`+o:`activeText`+o),e.done?s=e.crit?s+` doneCritText`+o:s+` doneText`+o:e.crit&&(s=s+` critText`+o),e.milestone&&(s+=` milestoneText`),e.vert&&(s+=` vertText`),r>n-t?n+r+1.5*l.leftPadding>c?i+` taskTextOutsideLeft taskTextOutside`+o+` `+s:i+` taskTextOutsideRight taskTextOutside`+o+` `+s+` width-`+r:i+` taskText taskText`+o+` `+s+` width-`+r}),D().securityLevel===`sandbox`){let e;e=m(`#i`+t);let n=e.nodes()[0].contentDocument;f.filter(function(e){return p.has(e.id)}).each(function(e){var r=n.querySelector(`#`+CSS.escape(t+`-`+e.id)),i=n.querySelector(`#`+CSS.escape(t+`-`+e.id+`-text`));let a=r.parentNode;var o=n.createElement(`a`);o.setAttribute(`xlink:href`,p.get(e.id)),o.setAttribute(`target`,`_top`),a.appendChild(o),o.appendChild(r),o.appendChild(i)})}}n(ne,`drawRects`);function re(e,n,r,i,a,s,c,u){if(c.length===0&&u.length===0)return;let d,f;for(let{startTime:e,endTime:t}of s)(d===void 0||e<d)&&(d=e),(f===void 0||t>f)&&(f=t);if(!d||!f)return;if((0,Q.default)(f).diff((0,Q.default)(d),`year`)>5){S.warn(`The difference between the min and max time is more than 5 years. This will cause performance issues. Skipping drawing exclude days.`);return}let p=o.db.getDateFormat(),m=[],h=null,g=(0,Q.default)(d);for(;g.valueOf()<=f;)o.db.isInvalidDate(g,p,c,u)?h?h.end=g:h={start:g,end:g}:h&&=(m.push(h),null),g=g.add(1,`d`);F.append(`g`).selectAll(`rect`).data(m).enter().append(`rect`).attr(`id`,e=>t+`-exclude-`+e.start.format(`YYYY-MM-DD`)).attr(`x`,e=>I(e.start.startOf(`day`))+r).attr(`y`,l.gridLineStartPadding).attr(`width`,e=>I(e.end.endOf(`day`))-I(e.start.startOf(`day`))).attr(`height`,a-n-l.gridLineStartPadding).attr(`transform-origin`,function(t,n){return(I(t.start)+r+.5*(I(t.end)-I(t.start))).toString()+`px `+(n*e+.5*a).toString()+`px`}).attr(`class`,`exclude-range`)}n(re,`drawExcludeDays`);function L(e,t,n,r){if(n<=0||e>t)return 1/0;let i=t-e,a=Q.default.duration({[r??`day`]:n}).asMilliseconds();return a<=0?1/0:Math.ceil(i/a)}n(L,`getEstimatedTickCount`);function ie(e,t,n,r){let u=o.db.getDateFormat(),d=o.db.getAxisFormat(),f;f=d||(u===`D`?`%d`:l.axisFormat??`%Y-%m-%d`);let m=a(I).tickSize(-r+t+l.gridLineStartPadding).tickFormat(x(f)),h=/^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/.exec(o.db.getTickInterval()||l.tickInterval);if(h!==null){let e=parseInt(h[1],10);if(isNaN(e)||e<=0)S.warn(`Invalid tick interval value: "${h[1]}". Skipping custom tick interval.`);else{let t=h[2],n=o.db.getWeekday()||l.weekday,r=I.domain(),a=r[0],s=r[1],u=L(a,s,e,t);if(u>St)S.warn(`The tick interval "${e}${t}" would generate ${u} ticks, which exceeds the maximum allowed (${St}). This may indicate an invalid date or time range. Skipping custom tick interval.`);else switch(t){case`millisecond`:m.ticks(c.every(e));break;case`second`:m.ticks(T.every(e));break;case`minute`:m.ticks(g.every(e));break;case`hour`:m.ticks(i.every(e));break;case`day`:m.ticks(b.every(e));break;case`week`:m.ticks(bt[n].every(e));break;case`month`:m.ticks(p.every(e))}}}if(F.append(`g`).attr(`class`,`grid`).attr(`transform`,`translate(`+e+`, `+(r-50)+`)`).call(m).selectAll(`text`).style(`text-anchor`,`middle`).attr(`fill`,`#000`).attr(`stroke`,`none`).attr(`font-size`,10).attr(`dy`,`1em`),o.db.topAxisEnabled()||l.topAxis){let n=s(I).tickSize(-r+t+l.gridLineStartPadding).tickFormat(x(f));if(h!==null){let e=parseInt(h[1],10);if(isNaN(e)||e<=0)S.warn(`Invalid tick interval value: "${h[1]}". Skipping custom tick interval.`);else{let t=h[2],r=o.db.getWeekday()||l.weekday,a=I.domain(),s=a[0],u=a[1];if(L(s,u,e,t)<=St)switch(t){case`millisecond`:n.ticks(c.every(e));break;case`second`:n.ticks(T.every(e));break;case`minute`:n.ticks(g.every(e));break;case`hour`:n.ticks(i.every(e));break;case`day`:n.ticks(b.every(e));break;case`week`:n.ticks(bt[r].every(e));break;case`month`:n.ticks(p.every(e))}}}F.append(`g`).attr(`class`,`grid`).attr(`transform`,`translate(`+e+`, `+t+`)`).call(n).selectAll(`text`).style(`text-anchor`,`middle`).attr(`fill`,`#000`).attr(`stroke`,`none`).attr(`font-size`,10)}}n(ie,`makeGrid`);function R(e,t){let n=0,r=Object.keys(N).map(e=>[e,N[e]]);F.append(`g`).selectAll(`text`).data(r).enter().append(function(e){let t=e[0].split(j.lineBreakRegex),n=-(t.length-1)/2,r=C.createElementNS(`http://www.w3.org/2000/svg`,`text`);r.setAttribute(`dy`,n+`em`);for(let[e,n]of t.entries()){let t=C.createElementNS(`http://www.w3.org/2000/svg`,`tspan`);t.setAttribute(`alignment-baseline`,`central`),t.setAttribute(`x`,`10`),e>0&&t.setAttribute(`dy`,`1em`),t.textContent=n,r.appendChild(t)}return r}).attr(`x`,10).attr(`y`,function(i,a){if(a>0)for(let o=0;o<a;o++)return n+=r[a-1][1],i[1]*e/2+n*e+t;else return i[1]*e/2+t}).attr(`font-size`,l.sectionFontSize).attr(`class`,function(e){for(let[t,n]of M.entries())if(e[0]===n)return`sectionTitle sectionTitle`+t%l.numberSectionStyles;return`sectionTitle`})}n(R,`vertLabels`);function ae(e,t,n,r){let i=o.db.getTodayMarker();if(i===`off`)return;let a=F.append(`g`).attr(`class`,`today`),s=new Date,c=a.append(`line`);c.attr(`x1`,I(s)+e).attr(`x2`,I(s)+e).attr(`y1`,l.titleTopMargin).attr(`y2`,r-l.titleTopMargin).attr(`class`,`today`),i!==``&&c.attr(`style`,i.replace(/,/g,`;`))}n(ae,`drawToday`);function oe(e){let t={},n=[];for(let r=0,i=e.length;r<i;++r)Object.prototype.hasOwnProperty.call(t,e[r])||(t[e[r]]=!0,n.push(e[r]));return n}n(oe,`checkUnique`)},`draw`)},styles:n(e=>`
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

  /* Done task text displayed outside the bar sits against the diagram background,
     not against the done-task bar, so it must use the outside/contrast color. */
  .doneText0.taskTextOutsideLeft,
  .doneText0.taskTextOutsideRight,
  .doneText1.taskTextOutsideLeft,
  .doneText1.taskTextOutsideRight,
  .doneText2.taskTextOutsideLeft,
  .doneText2.taskTextOutsideRight,
  .doneText3.taskTextOutsideLeft,
  .doneText3.taskTextOutsideRight {
    fill: ${e.taskTextOutsideColor} !important;
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

  /* Done-crit task text outside the bar \u2014 same reasoning as doneText above. */
  .doneCritText0.taskTextOutsideLeft,
  .doneCritText0.taskTextOutsideRight,
  .doneCritText1.taskTextOutsideLeft,
  .doneCritText1.taskTextOutsideRight,
  .doneCritText2.taskTextOutsideLeft,
  .doneCritText2.taskTextOutsideRight,
  .doneCritText3.taskTextOutsideLeft,
  .doneCritText3.taskTextOutsideRight {
    fill: ${e.taskTextOutsideColor} !important;
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
`,`getStyles`)};export{Ct as diagram};