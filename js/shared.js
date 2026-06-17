/* =========================
   RANK
========================= */

export function getRank(credits){

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

/* =========================
   FORMAT NUMBER
========================= */

export function formatNumber(value){

return Number(
value || 0
).toLocaleString(
"hu-HU"
);

}

/* =========================
   FORMAT DATE
========================= */

export function formatDate(timestamp){

if(!timestamp){
return "-";
}

const date =
new Date(timestamp);

return date.toLocaleDateString(
"hu-HU"
);

}

/* =========================
   WIN RATE
========================= */

export function calculateWinRate(
wins,
losses
){

const total =
wins + losses;

if(total <= 0){
return "0.0";
}

return (
(wins / total) * 100
).toFixed(1);

}

/* =========================
   GAMES PLAYED
========================= */

export function calculateGames(
wins,
losses
){

return wins + losses;

}

/* =========================
   DAILY STREAK
========================= */

export const DAILY_REWARDS = {

1: 1000,
2: 1500,
3: 2000,
4: 3000,
5: 5000,
6: 7500,
7: 10000

};

export function getDailyReward(
streak
){

return (
DAILY_REWARDS[streak] ||
1000
);

}

/* =========================
   TOAST
========================= */

export function showToast(
text
){

let toast =
document.getElementById(
"toast"
);

if(!toast){

toast =
document.createElement(
"div"
);

toast.id =
"toast";

toast.className =
"toast";

document.body
.appendChild(
toast
);

}

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
   ACHIEVEMENTS
========================= */

export const achievementData = {

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

/* =========================
   ACHIEVEMENT PREVIEW
========================= */

export function getAchievementPreview(
list
){

if(
!list ||
list.length === 0
){

return "Még nincs achievement.";

}

const latest =
list[list.length - 1];

if(
achievementData[latest]
){

return achievementData[
latest
].name;

}

return (
list.length +
" achievement"
);

}
