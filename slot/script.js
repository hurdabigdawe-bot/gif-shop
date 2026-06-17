import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
getAuth,
onAuthStateChanged,
signOut
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
getFirestore,
doc,
getDoc,
updateDoc,
setDoc
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyBoIILW2sbfyuSSvK108YAxnLPB_GlZZP0",
authDomain: "game-6df94.firebaseapp.com",
projectId: "game-6df94",
storageBucket: "game-6df94.firebasestorage.app",
messagingSenderId: "443187158566",
appId: "1:443187158566:web:2e055a515f29b5021110e7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const reel1 =
document.getElementById("reel1");

const reel2 =
document.getElementById("reel2");

const reel3 =
document.getElementById("reel3");

const spinBtn =
document.getElementById("spinBtn");

const result =
document.getElementById("result");

const loginLink =
document.getElementById("loginLink");

const userInfo =
document.getElementById("userInfo");

const logoutBtn =
document.getElementById("logoutBtn");

const userEmail =
document.getElementById("userEmail");

const userCredits =
document.getElementById("userCredits");

const symbols = [
"🍒",
"🍋",
"⭐",
"💎",
"🍀",
"7️⃣"
];

let currentUser = null;
let credits = 0;

function randomSymbol(){

return symbols[
Math.floor(
Math.random() *
symbols.length
)
];

}

async function updateCredits(){

if(!currentUser)
return;

await updateDoc(
doc(
db,
"users",
currentUser.uid
),
{
credits
}
);

userCredits.textContent =
"💰 " +
credits +
" kredit";

}

function calculateWin(a,b,c){

if(
a === "7️⃣" &&
b === "7️⃣" &&
c === "7️⃣"
){
return 50000;
}

if(
a === "💎" &&
b === "💎" &&
c === "💎"
){
return 10000;
}

if(
a === "⭐" &&
b === "⭐" &&
c === "⭐"
){
return 2500;
}

if(
a === "🍋" &&
b === "🍋" &&
c === "🍋"
){
return 1000;
}

if(
a === "🍒" &&
b === "🍒" &&
c === "🍒"
){
return 500;
}

if(
a === b ||
b === c ||
a === c
){
return 150;
}

return 0;

}

async function spin(){

if(!currentUser)
return;

if(credits < 100){

result.textContent =
"❌ Nincs elég kredited!";

return;

}

spinBtn.disabled = true;

credits -= 100;

await updateCredits();

result.textContent =
"🎰 Pörgetés...";

reel1.classList.add("spin");
reel2.classList.add("spin");
reel3.classList.add("spin");

const animation =
setInterval(()=>{

reel1.textContent =
randomSymbol();

reel2.textContent =
randomSymbol();

reel3.textContent =
randomSymbol();

},100);

setTimeout(
async()=>{

clearInterval(
animation
);

reel1.classList.remove("spin");
reel2.classList.remove("spin");
reel3.classList.remove("spin");

const a =
randomSymbol();

const b =
randomSymbol();

const c =
randomSymbol();

reel1.textContent = a;
reel2.textContent = b;
reel3.textContent = c;

const win =
calculateWin(
a,
b,
c
);

if(win > 0){

credits += win;

result.textContent =
"🎉 Nyertél " +
win +
" kreditet!";

}else{

result.textContent =
"😢 Nem nyertél.";

}

await updateCredits();

spinBtn.disabled =
false;

},2000);

}

spinBtn.addEventListener(
"click",
spin
);

onAuthStateChanged(
auth,
async(user)=>{

if(!user){

loginLink.style.display =
"block";

userInfo.style.display =
"none";

spinBtn.disabled = true;

result.textContent =
"🔒 Jelentkezz be!";

return;

}

currentUser = user;

loginLink.style.display =
"none";

userInfo.style.display =
"flex";

userEmail.textContent =
"👤 " +
user.email;

try{

const snap =
await getDoc(
doc(
db,
"users",
user.uid
)
);

if(snap.exists()){

const data =
snap.data();

credits =
data.credits || 0;

userCredits.textContent =
"💰 " +
credits +
" kredit";

}else{

await setDoc(
doc(
db,
"users",
user.uid
),
{
credits:5000
},
{
merge:true
}
);

credits = 5000;

userCredits.textContent =
"💰 5000 kredit";

}

}catch(error){

console.error(error);

}

}
);

logoutBtn.addEventListener(
"click",
async()=>{

await signOut(auth);

window.location.href =
"/";

}
);
