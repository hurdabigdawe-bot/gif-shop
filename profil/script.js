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

const achievementData = {

first_win:{
name:"🥉 Első Győzelem",
rarity:"common"
},

win_10:{
name:"🥈 10 Győzelem",
rarity:"rare"
},

win_100:{
name:"🥇 100 Győzelem",
rarity:"epic"
},

flappy_10:{
name:"🐦 Flappy 10+",
rarity:"common"
},

flappy_50:{
name:"🐦 Flappy 50+",
rarity:"legendary"
},

flappy_100:{
name:"🐦 Flappy 100+",
rarity:"mythic"
},

first_jackpot:{
name:"🎰 Első Jackpot",
rarity:"rare"
},

jackpot_10:{
name:"💎 10 Jackpot",
rarity:"legendary"
},

credits_10000:{
name:"💰 10 000 Kredit",
rarity:"rare"
},

credits_100000:{
name:"💰 100 000 Kredit",
rarity:"epic"
},

legend_rank:{
name:"👑 Legend Rang",
rarity:"mythic"
}

};

function renderAchievements(list){

const container =
document.getElementById(
"achievementList"
);

if(!container){
return;
}

if(!list || list.length === 0){

container.innerHTML = `
<div class="achievement-empty">
Még nincs achievement.
</div>
`;

return;

}

let html = "";

list.forEach(id=>{

const achievement =
achievementData[id];

if(!achievement){
return;
}

html += `
<div class="achievement ${achievement.rarity}">
${achievement.name}
</div>
`;

});

container.innerHTML =
html;

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

const achievements =
data.achievements || [];

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

renderAchievements(
achievements
);

}catch(error){

console.error(
"Profil hiba:",
error
);

}

}
);
