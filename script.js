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
getDoc
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

const credits =
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

userEmail.textContent =
"👤 " + username;

userCredits.textContent =
"💰 " +
formatNumber(
credits
) +
" kredit";

userRank.textContent =
getRank(
credits
);

dashboardCredits.textContent =
formatNumber(
credits
);

dashboardWins.textContent =
formatNumber(
wins
);

dashboardLosses.textContent =
formatNumber(
losses
);

dashboardFlappy.textContent =
formatNumber(
flappyBest
);

dashboardSlotProfit.textContent =
formatNumber(
slotProfit
);

dashboardJackpots.textContent =
formatNumber(
slotJackpots
);

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

await signOut(
auth
);

window.location.reload();

}catch(error){

console.error(
error
);

}

}
);
