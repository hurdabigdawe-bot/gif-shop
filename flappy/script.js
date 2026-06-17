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
updateDoc
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

const canvas =
document.getElementById("gameCanvas");

const ctx =
canvas.getContext("2d");

const startScreen =
document.getElementById("startScreen");

const gameOverScreen =
document.getElementById("gameOverScreen");

const startBtn =
document.getElementById("startBtn");

const restartBtn =
document.getElementById("restartBtn");

const scoreEl =
document.getElementById("score");

const finalScoreEl =
document.getElementById("finalScore");

const bestScoreEl =
document.getElementById("bestScore");

const rewardEl =
document.getElementById("reward");

const loginLink =
document.getElementById("loginLink");

const userInfo =
document.getElementById("userInfo");

const logoutBtn =
document.getElementById("logoutBtn");

let currentUser = null;
let credits = 0;
let bestScore = 0;

function resizeCanvas(){

canvas.width =
window.innerWidth;

canvas.height =
window.innerHeight;

}

resizeCanvas();

window.addEventListener(
"resize",
resizeCanvas
);

const bird = {
x: 140,
y: 300,
radius: 22,
velocity: 0,
gravity: 0.35,
jump: -8
};

let pipes = [];
let score = 0;
let gameRunning = false;
let animationId = null;

function resetGame(){

bird.y =
canvas.height / 2;

bird.velocity = 0;

pipes = [];

score = 0;

scoreEl.textContent =
"0";

for(
let i = 0;
i < 4;
i++
){

createPipe(
canvas.width +
(i * 500)
);

}

}

function createPipe(x){

const gap = 320;

const topHeight =
Math.random() *
(canvas.height - 500)
+ 100;

pipes.push({

x,

width: 90,

topHeight,

bottomY:
topHeight + gap,

passed:false

});

}

function jump(){

if(!gameRunning)
return;

bird.velocity =
bird.jump;

}

function update(){

bird.velocity +=
bird.gravity;

bird.y +=
bird.velocity;

if(
bird.y < 0 ||
bird.y > canvas.height
){

gameOver();
return;

}

pipes.forEach(pipe=>{

pipe.x -= 2.5;

if(
!pipe.passed &&
pipe.x + pipe.width <
bird.x
){

pipe.passed = true;

score++;

scoreEl.textContent =
score;

}

if(

bird.x + 10 >
pipe.x &&

bird.x - 10 <
pipe.x + pipe.width

){

if(

bird.y - bird.radius <
pipe.topHeight ||

bird.y + bird.radius >
pipe.bottomY

){

gameOver();

}

}

});

if(
pipes.length &&
pipes[0].x < -120
){

pipes.shift();

createPipe(
pipes[
pipes.length - 1
].x + 500
);

}

}

function draw(){

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);

ctx.fillStyle =
"#3fa34d";

pipes.forEach(pipe=>{

ctx.fillRect(
pipe.x,
0,
pipe.width,
pipe.topHeight
);

ctx.fillRect(
pipe.x,
pipe.bottomY,
pipe.width,
canvas.height
);

});

ctx.font =
"50px Arial";

ctx.textAlign =
"center";

ctx.fillText(
"🐦",
bird.x,
bird.y + 18
);

}

function gameLoop(){

update();

draw();

if(gameRunning){

animationId =
requestAnimationFrame(
gameLoop
);

}

}
