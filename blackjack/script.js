import {
auth,
db
}
from "./firebase.js";

import {
onAuthStateChanged,
signOut
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
doc,
getDoc,
updateDoc,
increment,
arrayUnion
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

/* =========================
   UI ELEMEK
========================= */

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

const userRank =
document.getElementById("userRank");

const balanceElement =
document.getElementById("balance");

const winsElement =
document.getElementById("userWins");

const lossesElement =
document.getElementById("userLosses");

const winRateElement =
document.getElementById("userWinRate");

const dealerCardsElement =
document.getElementById("dealerCards");

const playerCardsElement =
document.getElementById("playerCards");

const dealerScoreElement =
document.getElementById("dealerScore");

const playerScoreElement =
document.getElementById("playerScore");

const messageElement =
document.getElementById("message");

const betValueElement =
document.getElementById("betValue");

const achievementPreview =
document.getElementById("achievementPreview");

const toast =
document.getElementById("toast");

/* =========================
   JÁTÉK ADATOK
========================= */

let balance = 0;

let wins = 0;

let losses = 0;

let bet = 100;

let deck = [];

let player = [];

let dealer = [];

let gameActive = false;

let currentUser = null;

let doubleUsed = false;

/* =========================
   KÁRTYÁK
========================= */

const suits = [
"♠",
"♥",
"♦",
"♣"
];

const values = [
"A",
"2",
"3",
"4",
"5",
"6",
"7",
"8",
"9",
"10",
"J",
"Q",
"K"
];

/* =========================
   TOAST
========================= */

function showToast(text){

toast.textContent =
text;

toast.classList.add(
"show"
);

setTimeout(()=>{

toast.classList.remove(
"show"
);

},3000);

}

/* =========================
   RANGRENDSZER
========================= */

function getRank(credits){

if(
credits >= 1000000
){
return "👑 Legend";
}

if(
credits >= 250000
){
return "💎 Diamond";
}

if(
credits >= 50000
){
return "🥇 Gold";
}

if(
credits >= 10000
){
return "🥈 Silver";
}

return "🥉 Bronze";

}

function updateRank(){

userRank.textContent =
getRank(balance);

}

/* =========================
   UI FRISSÍTÉS
========================= */

function updateBalance(){

balanceElement.textContent =
Number(balance)
.toLocaleString(
"hu-HU"
);

userCredits.textContent =
"💰 " +
Number(balance)
.toLocaleString(
"hu-HU"
) +
" kredit";

updateRank();

}

function updateStats(){

winsElement.textContent =
wins;

lossesElement.textContent =
losses;

const total =
wins + losses;

const rate =
total > 0
?
(
wins /
total *
100
).toFixed(1)
:
0;

winRateElement.textContent =
rate + "%";

}

/* =========================
   ACHIEVEMENTEK
========================= */

async function unlockAchievement(id){

if(
!currentUser
){
return;
}

try{

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

}catch(error){

console.error(
"Achievement hiba:",
error
);

}

}

async function checkAchievements(){

if(
wins >= 1
){
await unlockAchievement(
"first_win"
);
}

if(
wins >= 10
){
await unlockAchievement(
"win_10"
);
}

if(
wins >= 100
){
await unlockAchievement(
"win_100"
);
}

if(
balance >= 10000
){
await unlockAchievement(
"credits_10000"
);
}

if(
balance >= 100000
){
await unlockAchievement(
"credits_100000"
);
}

if(
balance >= 1000000
){
await unlockAchievement(
"legend_rank"
);
}

}

/* =========================
   FIRESTORE MENTÉS
========================= */

async function saveUser(){

if(
!currentUser
){
return;
}

try{

await updateDoc(
doc(
db,
"users",
currentUser.uid
),
{
credits: balance,
wins: wins,
losses: losses
}
);

}catch(error){

console.error(
"Mentési hiba:",
error
);

}

}

/* =========================
   AUTH
========================= */

onAuthStateChanged(
auth,
async(user)=>{

if(!user){

loginLink.style.display =
"block";

userInfo.style.display =
"none";

return;

}

currentUser = user;

loginLink.style.display =
"none";

userInfo.style.display =
"flex";

try{

const snap =
await getDoc(
doc(
db,
"users",
user.uid
)
);

if(
snap.exists()
){

const data =
snap.data();

balance =
data.credits || 0;

wins =
data.wins || 0;

losses =
data.losses || 0;

const username =
data.username ||
user.email;

userEmail.textContent =
"👤 " +
username;

updateBalance();

updateStats();

achievementPreview.textContent =
"🏅 Achievement rendszer aktív";

}

}catch(error){

console.error(
error
);

}

}
);

/* =========================
   KIJELENTKEZÉS
========================= */

logoutBtn.addEventListener(
"click",
async()=>{

await signOut(
auth
);

window.location.href =
"/";

}
);
