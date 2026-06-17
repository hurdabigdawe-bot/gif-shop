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
setDoc
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

radius: 24,

velocity: 0,

gravity: 0.32,

jump: -8

};

let pipes = [];

let score = 0;

let gameRunning = false;

let animationId = null;

const clouds = [];

for(
let i = 0;
i < 6;
i++
){

clouds.push({

x:
Math.random() *
window.innerWidth,

y:
Math.random() *
(window.innerHeight * 0.4),

size:
60 +
Math.random() * 80,

speed:
0.2 +
Math.random() * 0.5

});

}

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
(i * 550)
);

}

}

function createPipe(x){

const gap = 340;

const topHeight =
Math.random() *
(canvas.height - 550)
+ 120;

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

function updateClouds(){

clouds.forEach(cloud=>{

cloud.x -=
cloud.speed;

if(
cloud.x <
-cloud.size
){

cloud.x =
canvas.width +
100;

cloud.y =
Math.random() *
(canvas.height * 0.4);

}

});

}

function update(){

updateClouds();

bird.velocity +=
bird.gravity;

bird.y +=
bird.velocity;

if(
bird.y < 0 ||
bird.y >
canvas.height
){

gameOver();
return;

}

pipes.forEach(pipe=>{

pipe.x -= 2;

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

bird.x + 12 >
pipe.x &&

bird.x - 12 <
pipe.x + pipe.width

){

if(

bird.y - 18 <
pipe.topHeight ||

bird.y + 18 >
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
].x + 550
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

clouds.forEach(cloud=>{

ctx.fillStyle =
"rgba(255,255,255,.8)";

ctx.beginPath();

ctx.arc(
cloud.x,
cloud.y,
cloud.size * .3,
0,
Math.PI * 2
);

ctx.arc(
cloud.x + 25,
cloud.y - 10,
cloud.size * .35,
0,
Math.PI * 2
);

ctx.arc(
cloud.x + 55,
cloud.y,
cloud.size * .3,
0,
Math.PI * 2
);

ctx.fill();

});

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
"52px Arial";

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
function calculateReward(){

if(score >= 100)
return 1000;

if(score >= 50)
return 500;

if(score >= 25)
return 150;

if(score >= 10)
return 50;

return 10;

}

async function saveResult(){

if(!currentUser)
return;

const reward =
calculateReward();

credits += reward;

const updateData = {

credits

};

if(score > bestScore){

bestScore = score;

updateData.flappyBest =
score;

}

try{

await updateDoc(
doc(
db,
"users",
currentUser.uid
),
updateData
);

}catch(error){

try{

await setDoc(
doc(
db,
"users",
currentUser.uid
),
{
credits,
flappyBest:
bestScore
},
{
merge:true
}
);

}catch(e){

console.error(e);

}

}

document.getElementById(
"userCredits"
).textContent =
"💰 " +
credits +
" kredit";

document.getElementById(
"userBest"
).textContent =
"🏆 Best: " +
bestScore;

rewardEl.textContent =
reward;

bestScoreEl.textContent =
bestScore;

}

async function gameOver(){

if(!gameRunning)
return;

gameRunning = false;

cancelAnimationFrame(
animationId
);

await saveResult();

finalScoreEl.textContent =
score;

gameOverScreen.classList
.remove("hidden");

}

function startGame(){

resetGame();

gameRunning = true;

startScreen.classList
.add("hidden");

gameOverScreen.classList
.add("hidden");

gameLoop();

}

startBtn.addEventListener(
"click",
startGame
);

restartBtn.addEventListener(
"click",
startGame
);

window.addEventListener(
"keydown",
e=>{

if(
e.code === "Space"
){

e.preventDefault();

if(gameRunning){

jump();

}

}

}
);

canvas.addEventListener(
"click",
()=>{

if(gameRunning){

jump();

}

}
);

canvas.addEventListener(
"touchstart",
e=>{

e.preventDefault();

if(gameRunning){

jump();

}

},
{
passive:false
}
);

onAuthStateChanged(
auth,
async(user)=>{

if(!user){

loginLink.style.display =
"block";

userInfo.style.display =
"none";

return;

}

currentUser = user;

loginLink.style.display =
"none";

userInfo.style.display =
"flex";

document.getElementById(
"userEmail"
).textContent =
"👤 " +
user.email;

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

credits =
data.credits || 0;

bestScore =
data.flappyBest || 0;

document.getElementById(
"userCredits"
).textContent =
"💰 " +
credits +
" kredit";

document.getElementById(
"userBest"
).textContent =
"🏆 Best: " +
bestScore;

}else{

await setDoc(
doc(
db,
"users",
user.uid
),
{
credits:0,
flappyBest:0
},
{
merge:true
}
);

}

}catch(error){

console.error(error);

}

}
);

logoutBtn.addEventListener(
"click",
async()=>{

try{

await signOut(
auth
);

}catch(error){

console.error(error);

}

window.location.href =
"/";

}
);
