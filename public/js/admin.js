// ===== Admin console =====
// Admins: local demo mode -> emails in admin-config.js; Firebase mode -> a doc in the `admins` collection
// (checked by firestore.rules on the server). Loaded BEFORE app.js; app.js calls adminHook() and adminView().
const ADM={ok:false,chk:null,cloud:[],loaded:false,init:false};
const admOn=()=>!!S.user&&(window.MM_CLOUD?ADM.ok:(window.MM_ADMINS||[]).includes(S.user));
const isAdminEmail=e=>(window.MM_ADMINS||[]).includes(e);
function adminHook(){
 if(!ADM.init){ADM.init=true;if(S.settings&&S.settings.fee)Object.assign(FEE,S.settings.fee)}
 if(window.MM_CLOUD&&S.user&&ADM.chk!==S.user){ADM.chk=S.user;ADM.ok=false;MM_CLOUD.isAdmin().then(v=>{ADM.ok=v;draw()}).catch(()=>{})}
 let b=document.getElementById("adminbtn");
 if(admOn()){if(!b){b=document.createElement("button");b.id="adminbtn";b.className="hb";b.textContent="🛡 Admin";b.onclick=()=>go("admin");const h=document.querySelector(".header-actions");if(h)h.prepend(b)}}else if(b)b.remove();
 if(S.v=="admin"&&!admOn())S.v="shop"}
function admUsers(){return window.MM_CLOUD?ADM.cloud:Object.entries(S.users).map(([email,u])=>({email,u}))}
const admData=r=>r.email==S.user?S:(r.u.d||{});
function admOrders(){const o=[];admUsers().forEach(r=>(admData(r).orders||[]).forEach(x=>o.push({...x,buyer:r.email})));return o}
function admTickets(){const o=[];admUsers().forEach(r=>(admData(r).tickets||[]).forEach(t=>o.push({email:r.email,t})));return o}
function mut(email,fn){const r=admUsers().find(x=>x.email==email);
 if(email==S.user)fn(S);else if(r){r.u.d=r.u.d||blank();fn(r.u.d);if(window.MM_CLOUD&&r.uid)MM_CLOUD.adminSetUser(r.uid,{d:JSON.parse(JSON.stringify(r.u.d))})}save()}
function alog(a){S.audit=S.audit||[];S.audit.unshift({d:now(),by:S.user,a});S.audit.length=Math.min(S.audit.length,200)}
function admRefresh(){if(window.MM_CLOUD)MM_CLOUD.adminUsers().then(a=>{ADM.cloud=a;draw()}).catch(e=>toast("Could not load users: "+e.message))}
function admConfirm(msg,fn){const m=modal(`<h3>Confirm</h3><p>${esc(msg)}</p><button class="btn" style="width:100%" id="go">Yes, continue</button><button class="btn o" style="width:100%;margin-top:6px" id="cx">Cancel</button>`);m.querySelector("#go").onclick=()=>{m.remove();fn()}}
function admSuspend(email){const r=admUsers().find(x=>x.email==email);if(!r||email==S.user||isAdminEmail(email))return toast("This account can’t be suspended");
 const s=r.u.suspended=!r.u.suspended;if(window.MM_CLOUD&&r.uid)MM_CLOUD.adminSetUser(r.uid,{suspended:s});
 S.prods.forEach(p=>{if(p.se==email){p.hidden=s;if(window.MM_CLOUD)MM_CLOUD.adminProduct(p)}});alog((s?"Suspended ":"Reactivated ")+email);save();draw()}
function admHide(id){const p=S.prods.find(x=>x.id==id);p.hidden=!p.hidden;if(window.MM_CLOUD)MM_CLOUD.adminProduct(p);alog((p.hidden?"Hid listing ":"Restored listing ")+p.n);save();draw()}
function admDel(id){const p=S.prods.find(x=>x.id==id);admConfirm("Permanently remove “"+p.n+"”?",()=>{S.prods=S.prods.filter(x=>x.id!=id);if(window.MM_CLOUD)MM_CLOUD.deleteProduct(id);alog("Removed listing "+p.n);save();draw()})}
function admRefund(buyer,id){admConfirm("Refund order #"+id+" to the buyer’s wallet?",()=>{mut(buyer,d=>{const o=d.orders.find(x=>x.id==id);if(!o||/Cancelled|Refunded|Returned/.test(o.st))return;back(o);d.wallet+=o.total;d.tx.unshift({d:now(),t:"Admin refund – order #"+id,a:o.total});o.st="Refunded by admin"});alog("Refunded order #"+id+" ("+buyer+")");draw()})}
function admRelease(buyer,id){admConfirm("Release escrow for order #"+id+" to the seller(s)?",()=>{mut(buyer,d=>{const o=d.orders.find(x=>x.id==id);if(!o||o.st!="Held in escrow")return;
 o.items.forEach(i=>{const p=S.prods.find(x=>x.n==i.n&&x.s==i.s);if(p&&p.se)mut(p.se,s=>{s.earn=(s.earn||0)+i.p*i.q*(1-FEE[i.t])})});o.st="Delivered – released by admin"});alog("Released escrow for order #"+id);draw()})}
function admReply(email,id){const m=modal(`<h3>Reply to customer</h3><input id="arp" placeholder="Your reply"><button class="btn g" style="width:100%" id="go">Send &amp; close ticket</button><button class="btn o" style="width:100%;margin-top:6px" id="cx">Cancel</button>`);
 m.querySelector("#go").onclick=()=>{const v=m.querySelector("#arp").value.trim();if(!v)return toast("Write a reply");m.remove();mut(email,d=>{const t=d.tickets.find(x=>x.id==id);t.st="Closed";t.reply=v});alog("Replied to ticket #"+id);draw()}}
function admSave(){const f={C2C:+fc.value/100,B2C:+fb.value/100,B2B:+fw.value/100};if(Object.values(f).some(v=>!(v>=0&&v<=.5)))return toast("Rates must be between 0% and 50%");
 Object.assign(FEE,f);S.settings={fee:f};alog("Updated commission rates");save();toast("Settings saved");draw()}
function adminView(){if(!admOn())return `<div class="box">Admins only.</div>`;
 if(window.MM_CLOUD&&!ADM.loaded){ADM.loaded=true;admRefresh()}
 const t=S.admTab||"ov",T=[["ov","Overview"],["us","Users"],["li","Listings"],["or","Orders"],["su","Support"],["se","Settings"]];
 return `<h2>🛡 Admin console</h2><div class="adm-tabs">${T.map(([k,l])=>`<button class="btn ${t==k?"":"o"}" onclick="S.admTab='${k}';draw()">${l}</button>`).join("")}</div>`+({ov:admOv,us:admUs,li:admLi,or:admOr,su:admSu,se:admSe})[t]()}
const BAD=/Cancelled|Refunded|Returned/;
function admOv(){const O=admOrders(),live=O.filter(o=>!BAD.test(o.st)),by={B2C:0,C2C:0,B2B:0};live.forEach(o=>o.items.forEach(i=>by[i.t]=(by[i.t]||0)+i.p*i.q));
 const gmv=live.reduce((a,o)=>a+o.total,0),held=O.filter(o=>o.st=="Held in escrow").reduce((a,o)=>a+o.total,0),
 fee=live.filter(o=>o.st.startsWith("Delivered")).reduce((a,o)=>a+o.items.reduce((b,i)=>b+i.p*i.q*(FEE[i.t]||0),0),0),mx=Math.max(1,...Object.values(by)),
 k=(l,v)=>`<div class="kpi"><b>${v}</b><span>${l}</span></div>`;
 return `<div class="kpis">${k("Users",admUsers().length)}${k("Listings",S.prods.length+" ("+S.prods.filter(p=>p.hidden).length+" hidden)")}${k("Orders",O.length)}${k("Sales (GMV)",K(gmv))}${k("Held in escrow",K(held))}${k("Commission earned",K(fee))}${k("Pending returns",S.refunds.filter(r=>r.st=="Pending").length)}${k("Open tickets",admTickets().filter(x=>x.t.st=="Open").length)}</div>
 <div class="box"><h3>Sales by trade type</h3>${Object.entries(by).map(([t,v])=>`<div class="row"><span style="width:44px">${t}</span><span class="bar"><i style="width:${v/mx*100}%"></i></span><b>${K(v)}</b></div>`).join("")}</div>
 <div class="box"><h3>Audit log</h3>${(S.audit||[]).slice(0,12).map(a=>`<div class="row"><span>${esc(a.a)}<br><span class="mut">${esc(a.by)} · ${a.d}</span></span></div>`).join("")||"<p class='mut'>No admin actions yet.</p>"}</div>`}
const tbl=(h,rows)=>`<div class="tbl"><table class="adm"><tr>${h.map(x=>`<th>${x}</th>`).join("")}</tr>${rows.join("")||`<tr><td colspan="${h.length}" class="mut">Nothing here yet.</td></tr>`}</table></div>`;
function admUs(){return `<div class="box"><div class="row"><h3>Users (${admUsers().length})</h3>${window.MM_CLOUD?`<button class="btn o" onclick="admRefresh()">Refresh</button>`:""}</div>`+tbl(["User","Orders","Spent","Wallet","Status",""],admUsers().map(r=>{const d=admData(r),o=d.orders||[],a=isAdminEmail(r.email);
 return `<tr><td>${esc(r.u.name||"")}<br><span class="mut">${esc(r.email)}</span></td><td>${o.length}</td><td>${K(o.reduce((s,x)=>s+x.total,0))}</td><td>${K(d.wallet||0)}</td><td>${r.u.suspended?'<span class="neg">Suspended</span>':'<span class="pos">Active</span>'}${a?" 🛡":""}</td><td>${a||r.email==S.user?"":`<button class="btn o" data-e="${esc(r.email)}" onclick="admSuspend(this.dataset.e)">${r.u.suspended?"Reactivate":"Suspend"}</button>`}</td></tr>`}))+`</div>`}
function admLi(){return `<div class="box"><h3>Listings (${S.prods.length})</h3>`+tbl(["Product","Type","Seller","Price","Stock","Status",""],S.prods.map(p=>`<tr><td>${p.e||""} ${esc(p.n)}</td><td><span class="tag tt ${p.t}" style="position:static">${p.t}</span></td><td>${esc(p.s)}</td><td>${K(p.p)}</td><td>${p.st}${p.st<=3?' <span class="neg">low</span>':""}</td><td>${p.hidden?'<span class="neg">Hidden</span>':'<span class="pos">Live</span>'}</td><td><button class="btn o" onclick="admHide(${p.id})">${p.hidden?"Restore":"Hide"}</button> <button class="btn o" onclick="admDel(${p.id})">🗑</button></td></tr>`))+`</div>`}
function admOr(){return `<div class="box"><h3>All orders</h3>`+tbl(["Order","Buyer","Items","Total","Status",""],admOrders().map(o=>`<tr><td>#${o.id}<br><span class="mut">${o.d}</span></td><td>${esc(o.buyer)}</td><td>${o.items.map(i=>esc(i.n)+" ×"+i.q).join(", ")}</td><td>${K(o.total)}</td><td>${o.st}</td><td>${o.st=="Held in escrow"?`<button class="btn g" data-e="${esc(o.buyer)}" onclick="admRelease(this.dataset.e,'${o.id}')">Release</button> `:""}${BAD.test(o.st)?"":`<button class="btn o" data-e="${esc(o.buyer)}" onclick="admRefund(this.dataset.e,'${o.id}')">Refund</button>`}</td></tr>`))+`</div>`}
function admSu(){const rq=S.refunds;return `<div class="box"><h3>Return requests</h3>`+tbl(["Request","Customer","Reason","Amount","Status",""],rq.map(r=>`<tr><td>${r.id}<br><span class="mut">order #${r.o}</span></td><td>${esc(r.u)}</td><td>${r.why}</td><td>${K(r.amt)}</td><td>${r.st}</td><td>${r.st=="Pending"?`<button class="btn g" onclick="reviewR('${r.id}',true)">Approve</button> <button class="btn o" onclick="reviewR('${r.id}',false)">Reject</button>`:""}</td></tr>`))+`</div>
 <div class="box"><h3>Support tickets</h3>`+tbl(["Ticket","Customer","Message","Status",""],admTickets().map(({email,t})=>`<tr><td>#${t.id}<br><span class="mut">${t.d}</span></td><td>${esc(email)}</td><td><b>${esc(t.s)}</b><br>${esc(t.m)}${t.reply?`<br><span class="mut">Reply: ${esc(t.reply)}</span>`:""}</td><td class="${t.st=="Open"?"neg":"pos"}">${t.st}</td><td>${t.st=="Open"?`<button class="btn" data-e="${esc(email)}" onclick="admReply(this.dataset.e,${t.id})">Reply</button>`:""}</td></tr>`))+`</div>`}
function admSe(){return `<div class="box" style="max-width:460px"><h3>Commission rates (%)</h3><label class="mut">Individual → individual (C2C)</label><input id="fc" type="number" step="0.1" value="${FEE.C2C*100}"><label class="mut">Retail (B2C)</label><input id="fb" type="number" step="0.1" value="${FEE.B2C*100}"><label class="mut">Wholesale (B2B)</label><input id="fw" type="number" step="0.1" value="${FEE.B2B*100}"><button class="btn g" onclick="admSave()">Save rates</button>
 <p class="mut">Applies to future escrow releases. Admin access: ${window.MM_CLOUD?"documents in the Firestore <code>admins</code> collection":"emails in <code>js/admin-config.js</code> (demo only – not secure)"}.</p></div>`}
