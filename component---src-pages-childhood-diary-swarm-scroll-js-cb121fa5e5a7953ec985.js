"use strict";(self.webpackChunkvisualization_sketches=self.webpackChunkvisualization_sketches||[]).push([[410],{263:function(e,t,n){n.r(t),n.d(t,{default:function(){return h}});var r=n(7294),a=n(2149),i=n(8352),o=n(2884),l=n(615),c=n(7136),u=function(e){var t=e.pixelRatio,n=e.height,u=e.width,s=e.margin,d=e.marginLeft,f=(e.marginTop,e.particles),h=(0,r.useRef)(),m=(0,r.useRef)(),v=(0,r.useRef)(),p=function(e,t){var n=(0,r.useRef)(t);return(0,r.useEffect)((function(){n.current=e})),n.current}(e.dateSelection,"year"),y=i.BYU().domain(i.Wem(f,(function(t){return t[e.valueSelection]}))).range([1,n/80]),g=function(e,t){return i.cJy().domain(i.Wem(f,(function(e){return e[t]}))).range([d,u-0])},x=function(e){return y(e)},w=(0,c.s)(f,p,e.valueSelection,g(0,p),x,0),S=(0,c.s)(f,e.dateSelection,e.valueSelection,g(0,e.dateSelection),x,0),b=(0,l.j)()&&i.Ys("#tooltipDiv").style("background-color","white").style("border-radius","2px").style("box-shadow","0 3px 6px rgba(0, 0, 0, 0.3), 0 3px 6px rgba(0, 0, 0, 0.4)").style("opacity",0).style("padding","5px").style("z-index",1e6);var k=i.cJy().domain(i.Wem(f,(function(t){return t[e.dateSelection]}))).range([s,u-s]),E=i.LLu(k).ticks(5).tickFormat((function(e){return""+e}));return(0,r.useEffect)((function(){var r=h.current.getContext("2d");r.scale(t,t),r.setTransform(t,0,0,t,0,0),r.globalAlpha=.8;onscroll=function(e){c()};var c=function(){i.Ys(m.current).attr("r",0)};onmousemove=function(t){t.preventDefault();var r=window.pageYOffset;console.log("offset",r);var o=i.cx$(t,undefined),d=o[0]+s,f=n-o[1]+r,h=d<u,v=(e.dateSelection,a.Z.from(S.map((function(e){return[e.x,e.y]})))).find(d,f);console.log(v);var p=S[v];console.log(p);var y,g,x,w=p.x,k=n-p.y,E=p.data[e.valueSelection],j=p.data[e.dateSelection],R=p.data.date;h?function(t,n,r,a,i){(0,l.j)()&&b.style("opacity",.7).style("display","block").style("top",n+"px").style("left",t+30-s+"px").style("z-index",5e5).html('<div class ="swarmTooltipText">\n          <div>words written: <b>'+r+"</b></div>\n          <div>"+e.dateSelection+": <b>"+a+"</b></div>\n          <div><b>"+i+"</b></div>\n          </div>")}(w,k,E,j,R):(l.j&&b.style("display","none"),l.j&&b.style("opacity","0")),h?(g=(y=p).x-s,x=y.y,i.Ys(m.current).attr("r",y.r+.5).attr("cx",g).attr("cy",n-x).attr("fill","rgba(255, 255, 255,1)")):c(p)},function(){r.fillStyle="rgb(226, 99, 255)",r.strokeStyle="rgb(226, 99, 255)";function e(){r.restore(),r.clearRect(0,0,u,n),i.Ys(v.current).call(E).transition(),r.beginPath(),w.map((function(e,t){return r.beginPath(),r.arc(e.x-s,n-e.y,e.r,0,2*Math.PI),r.fill()}))}o.p8.fromTo(w,{x:function(e){return w[e].x},y:function(e){return w[e].y}},{x:function(e){return S[e].x},y:function(e){return S[e].y},duration:.5,ease:"strong.inOut",onUpdate:e,stagger:{each:5e-4,from:"random"}})}()}),[e.dateSelection,e.width,e.height,e.pixelRatio]),!1===(0,l.j)()?r.createElement(r.Fragment,null):r.createElement("div",{className:"canvasStickyChartContainer"},r.createElement("div",{id:"tooltipDiv",className:"tooltipDiv"}),r.createElement("svg",{className:"canvasStickyPointHighlight",width:u,height:n},r.createElement("circle",{r:0,className:"highlightCircle",ref:m})),r.createElement("canvas",{className:"canvasStickyChart",style:{width:e.width+"px",height:e.height+"px"},ref:h,particles:e.particles,stroke:e.stroke,width:e.width*e.pixelRatio,height:e.height*e.pixelRatio,useScrollData:e.useScrollData,dateSelection:e.dateSelection,valueSelection:e.valueSelection,margin:e.margin}),r.createElement("svg",{style:{top:e.height-1},className:"canvasStickyChartAxis"},r.createElement("g",{className:"darkModeAxis",ref:v})))},s=n(2826),d=(n(2881),n(8830)),f=n(6601),h=function(e){var t=e.data.allDataCsv.edges[0].node.items,n=(0,r.useState)(0),a=n[0],i=n[1],o=(0,r.useState)((0,l.j)()?window.devicePixelRatio:0),c=o[0],h=o[1],m=(0,r.useState)((0,l.j)()?window.innerWidth:0),v=m[0],p=m[1],y=(0,r.useState)((0,l.j)()?window.innerHeight:0),g=y[0],x=y[1];return r.useEffect((function(){(0,l.j)()&&(p(window.innerWidth),x(window.innerHeight),h(window.devicePixelRatio),window.onresize=function(e){p(window.innerWidth),x(window.innerHeight),h(window.devicePixelRatio)})}),[v,c]),!1===(0,l.j)()?r.createElement(r.Fragment,null):r.createElement("div",null,r.createElement("div",null,r.createElement(u,{className:"staticGraphicContainer",height:.95*g,width:.6*v,particles:(0,f.x)(t),useScrollData:s.k,dateSelection:(0,f.V)(a).date_selection,valueSelection:"entry_word_count",stepIndex:a,margin:45,marginLeft:.1*v,marginTop:.7*g,pixelRatio:c}),r.createElement("div",{className:"scrollingTextContainer darkModeScrollingTitle"},r.createElement(d.k,{offset:.5,onStepEnter:function(e){i(e.data)},debug:!1},[0,1,2].map((function(e,t){return r.createElement(d.h,{data:t,key:t},r.createElement("div",{style:{opacity:a===t?1:.2},class:"textStep"},(0,f.V)(t).title))}))))))}},7136:function(e,t,n){function r(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(n)return(n=n.call(e)).next.bind(n);if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return a(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return a(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0;return function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function a(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}n.d(t,{s:function(){return i}});var i=function(e,t,n,a,i,o){var l=e.map((function(e){return{x:a(e[t]),r:i(e[n]),data:e}})),c=null,u=null;function s(e,t,n){for(var r=c;r;){if(Math.pow(r.r+n+o,2)-.001>Math.pow(r.x-e,2)+Math.pow(r.y-t,2))return!0;r=r.next}return!1}for(var d,f=r(l);!(d=f()).done;){var h=d.value;if(s(h.x,h.y=h.r,h.r)){var m=c;h.y=1/0;do{var v=m.y+Math.sqrt(Math.pow(m.r+h.r+o,2)-Math.pow(m.x-h.x,2));v<h.y&&!s(h.x,v,h.r)&&(h.y=v),m=m.next}while(m)}h.next=null,null===c?c=u=h:u=u.next=h}return l}}}]);
//# sourceMappingURL=component---src-pages-childhood-diary-swarm-scroll-js-cb121fa5e5a7953ec985.js.map