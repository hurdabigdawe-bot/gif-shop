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
setDoc,
updateDoc
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

const reel1 = document.getElementById("reel1");
const reel2 = document.getElementById("reel2");
const reel3 = document.getElementById("reel3");

const spinBtn = document.getElementById("spinBtn");
const result = document.getElementById("result");
const betAmount = document.getElementById("betAmount");

const loginLink = document.getElementById("loginLink");
const userInfo = document.getElementById("userInfo");
const logoutBtn = document.getElementById("logoutBtn");

const userEmail = document.getElementById("userEmail");
const userCredits = document.getElementById("userCredits");

const slotSpinsEl =
document.getElementById("slotSpins");

const slotWinsEl =
document.getElementById("slotWins");

const slotLossesEl =
document.getElementById("slotLosses");

const slotProfitEl =
document.getElementById("slotProfit");

const slotJackpotsEl =
document.getElementById("slotJackpots");

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

let slotSpins = 0;
let slotWins = 0;
let slotLosses = 0;
let slotProfit = 0;
let slotJackpots = 0;

function updateStatsUI(){

slotSpinsEl.textContent =
slotSpins;

slotWinsEl.textContent =
slotWins;

slotLossesEl.textContent =
slotLosses;

slotProfitEl.textContent =
slotProfit.toLocaleString();

slotJackpotsEl.textContent =
slotJackpots;

userCredits.textContent =
"💰 " +
credits.toLocaleString() +
" kredit";

}

function randomSymbol(){

return symbols[
Math.floor(
Math.random() *
symbols.length
)
];

}

function getMultiplier(a,b,c){

if(
a==="7️⃣" &&
b==="7️⃣" &&
c==="7️⃣"
){
return 500;
}

if(
a==="💎" &&
b==="💎" &&
c==="💎"
){
return 100;
}

if(
a==="⭐" &&
b==="⭐" &&
c==="⭐"
){
return 25;
}

if(
a==="🍋" &&
b==="🍋" &&
c==="🍋"
){
return 10;
}

if(
a==="🍒" &&
b==="🍒" &&
c==="🍒"
){
return 5;
}

if(
a===b ||
b===c ||
a===c
){
return 1.5;
}

return 0;

}

async function saveStats(){

if(!currentUser)
return;

await updateDoc(
doc(
db,
"users",
currentUser.uid
),
{
credits,
slotSpins,
slotWins,
slotLosses,
slotProfit,
slotJackpots
}
);

}

async function spin(){

if(!currentUser)
return;

const bet =
Number(
betAmount.value
);

if(credits < bet){

result.textContent =
"❌ Nincs elég kredited!";

return;

}

spinBtn.disabled = true;

credits -= bet;

slotSpins++;

updateStatsUI();

const interval =
setInterval(()=>{

reel1.textContent =
randomSymbol();

reel2.textContent =
randomSymbol();

reel3.textContent =
randomSymbol();

},80);

setTimeout(
async()=>{

clearInterval(interval);

const a =
randomSymbol();

const b =
randomSymbol();

const c =
randomSymbol();

reel1.textContent = a;
reel2.textContent = b;
reel3.textContent = c;

const multiplier =
getMultiplier(
a,
b,
c
);

if(multiplier > 0){

const win =
Math.floor(
bet *
multiplier
);

credits += win;

slotWins++;

slotProfit +=
(win - bet);

if(
a==="7️⃣" &&
b==="7️⃣" &&
c==="7️⃣"
){

slotJackpots++;

result.textContent =
"💎 JACKPOT! +" +
win.toLocaleString();

}else{

result.textContent =
"🎉 Nyertél +" +
win.toLocaleString();

}

}else{

slotLosses++;

slotProfit -= bet;

result.textContent =
"😢 Nem nyertél";

}

updateStatsUI();

await saveStats();

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
"🔒 Jelentkezz be";

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

slotSpins =
data.slotSpins || 0;

slotWins =
data.slotWins || 0;

slotLosses =
data.slotLosses || 0;

slotProfit =
data.slotProfit || 0;

slotJackpots =
data.slotJackpots || 0;

}else{

await setDoc(
doc(
db,
"users",
user.uid
),
{
credits:5000,
slotSpins:0,
slotWins:0,
slotLosses:0,
slotProfit:0,
slotJackpots:0
},
{
merge:true
}
);

}

updateStatsUI();

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
