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

const DAILY_REWARD = 500;
const DAILY_COOLDOWN = 24 * 60 * 60 * 1000;

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

const dashboardCredits =
document.getElementById("dashboardCredits");

const dashboardWins =
document.getElementById("dashboardWins");

const dashboardLosses =
document.getElementById("dashboardLosses");

const dashboardFlappy =
document.getElementById("dashboardFlappy");

const dashboardSlotProfit =
document.getElementById("dashboardSlotProfit");

const dashboardJackpots =
document.getElementById("dashboardJackpots");

const claimRewardBtn =
document.getElementById("claimRewardBtn");

const dailyCountdown =
document.getElementById("dailyCountdown");

let currentUser = null;
let currentCredits = 0;
let lastDailyReward = 0;
let countdownInterval = null;

function getRank(credits){

if(credits >= 1000000){
return "👑 Legend";
}

if(credits >= 250000){
return "💎 Diamond";
}

if(credits >= 50000){
return "🥇 Gold";
}

if(credits >= 10000){
return "🥈 Silver";
}

return "🥉 Bronze";

}

function formatNumber(value){

return Number(
value || 0
).toLocaleString("hu-HU");

}

function updateCreditsUI(){

userCredits.textContent =
"💰 " +
formatNumber(currentCredits) +
" kredit";

dashboardCredits.textContent =
formatNumber(currentCredits);

userRank.textContent =
getRank(currentCredits);

}

function formatTime(ms){

const totalSeconds =
Math.floor(ms / 1000);

const hours =
Math.floor(totalSeconds / 3600);

const minutes =
Math.floor(
(totalSeconds % 3600) / 60
);

const seconds =
totalSeconds % 60;

return (
String(hours).padStart(2,"0")
+ ":" +
String(minutes).padStart(2,"0")
+ ":" +
String(seconds).padStart(2,"0")
);

}

function startCountdown(){

if(countdownInterval){

clearInterval(
countdownInterval
);

}

countdownInterval =
setInterval(()=>{

const remaining =
(lastDailyReward + DAILY_COOLDOWN)
- Date.now();

if(remaining <= 0){

clearInterval(
countdownInterval
);

dailyCountdown.textContent =
"✅ Elérhető";

claimRewardBtn.disabled =
false;

return;

}

dailyCountdown.textContent =
"⏳ " +
formatTime(
remaining
);

},1000);

}

async function claimDailyReward(){

if(!currentUser){
return;
}

const now = Date.now();

if(
now - lastDailyReward <
DAILY_COOLDOWN
){
return;
}

try{

currentCredits +=
DAILY_REWARD;

lastDailyReward =
now;

await updateDoc(
doc(
db,
"users",
currentUser.uid
),
{
credits:
currentCredits,

lastDailyReward:
lastDailyReward
}
);

updateCreditsUI();

claimRewardBtn.disabled =
true;

dailyCountdown.textContent =
"✅ Jutalom átvéve";

startCountdown();

}catch(error){

console.error(
"Daily Reward hiba:",
error
);

}

}

claimRewardBtn.addEventListener(
"click",
claimDailyReward
);

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

if(!snap.exists()){
return;
}

const data =
snap.data();

const username =
data.username ||
user.email.split("@")[0];

currentCredits =
data.credits || 0;

const wins =
data.wins || 0;

const losses =
data.losses || 0;

const flappyBest =
data.flappyBest || 0;

const slotProfit =
data.slotProfit || 0;

const slotJackpots =
data.slotJackpots || 0;

lastDailyReward =
data.lastDailyReward || 0;

userEmail.textContent =
"👤 " + username;

updateCreditsUI();

dashboardWins.textContent =
formatNumber(wins);

dashboardLosses.textContent =
formatNumber(losses);

dashboardFlappy.textContent =
formatNumber(flappyBest);

dashboardSlotProfit.textContent =
formatNumber(slotProfit);

dashboardJackpots.textContent =
formatNumber(slotJackpots);

const canClaim =
Date.now() - lastDailyReward
>= DAILY_COOLDOWN;

if(canClaim){

claimRewardBtn.disabled =
false;

dailyCountdown.textContent =
"🎁 Elérhető";

}else{

claimRewardBtn.disabled =
true;

startCountdown();

}

}catch(error){

console.error(
"Dashboard hiba:",
error
);

}

}
);

logoutBtn.addEventListener(
"click",
async()=>{

try{

await signOut(auth);

window.location.reload();

}catch(error){

console.error(error);

}

}
);
