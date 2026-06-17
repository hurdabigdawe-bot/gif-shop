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
updateDoc,
arrayUnion
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

const slotSpinsEl = document.getElementById("slotSpins");
const slotWinsEl = document.getElementById("slotWins");
const slotLossesEl = document.getElementById("slotLosses");
const slotProfitEl = document.getElementById("slotProfit");
const slotJackpotsEl = document.getElementById("slotJackpots");
const slotWinRateEl = document.getElementById("slotWinRate");

const biggestWinEl =
document.getElementById("biggestWin");

const achievementCountEl =
document.getElementById("achievementCount");

const jackpotPoolEl =
document.getElementById("jackpotPool");

const toast =
document.getElementById("toast");

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

let biggestWin = 0;

let jackpotPool = 1000000;

let achievements = [];

function randomSymbol(){

return symbols[
Math.floor(
Math.random() *
symbols.length
)
];

}

function showToast(text){

toast.textContent = text;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},3000);

}

function updateStatsUI(){

slotSpinsEl.textContent =
slotSpins.toLocaleString();

slotWinsEl.textContent =
slotWins.toLocaleString();

slotLossesEl.textContent =
slotLosses.toLocaleString();

slotProfitEl.textContent =
slotProfit.toLocaleString();

slotJackpotsEl.textContent =
slotJackpots.toLocaleString();

biggestWinEl.textContent =
biggestWin.toLocaleString() +
" kredit";

userCredits.textContent =
"💰 " +
credits.toLocaleString() +
" kredit";

jackpotPoolEl.textContent =
jackpotPool.toLocaleString();

const totalGames =
slotWins + slotLosses;

const rate =
totalGames > 0
? (
slotWins /
totalGames *
100
).toFixed(1)
: "0.0";

slotWinRateEl.textContent =
rate + "%";

achievementCountEl.textContent =
achievements.length +
" feloldva";

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

async function unlockAchievement(id){

if(
achievements.includes(id)
){
return;
}

achievements.push(id);

await updateDoc(
doc(
db,
"users",
currentUser.uid
),
{
achievements:
arrayUnion(id)
}
);

showToast(
"🏅 Achievement: " +
id
);

updateStatsUI();

}

async function saveStats(){

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
slotJackpots,
biggestWin,
jackpotPool
}
);

}

async function spin(){

if(!currentUser){
return;
}

const bet =
Number(
betAmount.value
);

if(
credits < bet
){

result.textContent =
"❌ Nincs elég kredited";

return;

}

spinBtn.disabled = true;

credits -= bet;

slotSpins++;

jackpotPool +=
Math.floor(
bet * 0.05
);

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

clearInterval(
interval
);

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
a,b,c
);

if(multiplier > 0){

let win =
Math.floor(
bet *
multiplier
);

if(
a==="7️⃣" &&
b==="7️⃣" &&
c==="7️⃣"
){

win += jackpotPool;

jackpotPool =
1000000;

slotJackpots++;

result.textContent =
"💎 JACKPOT! +" +
win.toLocaleString();

await unlockAchievement(
"first_jackpot"
);

if(
slotJackpots >= 10
){

await unlockAchievement(
"jackpot_10"
);

}

}else{

result.textContent =
"🎉 Nyertél +" +
win.toLocaleString();

}

credits += win;

slotWins++;

slotProfit +=
(win - bet);

if(
win > biggestWin
){

biggestWin = win;

}

}else{

slotLosses++;

slotProfit -= bet;

result.textContent =
"😢 Nem nyertél";

}

if(
credits >= 10000
){

await unlockAchievement(
"credits_10000"
);

}

if(
credits >= 100000
){

await unlockAchievement(
"credits_100000"
);

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

const userRef =
doc(
db,
"users",
user.uid
);

const snap =
await getDoc(
userRef
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

biggestWin =
data.biggestWin || 0;

jackpotPool =
data.jackpotPool || 1000000;

achievements =
data.achievements || [];

}else{

await setDoc(
userRef,
{
credits:5000,
slotSpins:0,
slotWins:0,
slotLosses:0,
slotProfit:0,
slotJackpots:0,
biggestWin:0,
jackpotPool:1000000,
achievements:[]
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
