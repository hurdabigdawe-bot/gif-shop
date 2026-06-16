let balance = 1000;
let currentBet = 10;

let deck = [];
let hand = [];

let holds = [false,false,false,false,false];

let firstDeal = true;

const suits = ["♠","♥","♦","♣"];
const values = [
    "A","K","Q","J",
    "10","9","8","7",
    "6","5","4","3","2"
];

function createDeck(){

    deck = [];

    for(const suit of suits){

        for(const value of values){

            deck.push({
                suit,
                value
            });

        }
    }

}

function shuffleDeck(){

    for(let i=deck.length-1;i>0;i--){

        const j =
            Math.floor(
                Math.random()*(i+1)
            );

        [deck[i],deck[j]] =
        [deck[j],deck[i]];
    }

}

function drawCard(){

    return deck.pop();

}

function renderHand(){

    hand.forEach((card,index)=>{

        const el =
            document.getElementById(
                `card${index}`
            );

        el.innerHTML =
            `${card.value}${card.suit}`;

        if(
            card.suit === "♥" ||
            card.suit === "♦"
        ){
            el.style.color = "red";
        }else{
            el.style.color = "black";
        }

    });

}

function updateBalance(){

    document.getElementById(
        "balance"
    ).innerText = balance;

}

function updateBet(){

    document.getElementById(
        "bet"
    ).innerText = currentBet;

}

function deal(){

    if(balance < currentBet){

        alert(
            "Nincs elég zseton!"
        );

        return;
    }

    balance -= currentBet;

    updateBalance();

    createDeck();

    shuffleDeck();

    hand = [];

    for(let i=0;i<5;i++){

        hand.push(
            drawCard()
        );

    }

    holds =
    [false,false,false,false,false];

    document
    .querySelectorAll(".hold-btn")
    .forEach(btn=>{

        btn.style.background =
        "";

    });

    renderHand();

    firstDeal = false;

    document
    .getElementById("result")
    .innerText =
    "Válassz HOLD lapokat vagy húzz!";

}

function draw(){

    if(firstDeal) return;

    for(let i=0;i<5;i++){

        if(!holds[i]){

            hand[i] =
                drawCard();

        }

    }

    renderHand();

    checkHand();

    firstDeal = true;

}

function checkHand(){

    const counts = {};

    hand.forEach(card=>{

        counts[card.value] =
            (counts[card.value] || 0) + 1;

    });

    const valuesCount =
        Object.values(counts);

    let result =
        "Nincs nyeremény";

    let win = 0;

    if(valuesCount.includes(4)){

        result = "🃏 PÓKER!";
        win = currentBet * 25;

    }
    else if(valuesCount.includes(3)){

        result = "🎉 DRILL!";
        win = currentBet * 8;

    }
    else if(
        valuesCount.filter(
            x=>x===2
        ).length >= 2
    ){

        result = "🎉 KÉT PÁR!";
        win = currentBet * 4;

    }
    else if(valuesCount.includes(2)){

        result = "🎉 PÁR!";
        win = currentBet * 2;

    }

    balance += win;

    updateBalance();

    document
    .getElementById("result")
    .innerHTML =
    `${result}<br>💰 +${win}`;

}

document
.getElementById("dealBtn")
.addEventListener(
"click",
deal
);

document
.getElementById("drawBtn")
.addEventListener(
"click",
draw
);

document
.querySelectorAll(".hold-btn")
.forEach(btn=>{

    btn.addEventListener(
    "click",
    ()=>{

        const index =
            Number(
                btn.dataset.index
            );

        holds[index] =
            !holds[index];

        btn.style.background =
            holds[index]
            ? "#00ff88"
            : "";

    });

});

document
.querySelectorAll(".bet-btn")
.forEach(btn=>{

    btn.addEventListener(
    "click",
    ()=>{

        currentBet =
            Number(
                btn.dataset.bet
            );

        updateBet();

    });

});

updateBalance();
updateBet();
