// Cloud adapter: does nothing unless firebase-config.js sets window.MM_FIREBASE.
(function(){const c=window.MM_FIREBASE;if(!c||!window.firebase)return;
firebase.initializeApp(c);const A=firebase.auth(),F=firebase.firestore();
const prof=async u=>{const d=await F.collection("users").doc(u.uid).get();return d.exists?d.data():null};
window.MM_CLOUD={
 async signUp(e,p,n){const r=await A.createUserWithEmailAndPassword(e,p);await r.user.updateProfile({displayName:n})},
 async signIn(e,p){const r=await A.signInWithEmailAndPassword(e,p);return prof(r.user)},
 async google(){const r=await A.signInWithPopup(new firebase.auth.GoogleAuthProvider());window._gp=await prof(r.user);return r.user.email},
 isAdmin(){return new Promise(r=>{const un=A.onAuthStateChanged(async u=>{un();try{r(!!u&&(await F.collection("admins").doc(u.uid).get()).exists)}catch(e){r(false)}})})},
 async adminUsers(){return (await F.collection("users").get()).docs.map(d=>({uid:d.id,email:d.data().email||d.id,u:d.data()}))},
 adminSetUser(uid,p){return F.collection("users").doc(uid).update(p)},
 adminProduct(p){return F.collection("products").doc(String(p.id)).set(JSON.parse(JSON.stringify(p)),{merge:true})},
 signOut(){return A.signOut()},
 saveUser(e,d){const u=A.currentUser;if(u)F.collection("users").doc(u.uid).set(JSON.parse(JSON.stringify({...d,email:e})))},
 deleteUser(){const u=A.currentUser;if(u)return F.collection("users").doc(u.uid).delete().then(()=>u.delete())},
 async loadProducts(){return (await F.collection("products").get()).docs.map(d=>d.data())},
 saveProduct(p){const u=A.currentUser;if(u)F.collection("products").doc(String(p.id)).set({...p,sellerUid:u.uid})},
 deleteProduct(id){return F.collection("products").doc(String(id)).delete()}};
})();
