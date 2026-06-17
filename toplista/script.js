import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

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
const db = getFirestore(app);

const blackjackLeaderboard =
document.getElementById(
"blackjackLeaderboard"
);

const flappyLeaderboard =
document.getElementById(
"flappyLeaderboard"
);

const creditsLeaderboard =
document.getElementById(
"creditsLeaderboard"
);

function getDisplayName(email){

if(!email)
return "Ismeretlen";

return email.split("@")[0];

}

function medalClass(index){

if(index === 0)
return "gold";

if(index === 1)
return "silver";

if(index === 2)
return "bronze";

return "";

}

function medal(index){

if(index === 0)
return "🥇";

if(index === 1)
return "🥈";

if(index === 2)
return "🥉";

return "#" + (index + 1);

}

function renderLeaderboard(
container,
players,
field
){

if(players.length === 0){

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
${getDisplayName(player.email)}
</div>

<div class="score">
${player[field]}
</div>

</div>

`;

});

container.innerHTML =
html;

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

email:
data.email || "ismeretlen",

credits:
data.credits || 0,

wins:
data.wins || 0,

losses:
data.losses || 0,

flappyBest:
data.flappyBest || 0

});

});

const blackjack =
[...users]
.sort(
(a,b)=>
b.wins - a.wins
)
.slice(0,10);

const flappy =
[...users]
.sort(
(a,b)=>
b.flappyBest -
a.flappyBest
)
.slice(0,10);

const credits =
[...users]
.sort(
(a,b)=>
b.credits -
a.credits
)
.slice(0,10);

renderLeaderboard(
blackjackLeaderboard,
blackjack,
"wins"
);

renderLeaderboard(
flappyLeaderboard,
flappy,
"flappyBest"
);

renderLeaderboard(
creditsLeaderboard,
credits,
"credits"
);

}catch(error){

console.error(error);

blackjackLeaderboard.innerHTML =
'<div class="empty">Hiba</div>';

flappyLeaderboard.innerHTML =
'<div class="empty">Hiba</div>';

creditsLeaderboard.innerHTML =
'<div class="empty">Hiba</div>';

}

}

loadLeaderboard();
