let balance = 1000;
let bet = 10;

let deck = [];
let player = [];
let dealer = [];

let gameActive = false;

const suits = ["♠","♥","♦","♣"];
const values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

function updateBalance(){
document.getElementById("balance").textContent = balance;
}

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

for(let i=deck.length-1;i>0;i--){

const j =
Math.floor(Math.random()*(i+1));

[deck[i],deck[j]] =
[deck[j],deck[i]];

}

}

function drawCard(){
return deck.pop();
}

function getValue(card){

if(["J","Q","K"].includes(card.value))
return 10;

if(card.value === "A")
return 11;

return Number(card.value);
}

function handValue(hand){

let total = 0;
let aces = 0;

hand.forEach(card=>{

total += getValue(card);

if(card.value==="A")
aces++;

});

while(total>21 && aces>0){

total -= 10;
aces--;

}

return total;
}

function renderCards(){

const playerArea =
document.getElementById("playerCards");

const dealerArea =
document.getElementById("dealerCards");

playerArea.innerHTML="";
dealerArea.innerHTML="";

player.forEach(card=>{

const div =
document.createElement("div");

div.className="card";

div.textContent =
card.value + card.suit;

playerArea.appendChild(div);

});

dealer.forEach((card,index)=>{

const div =
document.createElement("div");

if(index===1 && gameActive){

div.className =
"card hidden";

div.textContent="??";

}else{

div.className="card";

div.textContent=
card.value+card.suit;

}

dealerArea.appendChild(div);

});

document.getElementById(
"playerScore"
).textContent =
"Pont: " + handValue(player);

if(gameActive){

document.getElementById(
"dealerScore"
).textContent =
"Pont: ?";

}else{

document.getElementById(
"dealerScore"
).textContent =
"Pont: " + handValue(dealer);

}

}

function deal(){

if(gameActive) return;

if(balance < bet){

alert("Nincs elég zseton!");

return;
}

balance -= bet;

updateBalance();

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

renderCards();

document.getElementById(
"message"
).textContent =
"Lapot kérsz vagy megállsz?";
}

function hit(){

if(!gameActive) return;

player.push(drawCard());

renderCards();

if(handValue(player)>21){

gameActive=false;

renderCards();

document.getElementById(
"message"
).textContent =
"💥 BUST! Vesztettél.";
}

}

function stand(){

if(!gameActive) return;

gameActive=false;

while(
handValue(dealer)<17
){

dealer.push(drawCard());

}

renderCards();

const playerScore =
handValue(player);

const dealerScore =
handValue(dealer);

let msg="";

if(dealerScore>21){

msg="🎉 Dealer bust! Nyertél!";
balance += bet*2;

}
else if(playerScore>dealerScore){

msg="🏆 Nyertél!";
balance += bet*2;

}
else if(playerScore===dealerScore){

msg="🤝 Döntetlen";
balance += bet;

}
else{

msg="😢 Vesztettél";

}

updateBalance();

document.getElementById(
"message"
).textContent =
msg;
}

document
.querySelectorAll(".bet-btn")
.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

if(gameActive) return;

bet =
Number(btn.dataset.bet);

document.getElementById(
"betValue"
).textContent =
bet;

});

});

document
.getElementById("dealBtn")
.addEventListener("click",deal);

document
.getElementById("hitBtn")
.addEventListener("click",hit);

document
.getElementById("standBtn")
.addEventListener("click",stand);

updateBalance();
