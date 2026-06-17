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
arrayUnion
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

/* =========================
   UI
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
   GAME
========================= */

let balance = 0;
let wins = 0;
let losses = 0;

let bet = 100;

let deck = [];
let player = [];
let dealer = [];

let gameActive = false;
let doubleUsed = false;

let currentUser = null;

/* =========================
   CARDS
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

if(!toast){
return;
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
   RANK
========================= */

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

function updateRank(){

if(userRank){

userRank.textContent =
getRank(balance);

}

}

/* =========================
   UI UPDATE
========================= */

function updateBalance(){

if(balanceElement){

balanceElement.textContent =
Number(balance)
.toLocaleString("hu-HU");

}

if(userCredits){

userCredits.textContent =
"💰 " +
Number(balance)
.toLocaleString("hu-HU") +
" kredit";

}

updateRank();

}

function updateStats(){

if(winsElement){

winsElement.textContent =
wins;

}

if(lossesElement){

lossesElement.textContent =
losses;

}

const total =
wins + losses;

const rate =
total > 0
? ((wins / total) * 100).toFixed(1)
: "0.0";

if(winRateElement){

winRateElement.textContent =
rate + "%";

}

}

function setMessage(text){

if(messageElement){

messageElement.textContent =
text;

}

}

/* =========================
   FIRESTORE
========================= */

async function saveUser(){

if(!currentUser){
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
losses: losses,
blackjackGames:
wins + losses
}
);

}catch(error){

console.error(
"Mentési hiba:",
error
);

}

}

async function unlockAchievement(id){

if(!currentUser){
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
"🏅 Achievement: " + id
);

}catch(error){

console.error(error);

}

}

async function checkAchievements(){

if(wins >= 1){
await unlockAchievement("first_win");
}

if(wins >= 10){
await unlockAchievement("win_10");
}

if(balance >= 10000){
await unlockAchievement("silver_rank");
}

if(balance >= 50000){
await unlockAchievement("gold_rank");
}

}

/* =========================
   AUTH
========================= */

onAuthStateChanged(
auth,
async(user)=>{

if(!user){

if(loginLink){
loginLink.style.display =
"block";
}

if(userInfo){
userInfo.style.display =
"none";
}

return;

}

currentUser = user;

if(loginLink){
loginLink.style.display =
"none";
}

if(userInfo){
userInfo.style.display =
"flex";
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

if(snap.exists()){

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

if(userEmail){

userEmail.textContent =
"👤 " + username;

}

updateBalance();
updateStats();

if(achievementPreview){

achievementPreview.textContent =
"🏅 Achievement rendszer aktív";

}

}

}catch(error){

console.error(error);

}

}
);

if(logoutBtn){

logoutBtn.addEventListener(
"click",
async()=>{

await signOut(auth);

window.location.href =
"/";

}
);

}

/* =========================
   DECK
========================= */

function createDeck(){

deck = [];

for(const suit of suits){

for(const value of values){

deck.push({
value,
suit
});

}

}

for(
let i = deck.length - 1;
i > 0;
i--
){

const j =
Math.floor(
Math.random() *
(i + 1)
);

[
deck[i],
deck[j]
] =
[
deck[j],
deck[i]
];

}

}

function drawCard(){

return deck.pop();

}

/* =========================
   VALUES
========================= */

function getCardValue(card){

if(
["J","Q","K"]
.includes(card.value)
){
return 10;
}

if(card.value === "A"){
return 11;
}

return Number(card.value);

}

function handValue(hand){

let total = 0;
let aces = 0;

hand.forEach(card=>{

total +=
getCardValue(card);

if(card.value==="A"){
aces++;
}

});

while(
total > 21 &&
aces > 0
){

total -= 10;
aces--;

}

return total;

}

function isBlackjack(hand){

return (
hand.length === 2 &&
handValue(hand) === 21
);

}

/* =========================
   RENDER
========================= */

function renderCards(){

playerCardsElement.innerHTML =
"";

dealerCardsElement.innerHTML =
"";

player.forEach(card=>{

const div =
document.createElement("div");

div.className =
"card";

div.textContent =
card.value +
card.suit;

playerCardsElement
.appendChild(div);

});

dealer.forEach(
(card,index)=>{

const div =
document.createElement("div");

if(
gameActive &&
index === 1
){

div.className =
"card hidden";

div.textContent =
"🂠";

}
else{

div.className =
"card";

div.textContent =
card.value +
card.suit;

}

dealerCardsElement
.appendChild(div);

}
);

playerScoreElement.textContent =
"Pont: " +
handValue(player);

if(gameActive){

dealerScoreElement.textContent =
"Pont: ?";

}
else{

dealerScoreElement.textContent =
"Pont: " +
handValue(dealer);

}

}

/* =========================
   DEAL
========================= */

async function deal(){

if(gameActive){
return;
}

if(balance < bet){

showToast(
"❌ Nincs elég kredit"
);

return;

}

balance -= bet;

updateBalance();

await saveUser();

createDeck();

player = [
drawCard(),
drawCard()
];

dealer = [
drawCard(),
drawCard()
];

gameActive = true;
doubleUsed = false;

renderCards();

setMessage(
"🃏 Lapot kérsz vagy megállsz?"
);

const playerBJ =
isBlackjack(player);

const dealerBJ =
isBlackjack(dealer);

if(
playerBJ ||
dealerBJ
){

gameActive = false;

renderCards();

if(
playerBJ &&
dealerBJ
){

balance += bet;

updateBalance();

setMessage(
"🤝 Push - Blackjack"
);

return;

}

if(playerBJ){

const payout =
Math.floor(
bet * 2.5
);

balance += payout;

wins++;

updateBalance();
updateStats();

await saveUser();
await checkAchievements();

showToast(
"🃏 BLACKJACK!"
);

setMessage(
"🎉 Blackjack!"
);

return;

}

losses++;

updateStats();

await saveUser();

setMessage(
"😢 Dealer Blackjack"
);

}

}

/* =========================
   SOFT 17
========================= */

function isSoft17(hand){

let total = 0;
let aces = 0;

hand.forEach(card=>{

if(card.value === "A"){

aces++;
total += 11;

}
else if(
["J","Q","K"]
.includes(card.value)
){

total += 10;

}
else{

total += Number(card.value);

}

});

return (
total === 17 &&
aces > 0
);

}

/* =========================
   HIT
========================= */

async function hit(){

if(!gameActive){
return;
}

player.push(
drawCard()
);

renderCards();

const playerScore =
handValue(player);

if(playerScore > 21){

gameActive = false;

losses++;

updateStats();

await saveUser();

setMessage(
"💥 BUST! Vesztettél."
);

showToast(
"❌ Bust"
);

}

}

/* =========================
   STAND
========================= */

async function stand(){

if(!gameActive){
return;
}

gameActive = false;

while(

handValue(dealer) < 17 ||

isSoft17(dealer)

){

dealer.push(
drawCard()
);

}

renderCards();

const playerScore =
handValue(player);

const dealerScore =
handValue(dealer);

let resultText = "";

/* DEALER BUST */

if(dealerScore > 21){

balance +=
bet * 2;

wins++;

resultText =
"🎉 Dealer bust!";

}

/* PLAYER WIN */

else if(
playerScore >
dealerScore
){

balance +=
bet * 2;

wins++;

resultText =
"🏆 Nyertél!";

}

/* PUSH */

else if(
playerScore ===
dealerScore
){

balance += bet;

resultText =
"🤝 Döntetlen";

}

/* LOSS */

else{

losses++;

resultText =
"😢 Vesztettél";

}

updateBalance();
updateStats();

await saveUser();
await checkAchievements();

setMessage(
resultText
);

}

/* =========================
   DOUBLE DOWN
========================= */

async function doubleDown(){

if(!gameActive){
return;
}

if(doubleUsed){
return;
}

if(
player.length !== 2
){

showToast(
"⚠️ Csak az első körben használható"
);

return;

}

if(balance < bet){

showToast(
"❌ Nincs elég kredit"
);

return;

}

balance -= bet;

bet *= 2;

doubleUsed = true;

updateBalance();

betValueElement.textContent =
bet;

player.push(
drawCard()
);

renderCards();

if(
handValue(player) > 21
){

gameActive = false;

losses++;

updateStats();

await saveUser();

setMessage(
"💥 Double Bust!"
);

showToast(
"❌ Double Bust"
);

return;

}

await stand();

}

/* =========================
   BET BUTTONS
========================= */

document
.querySelectorAll(".bet-btn")
.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

if(gameActive){
return;
}

bet =
Number(
btn.dataset.bet
);

if(
betValueElement
){

betValueElement.textContent =
bet;

}

showToast(
"💰 Tét: " +
bet
);

}
);

});

/* =========================
   BUTTONS
========================= */

const dealBtn =
document.getElementById(
"dealBtn"
);

const hitBtn =
document.getElementById(
"hitBtn"
);

const standBtn =
document.getElementById(
"standBtn"
);

const doubleBtn =
document.getElementById(
"doubleBtn"
);

if(dealBtn){

dealBtn.addEventListener(
"click",
deal
);

}

if(hitBtn){

hitBtn.addEventListener(
"click",
hit
);

}

if(standBtn){

standBtn.addEventListener(
"click",
stand
);

}

if(doubleBtn){

doubleBtn.addEventListener(
"click",
doubleDown
);

}

/* =========================
   STARTUP
========================= */

updateBalance();

updateStats();

setMessage(
"🃏 Nyomd meg az Osztás gombot."
);

console.log(
"✅ Blackjack V3 betöltve"
);
