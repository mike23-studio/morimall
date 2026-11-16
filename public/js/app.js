
const K=n=>"KSh "+Math.round(n).toLocaleString("en-KE");
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const CATS=["All","Phones","Electronics","Fashion","Home","Beauty","Groceries","Sports"];
const D=[["Tecno Spark 20 128GB","Phones",15499,18999,"📱","Mobile Hub KE",4.5],["Infinix Hot 40i","Phones",13999,16500,"📱","Mobile Hub KE",4.3],["Wireless Earbuds Pro","Electronics",1899,3200,"🎧","SoundCity",4.2],["32″ Smart LED TV","Electronics",17999,22500,"📺","TV Zone",4.6],["Power Bank 20,000mAh","Electronics",2299,3000,"🔋","SoundCity",4.4],["Men’s Running Shoes","Fashion",2499,3999,"👟","Urban Steps",4.1],["Ladies Handbag","Fashion",1799,2600,"👜","Mama Mia Styles",4.3],["Kitenge Dress","Fashion",2200,3000,"👗","Mama Mia Styles",4.7],["Non-stick Cookware Set","Home",4999,6800,"🍳","HomeEase",4.4],["Electric Kettle 1.8L","Home",1450,2100,"🫖","HomeEase",4.2],["Bedding Set (Queen)","Home",3200,4500,"🛏️","HomeEase",4.5],["Shea Body Butter 500g","Beauty",850,1200,"🧴","Glow Naturals",4.6],["Perfume 100ml","Beauty",1999,2800,"🌸","Glow Naturals",4.0],["Pishori Rice 5kg","Groceries",1050,1250,"🍚","FreshBasket",4.5],["Cooking Oil 3L","Groceries",880,1050,"🫙","FreshBasket",4.3],["Football (Size 5)","Sports",1200,1800,"⚽","ProSport",4.4],["Yoga Mat","Sports",1100,1600,"🧘","ProSport",4.2]];
const X=[["Used iPhone 11 64GB","Phones",28500,35000,"📱","Brian O. (Nairobi)",4.6,"C2C",1,1,"Good condition"],["HP EliteBook 840 (Refurb)","Electronics",32000,40000,"💻","Faith W. (Thika)",4.5,"C2C",1,1,"Like new"],["3-Seater Sofa","Home",18000,25000,"🛋️","Kevin M. (Nakuru)",4.2,"C2C",1,1,"Fair"],["Mountain Bike 26″","Sports",9500,14000,"🚲","Amina S. (Mombasa)",4.7,"C2C",1,1,"Good condition"],["Pishori Rice 50kg Sack","Groceries",5900,6500,"🌾","Mwea Millers Ltd",4.6,"B2B",10,500],["Plain Cotton T-shirts","Fashion",320,500,"👕","Eastleigh Garments",4.3,"B2B",50,2000],["Phone Cases Assorted","Phones",95,180,"📲","Gikomba Accessories",4.1,"B2B",100,5000],["Cooking Oil 20L Jerrycan","Groceries",5400,6000,"🛢️","Bidco Distributors",4.4,"B2B",5,300],["Shea Butter 25kg Bulk","Beauty",9800,12000,"🧴","Glow Naturals",4.5,"B2B",4,100]];
let S={v:"shop",cat:"All",q:"",wallet:5000,cart:{},orders:[],tx:[],earn:0,paid:0,mode:"ind",t:"All",offer:{},users:{},user:null,tickets:[],refunds:[],consent:false,
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
function card(p){const off=Math.round((1-p.p/p.o)*100);
 return `<div class="card"><div class="img">${p.e}${off>0&&p.t!="C2C"?`<span class="tag">-${off}%</span>`:""}<span class="tag tt ${p.t}">${p.t}</span></div>
<div class="nm">${esc(p.n)}</div><div class="pr">${K(p.p)}${p.t=="B2B"?"<span class='mut'> /unit</span>":p.t=="C2C"||p.o<=p.p?"":`<span class="old">${K(p.o)}</span>`}</div>
<div class="mut">${p.t=="C2C"?"👤":"🏪"} ${esc(p.s)} · ${p.r?"⭐ "+p.r:"New"} · ${p.st} left${p.moq>1?" · MOQ "+p.moq:""}${p.cond?" · "+esc(p.cond):""}</div>
<button class="btn" ${p.st<1?"disabled":""} onclick="add(${p.id})">${p.moq>1?"Add "+p.moq+" (MOQ)":"Add to cart"}</button>
<button class="btn o" onclick="share(${p.id})">🔗 Share</button>
${p.t=="C2C"&&p.st>0?`<button class="btn o" onclick="offer(${p.id})">Make an offer</button>`:""}</div>`}
function offer(id){const p=S.prods.find(x=>x.id==id),m=document.createElement("div");m.className="modal";
 m.innerHTML=`<div><h3>Make an offer</h3><p>${esc(p.n)} – listed at ${K(p.p)}</p><input id="ov" type="number" value="${Math.round(p.p*.9)}"><button class="btn g" style="width:100%" id="go">Send offer</button><button class="btn o" style="width:100%;margin-top:6px" id="cx">Cancel</button></div>`;
 document.body.appendChild(m);m.querySelector("#cx").onclick=()=>m.remove();
 m.querySelector("#go").onclick=()=>{const v=+m.querySelector("#ov").value;m.remove();
  if(v>=p.p*.85){S.offer[id]=v;S.cart[id]=1;save();toast("Seller accepted "+K(v)+" – added to cart");draw()}else toast("Seller declined – try closer to "+K(p.p))}}
function shop(){const q=S.q.toLowerCase(),biz=S.mode=="biz";
 const hero=biz?["Business account 🏢","Wholesale prices with minimum order quantities, VAT invoices and escrow-protected payments"]:["Flash Sale ⚡ Up to 35% off","Free delivery over KSh 3,000 · Buy new from shops or second-hand from individuals · Escrow-protected payments"];
 let h=`<div class="hero"><h2>${hero[0]}</h2><p>${hero[1]}</p></div>`;
 if(S.t=="B2B"&&!biz)return h+`<div class="box">Wholesale listings are for business buyers. <button class="btn" onclick="mode()">Switch to Business account</button></div>`;
 const L=S.prods.filter(p=>(S.cat=="All"||p.c==S.cat)&&(S.t=="All"||p.t==S.t)&&(p.t!="B2B"||biz)&&(!q||(p.n+p.c+p.s).toLowerCase().includes(q)));
 return h+`<div class="grid">${L.map(card).join("")||"<p>No products found.</p>"}</div>`}
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
 <select id="pd"><option>Like new</option><option>Good condition</option><option>Fair</option></select><input id="pe" placeholder="Emoji icon (e.g. 🎒)" maxlength="4">
 <label class="mut"><input id="pg" type="checkbox" style="width:auto"> I confirm this item is legal, genuine and accurately described</label><button class="btn" style="width:100%;margin-top:6px" onclick="list()">Publish listing</button></div>
 <div><div class="box"><h3>Inventory</h3>${mine.length?mine.map(p=>`<div class="row"><span>${p.e} ${esc(p.n)} <span class="tag tt ${p.t}" style="position:static">${p.t}</span><br><span class="mut">${K(p.p)} · ${p.st} in stock</span>${p.st<=3?` <span class="neg">Low stock</span>`:""}</span><span><button class="btn o" onclick="restock(${p.id})">+10</button> <button class="btn o" onclick="sim(${p.id})">Sell</button> <button class="btn o" onclick="delP(${p.id})">🗑</button></span></div>`).join(""):"<p class='mut'>You haven’t listed anything yet.</p>"}</div>
 <div class="box"><h3>Return requests</h3>${rq.length?rq.map(r=>`<div class="row"><span>${r.id} · ${K(r.amt)}<br><span class="mut">${r.why}</span></span><span><button class="btn g" onclick="reviewR('${r.id}',true)">Approve</button> <button class="btn o" onclick="reviewR('${r.id}',false)">Reject</button></span></div>`).join(""):"<p class='mut'>No pending requests.</p>"}</div></div></div>`}
function list(){const n=pn.value.trim(),p=+pp.value,st=+ps.value,t=pt.value,moq=t=="B2B"?Math.max(+pq.value||10,2):1;
 if(!pg.checked)return toast("Please confirm the item is legal, genuine and accurately described");
 if(!n||!(p>0)||!(st>0)||st<moq)return toast("Fill in name, price and stock (stock must cover the MOQ)");
 const x={id:Date.now(),n,c:pc.value,p,o:p,e:pe.value||"📦",s:t=="C2C"?"You (individual)":(pb.value.trim()||"My Shop"),r:0,st,t,moq,cond:t=="C2C"?pd.value:"",se:S.user};
 S.prods.unshift(x);if(window.MM_CLOUD)MM_CLOUD.saveProduct(x);save();toast("Listing published");draw()}
function restock(id){const p=S.prods.find(x=>x.id==id);p.st+=10;if(window.MM_CLOUD)MM_CLOUD.saveProduct(p);save();draw()}
function delP(id){S.prods=S.prods.filter(x=>x.id!=id);if(window.MM_CLOUD)MM_CLOUD.deleteProduct(id);save();draw()}
function banner(){if(S.consent||document.getElementById("cbn"))return;const b=document.createElement("div");b.id="cbn";b.className="cbn";
 b.innerHTML=`<span>Morimall uses your browser’s storage for your cart, login and preferences. <a href="#" onclick="legal('privacy');return false">Privacy Policy</a></span><button class="btn" id="ok">OK</button>`;document.body.appendChild(b);b.querySelector("#ok").onclick=()=>{S.consent=true;save();b.remove()}}
function draw(){if(!S.user&&["wallet","orders","sell"].includes(S.v)){S.v="account";toast("Please log in first")}
 S.prods.forEach(p=>p.mine=!!S.user&&p.se==S.user);const n=Object.values(S.cart).reduce((a,b)=>a+b,0);
 wb.textContent=S.user?"💰 "+K(S.wallet):"💰 Wallet";cb.textContent="🛒 "+n;ab.textContent=S.user?"👤 "+S.users[S.user].name.split(" ")[0]:"🔐 Log in";mb.textContent=S.mode=="biz"?"🏢 Business":"👤 Individual";tb.textContent=isDark()?"☀️ Light":"🌙 Dark";
 const T=[["All","All types"],["B2C","🏪 Retail"],["C2C","👤 Individuals"],["B2B","🏢 Wholesale"]];
 const nav=S.v=="shop"?`<nav>${T.map(([k,l])=>`<button class="${S.t==k?"on":""}" onclick="S.t='${k}';draw()">${l}</button>`).join("")}</nav><nav>${CATS.map(c=>`<button class="${S.cat==c?"on":""}" onclick="S.cat='${c}';draw()">${c}</button>`).join("")}</nav>`:"";
 app.innerHTML=nav+`<div style="padding-top:${S.v=="shop"?0:14}px">${({shop,cart,wallet,orders,sell,account})[S.v]()}</div>`;save();banner()}
if(window.MM_CLOUD)MM_CLOUD.loadProducts().then(L=>{L.forEach(c=>{if(!S.prods.some(p=>p.id==c.id))S.prods.unshift(c)});draw()}).catch(()=>{});
draw();
