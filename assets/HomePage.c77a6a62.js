import{C as z}from"./Common.7e800c3b.js";import{P as T}from"./Pager.60cc6965.js";import{_ as L,f as y,r as C,o as l,c as m,a as t,h as a,Q as N,t as b,b as p,w as B,s as w,H as Y,u as R,i as S,R as A,F as M,D as V,g as I,A as P,n as F,q as H}from"./app.4a19620f.js";import{f as q}from"./resolveTime.bbe121e0.js";const E={class:"post-item"},j=["src"],O={class:"else"},G={class:"post-item__date"},Q={key:0},U=["innerHTML"],J=y({__name:"PostListItem",props:{item:{type:Object,required:!0}},setup(i){const u=e=>e.replace(/<RouterLink to/g,"<a href").replace(/<\/RouterLink>/g,"</a>");return(e,r)=>{const d=C("RouterLink");return l(),m("div",E,[t("div",{class:"post-item__img",onClick:r[0]||(r[0]=v=>e.$router.push(i.item.path))},[t("img",{src:a(N)(i.item.info.headerImage)},null,8,j)]),t("div",O,[t("p",G,b(i.item.info.date?a(q)(i.item.info.date):""),1),p(d,{to:i.item.path,class:"post-item__title"},{default:B(()=>[t("h2",null,b(i.item.info.title),1),i.item.info.subtitle?(l(),m("h3",Q,b(i.item.info.subtitle),1)):w("",!0)]),_:1},8,["to"]),t("div",{class:"post-item__content",innerHTML:u(i.item.info.excerpt||"")},null,8,U)])])}}});var K=L(J,[["__file","PostListItem.vue"]]);const W={class:"postlist-wrapper"},X=y({__name:"PostList",setup(i){const u=Y(),e=R(),r=S(()=>{const o=decodeURI(u.currentRoute.value.path.replace(/\/page/g,"").replace(/\//g,""));return o===""?1:Number(o)}),{slicedPosts:d,postListPager:v}=A(r),h=S(()=>{const o=v.value,n=o&&o.next?{text:e.value.homeNext,link:o.next}:null,c=o&&o.prev?{text:e.value.homePrev,link:o.prev}:null;return{next:n,prev:c}});return(o,n)=>(l(),m("div",W,[(l(!0),m(M,null,V(a(d),c=>(l(),I(K,{key:c.path,item:c},null,8,["item"]))),128)),a(h).next||a(h).prev?(l(),I(T,{key:0,data:a(h)},null,8,["data"])):w("",!0)]))}});var Z=L(X,[["__file","PostList.vue"]]);const ee={class:"sns-wrapper"},te=["href"],oe=y({__name:"SNS",props:{large:{type:Boolean,default:!0}},setup(i){var o;const u={github:{icon:"fa-github-alt",preLink:"https://github.com/"},linkedin:{icon:"fa-linkedin-in",preLink:"https://www.linkedin.com/in/"},facebook:{icon:"fa-facebook-f",preLink:"https://www.facebook.com/"},twitter:{icon:"fa-twitter",preLink:"https://www.twitter.com/"},zhihu:{icon:"ri-zhihu-line",preLink:"https://www.zhihu.com/people/"},weibo:{icon:"ri-weibo-fill",preLink:"http://weibo.com/u/"},email:{icon:"fa-envelope",preLink:"mailto:"},rss:{icon:"ri-rss-fill",preLink:"",iconScale:.9}},r=(o=R().value.personalInfo)==null?void 0:o.sns,d=(n,c)=>typeof n=="string"?u[c].preLink+n:n.link,v=(n,c)=>typeof n=="string"?u[c].icon:n.icon,h=(n,c)=>(typeof n=="string"?u[c].iconScale:n.iconScale)||1;return(n,c)=>{const g=C("VIcon");return l(),m("div",ee,[(l(!0),m(M,null,V(a(r),(k,f)=>(l(),m("a",{key:`${f}-${k}`,href:d(k,f),target:"_blank",rel:"noopener noreferrer"},[p(g,{class:"icon-stack"},{default:B(()=>[i.large?(l(),I(g,{key:0,name:"fa-circle",scale:"2.3",class:"icon-circle"})):w("",!0),p(g,{name:v(k,f),scale:h(k,f),class:"icon-sns",inverse:""},null,8,["name","scale"])]),_:2},1024)],8,te))),128))])}}});var ne=L(oe,[["__file","SNS.vue"]]);const se={class:"home-blog"},ae=["src"],ie={key:0,class:"hero-bubble"},re={class:"hero-bubble__body"},le=t("div",{class:"hero-bubble__tile"},null,-1),ce={class:"hero-info"},ue={class:"description"},me=y({__name:"Home",setup(i){const u=R(),e=u.value.homeHeaderImages,r=P(-1),d=P(1),v=()=>{window.scrollTo({top:document.querySelector(".hero").clientHeight,behavior:"smooth"})},h=u.value.hitokoto,o=P("\u6B63\u5728\u52A0\u8F7D\u4E00\u8A00...");let n=!1;const c=()=>{if(!h||n)return;n=!0;let _=h;_=typeof _=="string"?_:"https://v1.hitokoto.cn",fetch(_).then(s=>s.json()).then(s=>o.value=s.hitokoto).catch(s=>{console.log(`Get ${_} error: `,s)})};F(()=>{e&&e.length>0&&(r.value=Math.floor(Math.random()*e.length))});const g=_=>{if(!(e&&e.length>0))return;const s=e.length;r.value=(r.value+_+s)%s},k=S(()=>e&&e.length>0&&r.value!==-1?`url(${N(e[r.value].path)})`:"none"),f=S(()=>e&&e.length>0&&r.value!==-1?e[r.value].mask:null),x=u.value.personalInfo;return(_,s)=>{const $=C("VIcon");return l(),m("main",se,[t("div",{class:"hero",style:H({"background-image":a(k)})},[a(f)?(l(),m("div",{key:0,class:"hero-mask",style:H({background:a(f)})},null,4)):w("",!0),t("div",{class:"hero-content",style:H({opacity:d.value})},[t("img",{class:"hero-avatar hide-on-mobile",src:a(N)(a(x).avatar),alt:"hero",onMouseover:c},null,40,ae),a(h)?(l(),m("div",ie,[t("div",re,[t("p",null,b(o.value),1)]),le])):w("",!0),t("div",ce,[t("h1",null,b(a(x).name),1),t("p",ue,b(a(x).description),1)]),p(ne,{class:"hide-on-mobile",large:""}),t("button",{class:"hero-img-prev hide-on-mobile",onClick:s[0]||(s[0]=D=>g(-1))},[p($,{name:"fa-chevron-left"})]),t("button",{class:"hero-img-next hide-on-mobile",onClick:s[1]||(s[1]=D=>g(1))},[p($,{name:"fa-chevron-right"})]),t("span",{class:"hero-arrow-down hide-on-mobile",onClick:s[2]||(s[2]=D=>v())},[p($,{name:"fa-chevron-down",animation:"float"})])],4)],4),p(Z)])}}});var he=L(me,[["__file","Home.vue"]]);const pe=y({__name:"HomePage",setup(i){return(u,e)=>(l(),I(z,null,{page:B(()=>[p(he)]),_:1}))}});var ge=L(pe,[["__file","HomePage.vue"]]);export{ge as default};
