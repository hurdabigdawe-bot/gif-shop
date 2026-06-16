let balance = 1000;
let currentBet = 10;

let deck = [];

let player = [];
let dealer = [];

const suits = ["♠","♥","♦","♣"];

const values = [
"A","2","3","4","5",
"6","7","8","9","10",
"J","Q","K"
];

function createDeck(){

deck=[];

for(const suit of suits){

for(const value of values){

deck.push({
value,
suit
});

}

}

}

function shuffle(){

for(let i=deck.length-1;i>0;i--){

const j=
Math.floor(Math.random()*(i+1));

[deck[i],deck[j]]=
[deck[j],deck[i]];

}

}

function draw(){

return deck.pop();

}

function cardValue(card){

if(
card.value==="J"||
card.value==="Q"||
card.value==="K"
){
return 10;
}

if(card.value==="A"){
return 11;
}

return Number(card.value);

}

function handValue(hand){

let total=0;
let aces=0;

for(const card of hand){

total+=cardValue(card);

if(card.value==="A"){
aces++;
}

}

while(total>21 && aces>0){

total-=10;
aces--;

}

return total;

}

function renderCards(){

const playerArea=
document.getElementById("player-cards");

const dealerArea=
document.getElementById("dealer-cards");

playerArea.innerHTML="";
dealerArea.innerHTML="";

player.forEach(card=>{

const div=
document.createElement("div");

div.className="card";

div.innerHTML=
card.value+card.suit;

playerArea.appendChild(div);

});

dealer.forEach(card=>{

const div=
document.createElement("div");

div.className="card";

div.innerHTML=
card.value+card.suit;

dealerArea.appendChild(div);

});

document.getElementById(
"player-score"
).innerHTML=
"Pont: "+handValue(player);

document.getElementById(
"dealer-score"
).innerHTML=
"Pont: "+handValue(dealer);

}

function updateBalance(){

document.getElementById(
"balance"
).innerText=
balance;

}

function deal(){

if(balance<currentBet){

alert("Nincs elég zseton!");

return;
}

balance-=currentBet;

updateBalance();

createDeck();
shuffle();

player=[
draw(),
draw()
];

dealer=[
draw(),
draw()
];

renderCards();

document.getElementById(
"result"
).innerHTML=
"➕ Kérsz még lapot?";

}

function hit(){

player.push(draw());

renderCards();

if(handValue(player)>21){

document.getElementById(
"result"
).innerHTML=
"💥 VESZTETTÉL!";

}

}

function stand(){

while(
handValue(dealer)<17
){

dealer.push(draw());

}

renderCards();

const p=
handValue(player);

const d=
handValue(dealer);

let result="";

if(d>21){

result="🎉 NYERTÉL!";
balance+=currentBet*2;

}
else if(p>d){

result="🏆 NYERTÉL!";
balance+=currentBet*2;

}
else if(p===d){

result="🤝 DÖNTETLEN";
balance+=currentBet;

}
else{

result="😢 VESZTETTÉL";

}

updateBalance();

document.getElementById(
"result"
).innerHTML=
result;

}

document
.querySelectorAll(".bet-btn")
.forEach(btn=>{

btn.onclick=()=>{

currentBet=
Number(
btn.dataset.bet
);

document.getElementById(
"bet"
).innerText=
currentBet;

};

});

document
.getElementById("dealBtn")
.onclick=deal;

document
.getElementById("hitBtn")
.onclick=hit;

document
.getElementById("standBtn")
.onclick=stand;

updateBalance();
