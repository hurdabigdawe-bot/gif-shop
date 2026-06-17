import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
getAuth,
onAuthStateChanged
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

function formatDate(timestamp){

if(!timestamp){
return "-";
}

const date =
new Date(timestamp);

return date.toLocaleDateString(
"hu-HU"
);

}

onAuthStateChanged(
auth,
async(user)=>{

if(!user){

window.location.href =
"/login/";

return;

}

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

const slotSpins =
data.slotSpins || 0;

const createdAt =
data.createdAt || 0;

const games =
wins + losses;

const winRate =
games > 0
? (
wins / games * 100
).toFixed(1)
: "0.0";

document.getElementById(
"username"
).textContent =
username;

document.getElementById(
"email"
).textContent =
user.email;

document.getElementById(
"credits"
).textContent =
formatNumber(
credits
);

document.getElementById(
"wins"
).textContent =
formatNumber(
wins
);

document.getElementById(
"losses"
).textContent =
formatNumber(
losses
);

document.getElementById(
"winrate"
).textContent =
winRate + "%";

document.getElementById(
"rank"
).textContent =
getRank(
credits
);

document.getElementById(
"flappyBest"
).textContent =
formatNumber(
flappyBest
);

document.getElementById(
"slotProfit"
).textContent =
formatNumber(
slotProfit
);

document.getElementById(
"slotJackpots"
).textContent =
formatNumber(
slotJackpots
);

document.getElementById(
"slotSpins"
).textContent =
formatNumber(
slotSpins
);

document.getElementById(
"createdAt"
).textContent =
formatDate(
createdAt
);

document.getElementById(
"games"
).textContent =
formatNumber(
games
);

}catch(error){

console.error(
"Profil hiba:",
error
);

}

}
);
