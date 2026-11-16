
const K=n=>"KSh "+Math.round(n).toLocaleString("en-KE");
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const CATS=["All","Phones","Electronics","Fashion","Home","Beauty","Groceries","Sports"];
const D=[["Tecno Spark 20 128GB","Phones",15499,18999,"📱","Mobile Hub KE",4.5],["Infinix Hot 40i","Phones",13999,16500,"📱","Mobile Hub KE",4.3],["Wireless Earbuds Pro","Electronics",1899,3200,"🎧","SoundCity",4.2],["32″ Smart LED TV","Electronics",17999,22500,"📺","TV Zone",4.6],["Power Bank 20,000mAh","Electronics",2299,3000,"🔋","SoundCity",4.4],["Men’s Running Shoes","Fashion",2499,3999,"👟","Urban Steps",4.1],["Ladies Handbag","Fashion",1799,2600,"👜","Mama Mia Styles",4.3],["Kitenge Dress","Fashion",2200,3000,"👗","Mama Mia Styles",4.7],["Non-stick Cookware Set","Home",4999,6800,"🍳","HomeEase",4.4],["Electric Kettle 1.8L","Home",1450,2100,"🫖","HomeEase",4.2],["Bedding Set (Queen)","Home",3200,4500,"🛏️","HomeEase",4.5],["Shea Body Butter 500g","Beauty",850,1200,"🧴","Glow Naturals",4.6],["Perfume 100ml","Beauty",1999,2800,"🌸","Glow Naturals",4.0],["Pishori Rice 5kg","Groceries",1050,1250,"🍚","FreshBasket",4.5],["Cooking Oil 3L","Groceries",880,1050,"🫙","FreshBasket",4.3],["Football (Size 5)","Sports",1200,1800,"⚽","ProSport",4.4],["Yoga Mat","Sports",1100,1600,"🧘","ProSport",4.2]];
const X=[["Used iPhone 11 64GB","Phones",28500,35000,"📱","Brian O. (Nairobi)",4.6,"C2C",1,1,"Good condition"],["HP EliteBook 840 (Refurb)","Electronics",32000,40000,"💻","Faith W. (Thika)",4.5,"C2C",1,1,"Like new"],["3-Seater Sofa","Home",18000,25000,"🛋️","Kevin M. (Nakuru)",4.2,"C2C",1,1,"Fair"],["Mountain Bike 26″","Sports",9500,14000,"🚲","Amina S. (Mombasa)",4.7,"C2C",1,1,"Good condition"],["Pishori Rice 50kg Sack","Groceries",5900,6500,"🌾","Mwea Millers Ltd",4.6,"B2B",10,500],["Plain Cotton T-shirts","Fashion",320,500,"👕","Eastleigh Garments",4.3,"B2B",50,2000],["Phone Cases Assorted","Phones",95,180,"📲","Gikomba Accessories",4.1,"B2B",100,5000],["Cooking Oil 20L Jerrycan","Groceries",5400,6000,"🛢️","Bidco Distributors",4.4,"B2B",5,300],["Shea Butter 25kg Bulk","Beauty",9800,12000,"🧴","Glow Naturals",4.5,"B2B",4,100]];
let S={v:"shop",cat:"All",q:"",wallet:5000,cart:{},orders:[],tx:[],earn:0,paid:0,mode:"ind",t:"All",offer:{},users:{},user:null,tickets:[],refunds:[],consent:false,heroIndex:0,productId:null,favourites:[],
 prods:D.concat(X).map((d,i)=>({id:i+1,n:d[0],c:d[1],p:d[2],o:d[3],e:d[4],s:d[5],r:d[6],t:d[7]||"B2C",moq:d[8]||1,st:d[9]||20,cond:d[10]||"",mine:false})),nid:100};
try{const z=localStorage.getItem("morimall_v2");if(z)S=Object.assign(S,JSON.parse(z))}catch(e){}
const save=()=>{persist();try{localStorage.setItem("morimall_v2",JSON.stringify(S))}catch(e){}};
const FEE={C2C:.05,B2C:.08,B2B:.03},VAT=0.16;
function go(v){S.v=v;draw();scrollTo(0,0)}
function toast(m){const t=document.createElement("div");t.className="toast";t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}
function pay(amount,method,done){
 if(method=="wallet"){if(S.wallet<amount)return toast("Insufficient wallet balance – top up first");S.wallet-=amount;return done("Wallet")}
 const m=document.createElement("div");m.className="modal";
 m.innerHTML=method=="mpesa"?`<div><h3>M-Pesa payment</h3><p>Pay <b>${K(amount)}</b> to Morimall (Paybill 400200)</p><input id="ph" placeholder="07XX XXX XXX" inputmode="tel"><button class="btn g" style="width:100%" id="go">Send STK push</button><button class="btn o" style="width:100%;margin-top:6px" id="cx">Cancel</button></div>`
 :`<div><h3>Card payment</h3><p>Pay <b>${K(amount)}</b></p><input id="cn" placeholder="Card number (demo)" inputmode="numeric" maxlength="19"><input placeholder="MM/YY" maxlength="5"><button class="btn g" style="width:100%" id="go">Pay now</button><button class="btn o" style="width:100%;margin-top:6px" id="cx">Cancel</button></div>`;
 document.body.appendChild(m);m.querySelector("#cx").onclick=()=>m.remove();
 m.querySelector("#go").onclick=()=>{
  if(method=="mpesa"&&!/^(\+?254|0)[17]\d{8}$/.test(m.querySelector("#ph").value.replace(/\s/g,"")))return toast("Enter a valid Safaricom/Airtel number");
  if(method=="card"&&m.querySelector("#cn").value.replace(/\D/g,"").length<12)return toast("Enter a valid card number");
  m.firstChild.innerHTML=`<h3>${method=="mpesa"?"Check your phone 📲":"Processing…"}</h3><p>${method=="mpesa"?"Enter your M-Pesa PIN to approve.":"Contacting your bank…"}</p>`;
  setTimeout(()=>{m.remove();done(method=="mpesa"?"M-Pesa":"Card")},1800)}}
function wallet(){return `<div class="two"><div class="box"><div class="mut">Wallet balance</div><div class="big">${K(S.wallet)}</div>
 <label class="mut">Top up amount (KSh)</label><input id="ta" type="number" min="50" value="1000"><button class="btn g" style="width:100%" onclick="topup()">Top up via M-Pesa</button></div>
 <div class="box"><h3>Transactions</h3>${S.tx.length?S.tx.slice(0,12).map(x=>`<div class="row"><span>${esc(x.t)}<br><span class="mut">${x.d}</span></span><span class="${x.a>0?"pos":"neg"}">${x.a>0?"+":"−"}${K(Math.abs(x.a))}</span></div>`).join(""):"<p class='mut'>No transactions yet.</p>"}</div></div>`}
function topup(){const a=+document.getElementById("ta").value;if(!(a>=50))return toast("Minimum top-up is KSh 50");
 pay(a,"mpesa",()=>{S.wallet+=a;S.tx.unshift({d:new Date().toLocaleString("en-KE"),t:"Wallet top-up (M-Pesa)",a});save();toast("Wallet topped up");draw()})}
function payout(){S.tx.unshift({d:new Date().toLocaleString("en-KE"),t:"Seller payout to M-Pesa",a:0});S.paid+=S.earn;toast("Sent "+K(S.earn)+" to your M-Pesa");S.earn=0;S.tx.shift();save();draw()}
const pr=p=>S.offer[p.id]||p.p;
const isDark=()=>(document.documentElement.dataset.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"))=="dark";
try{const t=localStorage.getItem("mm-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}
function theme(){document.documentElement.dataset.theme=isDark()?"light":"dark";try{localStorage.setItem("mm-theme",document.documentElement.dataset.theme)}catch(e){}draw()}
function mode(){S.mode=S.mode=="biz"?"ind":"biz";if(S.mode=="ind"){for(const id in S.cart)if(S.prods.find(x=>x.id==id).t=="B2B")delete S.cart[id];if(S.t=="B2B")S.t="All"}save();draw()}
function add(id,n=1){const p=S.prods.find(x=>x.id==id),c=S.cart[id]||0;
 if(p.t=="B2B"&&S.mode!="biz")return toast("Switch to a Business account to buy wholesale");
 let q=c+n;if(c==0)q=Math.max(n,p.moq);if(q>p.st)return toast("Only "+p.st+" in stock");
 if(q<=0||(n<0&&q<p.moq)){delete S.cart[id];delete S.offer[id]}else S.cart[id]=q;save();draw()}
function totals(){let sub=0;for(const id in S.cart){const p=S.prods.find(x=>x.id==id);sub+=pr(p)*S.cart[id]}
 const ship=sub==0?0:sub>=3000?0:250;return{sub,ship,vat:sub*VAT/(1+VAT),total:sub+ship}}
const PRODUCT_MATCHES=[
 [/iphone|tecno|infinix|phone|case/i,"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=85"],
 [/laptop|elitebook|computer/i,"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=85"],
 [/earbud|headphone|sound/i,"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85"],
 [/tv|television/i,"https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=700&q=85"],
 [/shoe|sneaker/i,"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85"],
 [/bag|handbag/i,"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=85"],
 [/dress|shirt|t-shirt|cotton/i,"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85"],
 [/sofa|bedding|furniture/i,"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=85"],
 [/rice|oil|grocery|food/i,"https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=85"],
 [/perfume|butter|beauty|shea/i,"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85"],
 [/bike|bicycle/i,"https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=700&q=85"]
];
const CATEGORY_PHOTOS={Phones:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=85",Electronics:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85",Fashion:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",Home:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=85",Beauty:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85",Groceries:"https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=85",Sports:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=700&q=85"};
function productImage(p){const u=String(p.image||"").trim();if(/^https?:\/\//i.test(u))return u;const m=PRODUCT_MATCHES.find(([r])=>r.test(p.n||""));return m?m[1]:(CATEGORY_PHOTOS[p.c]||"")}
const HERO_SLIDES=[
 {k:"MORIMALL MARKETPLACE",title:"Everything you need,\nin one marketplace.",desc:"Shop trusted stores, discover pre-loved finds and get more value for your money.",cta:"Explore products",image:"https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1500&q=85"},
 {k:"DEALS THAT DELIVER",title:"Big finds.\nBetter prices.",desc:"Discover deals across electronics, fashion, home essentials and more.",cta:"Shop deals",image:"https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1500&q=85"},
 {k:"SELL ON MORIMALL",title:"Your products.\nMore customers.",desc:"Create your shop, list products and reach buyers across Kenya.",cta:"Start selling",image:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1500&q=85"}
];
function changeHero(d){S.heroIndex=(S.heroIndex+d+HERO_SLIDES.length)%HERO_SLIDES.length;draw()}
function scrollRail(id,d){const e=document.getElementById(id);if(e)e.scrollBy({left:d*e.clientWidth*.82,behavior:"smooth"})}
function toggleFavourite(id){if(!S.user){toast("Sign in to save favourites");return go("account")}S.favourites=S.favourites||[];S.favourites.includes(id)?S.favourites=S.favourites.filter(x=>x!==id):S.favourites.push(id);save();draw()}
function openProduct(id){S.productId=id;S.v="product";draw();scrollTo(0,0)}
function card(p){const off=p.o>p.p?Math.round((1-p.p/p.o)*100):0,img=productImage(p),fav=(S.favourites||[]).includes(p.id);
 return `<article class="card"><div class="product-image-wrap"><button class="product-image-button" onclick="openProduct(${p.id})" aria-label="View ${esc(p.n)}"><div class="img">${img?`<img src="${esc(img)}" alt="${esc(p.n)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">`:""}<span class="product-emoji" ${img?'style="display:none"':""}>${p.e||"📦"}</span>${off>0&&p.t!="C2C"?`<span class="tag">-${off}%</span>`:""}<span class="tag tt ${p.t}">${p.t}</span></div></button><button class="wish ${fav?"is-favourite":""}" title="Save item" onclick="toggleFavourite(${p.id})">${fav?"♥":"♡"}</button></div><div class="product-meta">${esc(p.c)} · ${p.t=="C2C"?"Pre-owned":"Morimall marketplace"}</div><button class="product-title-link" onclick="openProduct(${p.id})">${esc(p.n)}</button><div class="pr">${K(p.p)}${p.t=="B2B"?"<span class='mut'> /unit</span>":p.t=="C2C"||p.o<=p.p?"":`<span class="old">${K(p.o)}</span>`}</div><div class="rating">${p.r?`★ ${p.r}`:"New listing"} <span>· ${p.st} available</span></div><button class="btn" ${p.st<1?"disabled":""} onclick="add(${p.id})">${p.moq>1?"Add "+p.moq+" (MOQ)":"Add to cart"}</button><div class="card-actions"><button class="btn o" onclick="share(${p.id})">Share</button>${p.t=="C2C"&&p.st>0?`<button class="btn o" onclick="offer(${p.id})">Make offer</button>`:""}</div></article>`}

function offer(id){const p=S.prods.find(x=>x.id==id),m=document.createElement("div");m.className="modal";
 m.innerHTML=`<div><h3>Make an offer</h3><p>${esc(p.n)} – listed at ${K(p.p)}</p><input id="ov" type="number" value="${Math.round(p.p*.9)}"><button class="btn g" style="width:100%" id="go">Send offer</button><button class="btn o" style="width:100%;margin-top:6px" id="cx">Cancel</button></div>`;
 document.body.appendChild(m);m.querySelector("#cx").onclick=()=>m.remove();
 m.querySelector("#go").onclick=()=>{const v=+m.querySelector("#ov").value;m.remove();
  if(v>=p.p*.85){S.offer[id]=v;S.cart[id]=1;save();toast("Seller accepted "+K(v)+" – added to cart");draw()}else toast("Seller declined – try closer to "+K(p.p))}}
function productSection(title,items,sub=""){if(!items.length)return "";const rid="rail-"+String(title).toLowerCase().replace(/[^a-z0-9]+/g,"-");return `<section class="product-section"><div class="section-heading"><div><h2>${title}</h2>${sub?`<p>${sub}</p>`:""}</div><div class="section-controls"><button class="rail-arrow" aria-label="Scroll products left" onclick="scrollRail('${rid}',-1)">‹</button><button class="rail-arrow" aria-label="Scroll products right" onclick="scrollRail('${rid}',1)">›</button><button class="see-all" onclick="S.cat='All';S.q='';draw()">See all <span>›</span></button></div></div><div class="product-rail" id="${rid}">${items.map(card).join("")}</div></section>`}
function shop(){const q=S.q.toLowerCase(),biz=S.mode=="biz";
 const eligible=S.prods.filter(p=>(p.t!="B2B"||biz)&&(S.t=="All"||p.t==S.t));
 if(S.t=="B2B"&&!biz)return `<div class="box">Wholesale listings are for business buyers. <button class="btn" onclick="mode()">Switch to Business account</button></div>`;
 const filtered=eligible.filter(p=>(S.cat=="All"||p.c==S.cat)&&(!q||(p.n+p.c+p.s).toLowerCase().includes(q)));
 const categoryLinks=CATS.slice(1).map(c=>`<button onclick="S.cat='${c}';draw()" class="category-link ${S.cat==c?"active":""}"><span>${({Phones:"📱",Electronics:"🎧",Fashion:"👕",Home:"🏠",Beauty:"✨",Groceries:"🛒",Sports:"⚽"})[c]}</span>${c}<b>›</b></button>`).join("");
 const typeLinks=[["All","All listings"],["B2C","Retail shops"],["C2C","Pre-owned & individuals"],["B2B","Wholesale"]].map(([k,l])=>`<button class="type-chip ${S.t==k?"on":""}" onclick="S.t='${k}';draw()">${l}</button>`).join("");
 if(q||S.cat!="All")return `<div class="browse-toolbar"><div><h1>${q?"Search results":"Shop "+S.cat}</h1><p>${filtered.length} products available</p></div><div class="type-filters">${typeLinks}</div></div><div class="grid">${filtered.map(card).join("")||"<p class='empty-state'>No products found. Try another search or category.</p>"}</div>`;
 const deals=filtered.filter(p=>p.o>p.p&&p.t!="C2C").sort((a,b)=>(1-a.p/a.o)-(1-b.p/b.o)).reverse();
 const popular=filtered.filter(p=>p.t!="B2B");
 const used=filtered.filter(p=>p.t=="C2C");
 const wholesale=eligible.filter(p=>p.t=="B2B");
 return `<div class="home-layout"><aside class="category-panel"><div class="panel-title">SHOP BY CATEGORY</div>${categoryLinks}<div class="sidebar-promo"><strong>Morimall marketplace</strong><span>Buy, sell and trade with confidence.</span><button onclick="go('sell')">Start selling ›</button></div></aside><div class="home-main"><div class="hero-grid"><section class="hero hero-carousel" style="background-image:linear-gradient(90deg,rgba(22,25,31,.83) 0%,rgba(22,25,31,.52) 52%,rgba(22,25,31,.08) 100%),url('${HERO_SLIDES[S.heroIndex%HERO_SLIDES.length].image}')"><div class="hero-copy"><span class="hero-kicker">${biz?"MORIMALL FOR BUSINESS":HERO_SLIDES[S.heroIndex%HERO_SLIDES.length].k}</span><h1>${biz?"Wholesale made simple.":HERO_SLIDES[S.heroIndex%HERO_SLIDES.length].title}</h1><p>${biz?"Discover bulk prices, minimum order quantities and business sellers.":HERO_SLIDES[S.heroIndex%HERO_SLIDES.length].desc}</p><button class="hero-cta" onclick="${S.heroIndex==2?"go('sell')":"S.cat='All';S.t='All';draw()"}">${biz?"Explore wholesale":HERO_SLIDES[S.heroIndex%HERO_SLIDES.length].cta} <span>→</span></button></div><div class="hero-carousel-controls"><button onclick="changeHero(-1)" aria-label="Previous banner">‹</button><div>${HERO_SLIDES.map((x,i)=>`<button class="hero-dot ${i==S.heroIndex?"active":""}" onclick="S.heroIndex=${i};draw()" aria-label="Show banner ${i+1}"></button>`).join("")}</div><button onclick="changeHero(1)" aria-label="Next banner">›</button></div></section><div class="promo-stack"><div class="promo-card promo-dark"><span>SELL ON MORIMALL</span><strong>Turn your products<br>into sales.</strong><button onclick="go('sell')">Open a shop →</button></div><div class="promo-card promo-light"><span>SMART SHOPPING</span><strong>Deals worth<br>discovering.</strong><button onclick="S.cat='All';draw()">Shop now →</button></div></div></div><div class="benefit-strip"><div><b>🚚</b><span><strong>Convenient shopping</strong><small>Shop from anywhere in Kenya</small></span></div><div><b>🔒</b><span><strong>Escrow-protected</strong><small>Added confidence at checkout</small></span></div><div><b>🏪</b><span><strong>Retail & wholesale</strong><small>One marketplace, more choice</small></span></div></div><div class="type-filter-bar">${typeLinks}</div></div></div>
 ${productSection("Flash deals",deals.slice(0,10),"Great finds at prices worth a second look")}
 ${productSection("Popular on Morimall",popular.slice(0,10),"Explore products shoppers are checking out")}
 ${productSection("Pre-loved finds",used,"Discover items listed by individuals")}
 ${biz?productSection("Wholesale marketplace",wholesale,"Bulk products for business buyers"):""}
 <section class="category-feature"><div><span>FIND YOUR NEXT FAVOURITE</span><h2>Shop by category</h2></div><div class="category-pills">${categoryLinks}</div></section>`}

function productDetail(){const p=S.prods.find(x=>x.id==S.productId);if(!p)return `<div class="box">This product is no longer available. <button class="btn" onclick="go('shop')">Back to shopping</button></div>`;const img=productImage(p),off=p.o>p.p?Math.round((1-p.p/p.o)*100):0;return `<div class="detail-breadcrumb"><button onclick="go('shop')">Home</button> / <button onclick="S.cat='${esc(p.c)}';go('shop')">${esc(p.c)}</button> / ${esc(p.n)}</div><section class="product-detail"><div class="detail-image">${img?`<img src="${esc(img)}" alt="${esc(p.n)}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">`:""}<span class="detail-emoji" ${img?'style="display:none"':""}>${p.e||"📦"}</span>${off?`<span class="tag">-${off}% OFF</span>`:""}</div><div class="detail-info"><div class="product-meta">${esc(p.c)} · ${p.t=="C2C"?"PRE-OWNED":"MORIMALL MARKETPLACE"} · ${p.t}</div><h1>${esc(p.n)}</h1><div class="detail-rating">${p.r?`★ ${p.r} / 5`:"New listing"} <span>· ${p.st} available</span></div><div class="detail-price">${K(p.p)} ${p.t=="B2B"?"<small>per unit</small>":""}${p.o>p.p?`<del>${K(p.o)}</del>`:""}</div><p class="detail-description">${p.cond?`Condition: ${esc(p.cond)}. `:""}${p.t=="B2B"?`Minimum order: ${p.moq} units.`:"Available from "+esc(p.s)+"."}</p><div class="detail-stock">${p.st>0?"In stock":"Out of stock"}${p.moq>1?` · Minimum order ${p.moq}`:""}</div><div class="detail-actions"><button class="btn g" ${p.st<1?"disabled":""} onclick="add(${p.id})">Add to cart</button><button class="btn o" onclick="share(${p.id})">Share product</button>${p.t=="C2C"&&p.st>0?`<button class="btn o" onclick="offer(${p.id})">Make an offer</button>`:""}</div><div class="seller-panel"><strong>Sold by</strong><span>${esc(p.s)}</span><small>Shop securely on Morimall</small></div></div></section><section class="product-section"><div class="section-heading"><h2>You may also like</h2></div><div class="product-rail">${S.prods.filter(x=>x.id!=p.id&&x.c==p.c&&(x.t!="B2B"||S.mode=="biz")).slice(0,8).map(card).join("")}</div></section>`}

function cart(){const ids=Object.keys(S.cart);if(!ids.length)return `<div class="box">Your cart is empty. <button class="btn" onclick="go('shop')">Start shopping</button></div>`;
 const t=totals();return `<div class="two"><div class="box"><h3>Cart</h3>${ids.map(id=>{const p=S.prods.find(x=>x.id==id),u=p.moq>1?p.moq:1;return `<div class="row"><span>${p.e} ${esc(p.n)}<br><span class="mut">${K(pr(p))} each${S.offer[id]?" (your offer)":""}${p.moq>1?" · MOQ "+p.moq:""}</span></span><span><button class="btn o" onclick="add(${id},-${u})">−</button> ${S.cart[id]} <button class="btn o" onclick="add(${id},${u})">+</button></span></div>`}).join("")}</div>
 <div class="box"><h3>Order summary</h3><div class="row"><span>Subtotal</span><span>${K(t.sub)}</span></div><div class="row"><span>Delivery</span><span>${t.ship?K(t.ship):"FREE"}</span></div>
 <div class="row mut"><span>VAT 16% (included)</span><span>${K(t.vat)}</span></div><div class="row"><b>Total</b><b>${K(t.total)}</b></div>
 ${S.mode=="biz"?`<label class="mut">KRA PIN (for VAT invoice)</label><input id="kp" placeholder="A123456789B">`:""}
 <label class="mut">Pay with</label><select id="pm"><option value="wallet">Morimall Wallet (${K(S.wallet)})</option><option value="mpesa">M-Pesa</option><option value="card">Debit/Credit card</option></select>
 <p class="mut">🔒 Funds are held in escrow until you confirm delivery.</p>
 <button class="btn g" style="width:100%" onclick="checkout()">Place order</button><p class="mut">Demo only – no real money moves.</p></div></div>`}
function checkout(){if(!S.user){toast("Please log in to check out");return go("account")}
 const t=totals(),method=pm.value;
 if(S.mode=="biz"&&!/^[AP]\d{9}[A-Z]$/i.test(kp.value.trim()))return toast("Enter a valid KRA PIN, e.g. A123456789B");
 const kra=S.mode=="biz"?kp.value.trim().toUpperCase():"";
 pay(t.total,method,via=>{const items=Object.keys(S.cart).map(id=>{const p=S.prods.find(x=>x.id==id),q=S.cart[id];p.st-=q;return{n:p.n,e:p.e,q,p:pr(p),s:p.s,t:p.t,mine:p.mine}});
  S.orders.unshift({id:"MM"+Math.floor(100000+Math.random()*900000),items,total:t.total,via,kra,u:S.user,d:new Date().toLocaleString("en-KE"),st:"Held in escrow"});
  S.tx.unshift({d:new Date().toLocaleString("en-KE"),t:"Order payment ("+via+")",a:-t.total});S.cart={};S.offer={};save();toast("Order placed ✅");go("orders")})}
function deliver(id){const o=S.orders.find(x=>x.id==id);o.items.forEach(i=>{if(i.mine)S.earn+=i.p*i.q*(1-FEE[i.t])});o.st="Delivered – funds released";save();toast("Delivery confirmed, seller paid");draw()}
function sim(id){const p=S.prods.find(x=>x.id==id);if(p.st<p.moq)return toast("Out of stock");const q=p.moq;p.st-=q;const net=p.p*q*(1-FEE[p.t]);S.earn+=net;save();toast("Sold "+q+"! +"+K(net)+" after commission");draw()}
const now=()=>new Date().toLocaleString("en-KE");
const blank=()=>({wallet:5000,orders:[],tx:[],earn:0,paid:0,tickets:[]});
const USER_KEYS=["wallet","orders","tx","earn","paid","tickets"];
const newU=(n,p)=>({name:n,phone:p||"",joined:new Date().toLocaleDateString("en-KE"),d:blank()});
let _t,lock={n:0,until:0};
function persist(){if(S.user&&S.users[S.user]){const d={};USER_KEYS.forEach(k=>d[k]=S[k]);S.users[S.user].d=d;if(window.MM_CLOUD){clearTimeout(_t);_t=setTimeout(()=>MM_CLOUD.saveUser(S.user,S.users[S.user]),1500)}}}
const H=async s=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,"0")).join("");
function modal(h){const m=document.createElement("div");m.className="modal";m.innerHTML="<div>"+h+"</div>";document.body.appendChild(m);const c=m.querySelector("#cx");if(c)c.onclick=()=>m.remove();return m}
const LEGAL={terms:["Terms of Use","Morimall connects buyers and sellers. Sellers must list only legal, genuine items with accurate descriptions; counterfeit, stolen or prohibited goods are banned and accounts may be suspended. Payments are held in escrow until delivery is confirmed. Disputes go to Morimall support first. Governed by the laws of Kenya."],
 privacy:["Privacy Policy","We collect your name, email, phone, address and order history only to run your account and orders. We never sell your data. You can view, correct or delete it in Account (Kenya Data Protection Act, 2019). Passwords are never stored in plain text. Contact: privacy@morimall.example"],
 refunds:["Refund & Returns Policy","Cancel before delivery for a full refund to your wallet. After delivery you can request a return within 7 days if an item is damaged, wrong or not as described. Approved refunds go to your Morimall Wallet. Perishables are not returnable."]};
function legal(k){modal(`<h3>${LEGAL[k][0]}</h3><p>${LEGAL[k][1]}</p><button class="btn" style="width:100%" id="cx">Close</button>`)}
function share(id){const p=S.prods.find(x=>x.id==id),u=encodeURIComponent(location.href.split("#")[0]),t=encodeURIComponent("Check out "+p.n+" for "+K(p.p)+" on Morimall");
 modal(`<h3>Share</h3><p>${esc(p.n)}</p><a class="btn g" target="_blank" rel="noopener" href="https://wa.me/?text=${t}%20${u}">WhatsApp</a> <a class="btn" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${u}">Facebook</a> <a class="btn" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=${t}&url=${u}">X</a><br><br><button class="btn o" style="width:100%" id="cx">Close</button>`)}
async function authGo(kind){const e=(ae.value||"").trim().toLowerCase(),pw=ap.value;
 if(!/^\S+@\S+\.\S+$/.test(e))return toast("Enter a valid email");
 if(Date.now()<lock.until)return toast("Too many attempts – wait a minute");
 if(kind=="up"){const nm=an.value.trim(),ph=aph.value.trim();
  if(!nm||pw.length<8||!/\d/.test(pw)||!/[A-Za-z]/.test(pw))return toast("Name required; password needs 8+ characters with letters and a number");
  if(!ac.checked)return toast("Please accept the Terms and Privacy Policy");
  if(window.MM_CLOUD){try{await MM_CLOUD.signUp(e,pw,nm)}catch(x){return toast(x.message)}}
  else{if(S.users[e])return toast("An account with this email already exists");S.users[e]={...newU(nm,ph),h:await H(pw)}}
  S.users[e]=S.users[e]||newU(nm,ph)}
 else{if(window.MM_CLOUD){try{const r=await MM_CLOUD.signIn(e,pw);if(r)S.users[e]=r}catch(x){return toast(x.message)}}
  else{const u=S.users[e];if(!u||u.h!=await H(pw)){if(++lock.n>=5){lock.until=Date.now()+60000;lock.n=0}return toast("Wrong email or password")}}
  S.users[e]=S.users[e]||newU(e.split("@")[0])}
 login(e)}
async function googleIn(){try{const e=(await MM_CLOUD.google()).toLowerCase();S.users[e]=window._gp||S.users[e]||newU(e.split("@")[0]);login(e)}catch(x){toast(x.message)}}
function login(e){S.user=e;Object.assign(S,blank(),S.users[e].d);toast("Welcome, "+S.users[e].name);go("shop")}
function logout(){save();if(window.MM_CLOUD)MM_CLOUD.signOut();S.user=null;Object.assign(S,blank());S.cart={};S.offer={};save();go("shop")}
function saveProfile(){const u=S.users[S.user];u.phone=up.value.trim();u.addr=ua.value.trim();save();toast("Profile saved")}
function delAcct(){const m=modal(`<h3>Delete account?</h3><p>This permanently deletes your profile, wallet, orders and tickets.</p><button class="btn" style="width:100%" id="go">Yes, delete everything</button><button class="btn o" style="width:100%;margin-top:6px" id="cx">Cancel</button>`);
 m.querySelector("#go").onclick=()=>{m.remove();if(window.MM_CLOUD)MM_CLOUD.deleteUser();delete S.users[S.user];S.user=null;Object.assign(S,blank());S.cart={};save();toast("Account deleted");go("shop")}}
function ticket(){const s=ts.value.trim(),m=tm.value.trim();if(!s||!m)return toast("Add a subject and details");S.tickets.unshift({id:Date.now()%100000,s,m,st:"Open",d:new Date().toLocaleDateString("en-KE")});save();toast("Ticket submitted – we reply within 24 hours");draw()}
function closeT(id){S.tickets.find(t=>t.id==id).st="Closed";save();draw()}
function account(){if(!S.user)return `<div class="box" style="max-width:420px;margin:auto"><h3>Log in</h3><input id="ae" type="email" placeholder="Email" autocomplete="email"><input id="ap" type="password" placeholder="Password" autocomplete="current-password"><button class="btn" style="width:100%" onclick="authGo('in')">Log in</button>${window.MM_CLOUD?`<button class="btn o" style="width:100%;margin-top:6px" onclick="googleIn()">Continue with Google</button>`:""}
 <h3 style="margin-top:16px">New here? Create an account</h3><input id="an" placeholder="Full name"><input id="aph" placeholder="Phone (07XX XXX XXX)" inputmode="tel"><p class="mut">Use the email and a password (8+ characters, letters and a number) above.</p>
 <label class="mut"><input id="ac" type="checkbox" style="width:auto"> I agree to the <a href="#" onclick="legal('terms');return false">Terms</a> and <a href="#" onclick="legal('privacy');return false">Privacy Policy</a></label><button class="btn g" style="width:100%;margin-top:6px" onclick="authGo('up')">Create account</button></div>`;
 const u=S.users[S.user],spent=S.orders.reduce((a,o)=>a+o.total,0),tier=spent>=100000?"🥇 Gold":spent>=30000?"🥈 Silver":"🥉 Bronze";
 return `<div class="two"><div class="box"><h3>My profile</h3><div class="row"><span><b>${esc(u.name)}</b><br><span class="mut">${esc(S.user)} · member since ${u.joined}</span></span><button class="btn o" onclick="logout()">Log out</button></div>
 <label class="mut">Phone</label><input id="up" value="${esc(u.phone||"")}"><label class="mut">Delivery address</label><input id="ua" value="${esc(u.addr||"")}"><button class="btn g" onclick="saveProfile()">Save profile</button>
 <div class="row"><span>Orders</span><b>${S.orders.length}</b></div><div class="row"><span>Total spent</span><b>${K(spent)}</b></div><div class="row"><span>Loyalty tier</span><b>${tier}</b></div>
 <button class="btn o" style="width:100%;margin-top:10px" onclick="delAcct()">Delete my account &amp; data</button></div>
 <div class="box"><h3>Support tickets</h3><input id="ts" placeholder="Subject"><input id="tm" placeholder="Describe your issue"><button class="btn" onclick="ticket()">Submit ticket</button>
 ${S.tickets.map(t=>`<div class="row"><span>#${t.id} ${esc(t.s)}<br><span class="mut">${esc(t.m)} · ${t.d}</span></span><span class="${t.st=="Open"?"neg":"pos"}">${t.st}${t.st=="Open"?` <button class="btn o" onclick="closeT(${t.id})">Close</button>`:""}</span></div>`).join("")}</div></div>`}
function credit(e,a,why){if(e==S.user){S.wallet+=a;S.tx.unshift({d:now(),t:why,a})}else if(S.users[e])S.users[e].d.wallet+=a}
const back=o=>o.items.forEach(i=>{const p=S.prods.find(x=>x.n==i.n&&x.s==i.s);if(p)p.st+=i.q});
function cancelO(id){const o=S.orders.find(x=>x.id==id);back(o);credit(S.user,o.total,"Refund – order #"+id);o.st="Cancelled – refunded";save();toast("Refunded to your wallet");draw()}
function returnO(id){const m=modal(`<h3>Request a return</h3><select id="rr"><option>Item damaged</option><option>Wrong item</option><option>Not as described</option></select><input id="rn" placeholder="Details (optional)"><button class="btn g" style="width:100%" id="go">Submit request</button><button class="btn o" style="width:100%;margin-top:6px" id="cx">Cancel</button>`);
 m.querySelector("#go").onclick=()=>{const o=S.orders.find(x=>x.id==id),n=m.querySelector("#rn").value.trim();S.refunds.unshift({id:"RF"+Date.now()%100000,o:id,u:S.user,amt:o.total,why:m.querySelector("#rr").value+(n?" – "+esc(n):""),st:"Pending",d:now()});m.remove();save();toast("Return request sent");draw()}}
function reviewR(id,ok){const r=S.refunds.find(x=>x.id==id);r.st=ok?"Approved":"Rejected";if(ok){credit(r.u,r.amt,"Refund – return "+r.id);const o=S.orders.find(x=>x.id==r.o);if(o){back(o);o.items.forEach(i=>{if(i.mine)S.earn=Math.max(0,S.earn-i.p*i.q*(1-FEE[i.t]))});o.st="Returned – refunded"}}save();toast("Return "+r.st.toLowerCase());draw()}
function orders(){return S.orders.length?S.orders.map(o=>{const rf=S.refunds.filter(r=>r.o==o.id);return `<div class="box"><div class="row"><b>#${o.id}</b><span class="pos">${o.st}</span></div>${o.items.map(i=>`<div class="row"><span>${i.e} ${esc(i.n)} × ${i.q} <span class="tag tt ${i.t}" style="position:static">${i.t}</span><br><span class="mut">Sold by ${esc(i.s)}</span></span><span>${K(i.p*i.q)}</span></div>`).join("")}
 <div class="row"><span class="mut">${o.d} · Paid via ${o.via}${o.kra?" · Invoice to KRA PIN "+esc(o.kra):""}</span><b>${K(o.total)}</b></div>
 ${rf.map(r=>`<div class="mut">Return ${r.id}: <b>${r.st}</b> – ${r.why}</div>`).join("")}
 ${o.st=="Held in escrow"?`<button class="btn g" onclick="deliver('${o.id}')">Confirm delivery</button> <button class="btn o" onclick="cancelO('${o.id}')">Cancel &amp; refund</button>`:""}
 ${o.st.startsWith("Delivered")&&!rf.length?`<button class="btn o" onclick="returnO('${o.id}')">Request return</button>`:""}</div>`}).join(""):`<div class="box">No orders yet.</div>`}
function sell(){const mine=S.prods.filter(p=>p.mine),rq=S.refunds.filter(r=>r.st=="Pending");return `<div class="two"><div class="box"><h3>Seller dashboard</h3>
 <div class="row"><span>Available earnings</span><b class="pos">${K(S.earn)}</b></div><div class="row"><span>Paid out so far</span><span>${K(S.paid)}</span></div>
 <p class="mut">Commission: Individual (C2C) 5% · Retail (B2C) 8% · Wholesale (B2B) 3%. Earnings are released when the buyer confirms delivery.</p>
 <button class="btn g" style="width:100%" onclick="payout()" ${S.earn<100?"disabled":""}>Withdraw to M-Pesa</button>
 <h3 style="margin-top:14px">List a product</h3>
 <select id="pt"><option value="C2C">👤 Individual → individuals (C2C)</option><option value="B2C">🏪 Business → customers (B2C)</option><option value="B2B">🏢 Business → businesses (B2B)</option></select>
 <input id="pb" placeholder="Business name (B2C / B2B)"><input id="pn" placeholder="Product name"><select id="pc">${CATS.slice(1).map(c=>`<option>${c}</option>`).join("")}</select>
 <input id="pp" type="number" min="1" placeholder="Price per unit (KSh)"><input id="ps" type="number" min="1" placeholder="Stock quantity"><input id="pq" type="number" min="2" placeholder="Min. order quantity (B2B only)">
 <select id="pd"><option>Like new</option><option>Good condition</option><option>Fair</option></select><label class="mut" for="pi">Product photo URL (optional)</label><input id="pi" type="url" placeholder="https://… image link"><input id="pe" placeholder="Fallback emoji (e.g. 🎒)" maxlength="4">
 <label class="mut"><input id="pg" type="checkbox" style="width:auto"> I confirm this item is legal, genuine and accurately described</label><button class="btn" style="width:100%;margin-top:6px" onclick="list()">Publish listing</button></div>
 <div><div class="box"><h3>Inventory</h3>${mine.length?mine.map(p=>`<div class="row"><span>${p.e} ${esc(p.n)} <span class="tag tt ${p.t}" style="position:static">${p.t}</span><br><span class="mut">${K(p.p)} · ${p.st} in stock</span>${p.st<=3?` <span class="neg">Low stock</span>`:""}</span><span><button class="btn o" onclick="restock(${p.id})">+10</button> <button class="btn o" onclick="sim(${p.id})">Sell</button> <button class="btn o" onclick="delP(${p.id})">🗑</button></span></div>`).join(""):"<p class='mut'>You haven’t listed anything yet.</p>"}</div>
 <div class="box"><h3>Return requests</h3>${rq.length?rq.map(r=>`<div class="row"><span>${r.id} · ${K(r.amt)}<br><span class="mut">${r.why}</span></span><span><button class="btn g" onclick="reviewR('${r.id}',true)">Approve</button> <button class="btn o" onclick="reviewR('${r.id}',false)">Reject</button></span></div>`).join(""):"<p class='mut'>No pending requests.</p>"}</div></div></div>`}
function list(){const n=pn.value.trim(),p=+pp.value,st=+ps.value,t=pt.value,moq=t=="B2B"?Math.max(+pq.value||10,2):1;
 if(!pg.checked)return toast("Please confirm the item is legal, genuine and accurately described");
 if(!n||!(p>0)||!(st>0)||st<moq)return toast("Fill in name, price and stock (stock must cover the MOQ)");
 const x={id:Date.now(),n,c:pc.value,p,o:p,e:pe.value||"📦",s:t=="C2C"?"You (individual)":(pb.value.trim()||"My Shop"),r:0,st,t,moq,cond:t=="C2C"?pd.value:"",image:(pi.value||"").trim(),se:S.user};
 S.prods.unshift(x);if(window.MM_CLOUD)MM_CLOUD.saveProduct(x);save();toast("Listing published");draw()}
function restock(id){const p=S.prods.find(x=>x.id==id);p.st+=10;if(window.MM_CLOUD)MM_CLOUD.saveProduct(p);save();draw()}
function delP(id){S.prods=S.prods.filter(x=>x.id!=id);if(window.MM_CLOUD)MM_CLOUD.deleteProduct(id);save();draw()}
function banner(){if(S.consent||document.getElementById("cbn"))return;const b=document.createElement("div");b.id="cbn";b.className="cbn";
 b.innerHTML=`<span>Morimall uses your browser’s storage for your cart, login and preferences. <a href="#" onclick="legal('privacy');return false">Privacy Policy</a></span><button class="btn" id="ok">OK</button>`;document.body.appendChild(b);b.querySelector("#ok").onclick=()=>{S.consent=true;save();b.remove()}}
function draw(){if(!S.user&&["wallet","orders","sell"].includes(S.v)){S.v="account";toast("Please log in first")}
 S.prods.forEach(p=>p.mine=!!S.user&&p.se==S.user);const n=Object.values(S.cart).reduce((a,b)=>a+b,0);
 wb.textContent=S.user?"Wallet · "+K(S.wallet):"Wallet";cb.textContent="Cart ("+n+")";ab.textContent=S.user?"Hi, "+S.users[S.user].name.split(" ")[0]:"Sign in";mb.textContent=S.mode=="biz"?"Business":"Individual";tb.textContent=isDark()?"☀ Light":"☾ Dark";
 const T=[["All","All listings"],["B2C","Retail"],["C2C","Individuals"],["B2B","Wholesale"]];
 const nav=S.v=="shop"?`<div class="market-nav"><div class="market-nav-inner"><button onclick="S.cat='All';S.t='All';draw()" class="market-nav-home">☰ &nbsp; All categories</button>${T.map(([k,l])=>`<button class="${S.t==k?"selected":""}" onclick="S.t='${k}';draw()">${l}</button>`).join("")}<button onclick="go('sell')">Sell on Morimall</button></div></div>`:"";
 app.innerHTML=nav+`<div class="page-content ${S.v=="shop"?"shop-page":"inner-page"}">${({shop,cart,wallet,orders,sell,account,product:productDetail})[S.v]()}</div>`;save();banner()}

if(window.MM_CLOUD)MM_CLOUD.loadProducts().then(L=>{L.forEach(c=>{const i=S.prods.findIndex(p=>String(p.id)===String(c.id));if(i>=0)S.prods[i]=Object.assign({},S.prods[i],c);else S.prods.unshift(c)});draw()}).catch(()=>{});
draw();
setInterval(()=>{if(S.v==="shop"&&!S.q&&S.cat==="All"&&S.t==="All"&&S.mode!=="biz"){S.heroIndex=(S.heroIndex+1)%HERO_SLIDES.length;draw()}},6500);
