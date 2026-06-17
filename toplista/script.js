import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
getAuth,
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
getFirestore,
collection,
getDocs
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

const blackjackLeaderboard =
document.getElementById("blackjackLeaderboard");

const flappyLeaderboard =
document.getElementById("flappyLeaderboard");

const creditsLeaderboard =
document.getElementById("creditsLeaderboard");

const slotWinsLeaderboard =
document.getElementById("slotWinsLeaderboard");

const slotJackpotLeaderboard =
document.getElementById("slotJackpotLeaderboard");

const slotProfitLeaderboard =
document.getElementById("slotProfitLeaderboard");

function getDisplayName(player){

if(
player.username &&
player.username.trim() !== ""
){
return player.username;
}

if(player.email){
return player.email.split("@")[0];
}

return "Ismeretlen";

}

function medal(index){

if(index===0) return "🥇";
if(index===1) return "🥈";
if(index===2) return "🥉";

return "#" + (index+1);

}

function medalClass(index){

if(index===0) return "gold";
if(index===1) return "silver";
if(index===2) return "bronze";

return "";

}

function renderLeaderboard(
container,
players,
field
){

if(players.length===0){

container.innerHTML =
'<div class="empty">Nincs adat</div>';

return;

}

let html = "";

players.forEach(
(player,index)=>{

html += `
<div class="player">

<div class="rank ${medalClass(index)}">
${medal(index)}
</div>

<div class="name">
${getDisplayName(player)}
</div>

<div class="score">
${Number(player[field] || 0).toLocaleString()}
</div>

</div>
`;

});

container.innerHTML = html;

}

async function loadLeaderboard(){

try{

const snapshot =
await getDocs(
collection(
db,
"users"
)
);

const users = [];

snapshot.forEach(doc=>{

const data =
doc.data();

users.push({

username:
data.username || "",

email:
data.email || "",

credits:
data.credits || 0,

wins:
data.wins || 0,

losses:
data.losses || 0,

flappyBest:
data.flappyBest || 0,

slotWins:
data.slotWins || 0,

slotProfit:
data.slotProfit || 0,

slotJackpots:
data.slotJackpots || 0

});

});

renderLeaderboard(
blackjackLeaderboard,
[...users]
.sort((a,b)=>b.wins-a.wins)
.slice(0,10),
"wins"
);

renderLeaderboard(
flappyLeaderboard,
[...users]
.sort((a,b)=>b.flappyBest-a.flappyBest)
.slice(0,10),
"flappyBest"
);

renderLeaderboard(
creditsLeaderboard,
[...users]
.sort((a,b)=>b.credits-a.credits)
.slice(0,10),
"credits"
);

renderLeaderboard(
slotWinsLeaderboard,
[...users]
.sort((a,b)=>b.slotWins-a.slotWins)
.slice(0,10),
"slotWins"
);

renderLeaderboard(
slotJackpotLeaderboard,
[...users]
.sort((a,b)=>b.slotJackpots-a.slotJackpots)
.slice(0,10),
"slotJackpots"
);

renderLeaderboard(
slotProfitLeaderboard,
[...users]
.sort((a,b)=>b.slotProfit-a.slotProfit)
.slice(0,10),
"slotProfit"
);

}catch(error){

console.error(
"Toplista hiba:",
error
);

}

}

onAuthStateChanged(
auth,
(user)=>{

if(!user){

document.body.innerHTML = `
<div style="
display:flex;
justify-content:center;
align-items:center;
height:100vh;
font-size:32px;
color:white;
background:#000;">
🔒 Jelentkezz be!
</div>
`;

return;

}

loadLeaderboard();

}
);
