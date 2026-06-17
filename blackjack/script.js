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
  getDoc,
  updateDoc,
  increment
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

let balance = 0;
let bet = 10;

let deck = [];
let player = [];
let dealer = [];

let gameActive = false;

const suits = ["♠","♥","♦","♣"];
const values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

function updateBalance(){

  document.getElementById(
    "balance"
  ).textContent = balance;

  const credits =
    document.getElementById(
      "userCredits"
    );

  if(credits){

    credits.textContent =
      "💰 " + balance + " kredit";

  }

}

async function saveGameResult(result){

  const user = auth.currentUser;

  if(!user) return;

  try{

    const updateData = {
      credits: balance
    };

    if(result === "win"){
      updateData.wins =
        increment(1);
    }

    if(result === "loss"){
      updateData.losses =
        increment(1);
    }

    await updateDoc(
      doc(
        db,
        "users",
        user.uid
      ),
      updateData
    );

  }catch(error){

    console.error(
      "Mentési hiba:",
      error
    );

  }

}

onAuthStateChanged(
  auth,
  async(user)=>{

    const loginLink =
      document.getElementById(
        "loginLink"
      );

    const userInfo =
      document.getElementById(
        "userInfo"
      );

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

    document.getElementById(
      "userEmail"
    ).textContent =
      "👤 " + user.email;

    try{

      const userDoc =
        await getDoc(
          doc(
            db,
            "users",
            user.uid
          )
        );

      if(userDoc.exists()){

        balance =
          userDoc.data().credits || 0;

        updateBalance();

      }

    }catch(error){

      console.error(error);

    }

  }
);

document
  .getElementById(
    "logoutBtn"
  )
  .addEventListener(
    "click",
    async()=>{

      await signOut(auth);

      window.location.href="/";

    }
  );

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

    [deck[i],deck[j]] =
      [deck[j],deck[i]];

  }

}

function drawCard(){

  return deck.pop();

}

function getValue(card){

  if(
    ["J","Q","K"]
    .includes(card.value)
  ){
    return 10;
  }

  if(card.value==="A"){
    return 11;
  }

  return Number(card.value);

}

function handValue(hand){

  let total = 0;
  let aces = 0;

  hand.forEach(card=>{

    total +=
      getValue(card);

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

function renderCards(){

  const playerArea =
    document.getElementById(
      "playerCards"
    );

  const dealerArea =
    document.getElementById(
      "dealerCards"
    );

  playerArea.innerHTML = "";
  dealerArea.innerHTML = "";

  player.forEach(card=>{

    const div =
      document.createElement(
        "div"
      );

    div.className =
      "card";

    div.textContent =
      card.value +
      card.suit;

    playerArea.appendChild(
      div
    );

  });

  dealer.forEach(
    (card,index)=>{

      const div =
        document.createElement(
          "div"
        );

      if(
        index===1 &&
        gameActive
      ){

        div.className =
          "card hidden";

        div.textContent =
          "??";

      }else{

        div.className =
          "card";

        div.textContent =
          card.value +
          card.suit;

      }

      dealerArea.appendChild(
        div
      );

    }
  );

  document.getElementById(
    "playerScore"
  ).textContent =
    "Pont: " +
    handValue(player);

  document.getElementById(
    "dealerScore"
  ).textContent =
    gameActive
      ? "Pont: ?"
      : "Pont: " +
        handValue(dealer);

}
function deal(){

  if(gameActive){
    return;
  }

  if(balance < bet){

    alert(
      "Nincs elég kredit!"
    );

    return;
  }

  balance -= bet;

  updateBalance();

  saveGameResult(null);

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

async function hit(){

  if(!gameActive){
    return;
  }

  player.push(
    drawCard()
  );

  renderCards();

  if(
    handValue(player) > 21
  ){

    gameActive = false;

    renderCards();

    await saveGameResult(
      "loss"
    );

    document.getElementById(
      "message"
    ).textContent =
      "💥 BUST! Vesztettél.";

  }

}

async function stand(){

  if(!gameActive){
    return;
  }

  gameActive = false;

  while(
    handValue(dealer) < 17
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

  let msg = "";

  if(
    dealerScore > 21
  ){

    msg =
      "🎉 Dealer bust! Nyertél!";

    balance +=
      bet * 2;

    updateBalance();

    await saveGameResult(
      "win"
    );

  }
  else if(
    playerScore >
    dealerScore
  ){

    msg =
      "🏆 Nyertél!";

    balance +=
      bet * 2;

    updateBalance();

    await saveGameResult(
      "win"
    );

  }
  else if(
    playerScore ===
    dealerScore
  ){

    msg =
      "🤝 Döntetlen";

    balance += bet;

    updateBalance();

    await saveGameResult(
      null
    );

  }
  else{

    msg =
      "😢 Vesztettél";

    await saveGameResult(
      "loss"
    );

  }

  document.getElementById(
    "message"
  ).textContent =
    msg;

}
document
  .querySelectorAll(
    ".bet-btn"
  )
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

        document.getElementById(
          "betValue"
        ).textContent =
          bet;

      }
    );

  });

document
  .getElementById(
    "dealBtn"
  )
  .addEventListener(
    "click",
    deal
  );

document
  .getElementById(
    "hitBtn"
  )
  .addEventListener(
    "click",
    hit
  );

document
  .getElementById(
    "standBtn"
  )
  .addEventListener(
    "click",
    stand
  );

updateBalance();
