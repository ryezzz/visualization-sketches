"use strict";(self.webpackChunkvisualization_sketches=self.webpackChunkvisualization_sketches||[]).push([[493],{9906:function(e,t,n){n.d(t,{X:function(){return r}});var r=function(e){return e.allDataCsv.edges[0].node.items}},1178:function(e,t,n){n.r(t),n.d(t,{default:function(){return l}});var r=n(7294),i=n(9906),u=n(6601),a=n(6446),o=(n(8405),n(7136)),c=n(2884),d=n(5914);var f=function(e,t){var n,i,u,f,l=t.data,s=void 0===l?e.data:l,m=t.selectedDate,h=(void 0===m&&e.selectedDate,t.selectedValue),g=void 0===h?e.selectedValue:h,v=t.height,p=void 0===v?e.height:v,w=t.width,y=void 0===w?e.width:w,E=t.marginLeft,k=(void 0===E&&e.margin,t.marginBottom),x=void 0===k?e.marginTop:k,C=t.marginRight,R=(void 0===C&&e.marginRight,t.padding),b=void 0===R?0:R,z=(0,r.useState)([]),D=z[0],S=z[1],T=(0,r.useState)(null),W=T[0],_=T[1],V=(i="year",u=null!=(n=W)?n:i,f=(0,r.useRef)(),(0,r.useEffect)((function(){f.current=u})),f.current),B=a.BYU().domain(a.Wem(s,(function(e){return e[g]}))).range([1,p/80]),F=function(e,t){return a.cJy().domain(a.Wem(s,(function(e){return e[t]}))).range([100,y])},H=function(e){return B(e)};(0,r.useEffect)((function(){_("year")}),[]);var L=(0,o.s)(s,V,g,F(0,V),H,b),U=(0,o.s)(s,W,g,F(0,W),H,b);return(0,r.useEffect)((function(){function e(){var e=[];L.map((function(t){return e.push(t)})),S(e)}c.p8.fromTo(L,{x:function(e){return L[e].x},y:function(e){return L[e].y}},{x:function(e){return U[e].x},y:function(e){return U[e].y},ease:"power.3.out",duration:.5,onUpdate:e,lazy:!0,stagger:{each:.001,from:"random"}})}),[W]),r.createElement(r.Fragment,null,["week","month","year"].map((function(e){return function(e,t){return r.createElement("button",{value:e,onClick:function(e){t(e.target.value)}},e)}(e,_)})),r.createElement(d.ZP,{width:y,height:p,renderer:"svg"},null==D?void 0:D.map((function(e,t){return r.createElement(r.Fragment,null,r.createElement(d.Cd,{diameter:2*e.r,stroke:"purple",x:e.x,y:p-x-b-e.y}))}))))},l=function(e){var t=e.data,n=(0,r.useState)(1e4),a=n[0],o=n[1],c=(0,r.useState)(1e4),d=c[0],l=c[1],s=(0,r.useRef)(),m=(0,i.X)(t),h=(0,u.xT)(m);return(0,r.useEffect)((function(){o(s.current.clientWidth),l(s.current.clientHeight),window.onresize=function(){o(s.current.clientWidth),l(s.current.clientHeight)}}),[a,d]),r.createElement("div",{ref:s,style:{border:"solid 2px white",width:"100%",height:"100vh"}},r.createElement(f,{selectedDate:"week",selectedValue:"entry_word_count",data:h,margin:0,marginLeft:100,marginTop:0,marginRight:100,width:a,height:d}))}}}]);
//# sourceMappingURL=component---src-pages-childhood-diary-swarm-scroll-smooth-js-f731f907e805007e89c2.js.map