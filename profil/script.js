import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
getAuth,
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
getFirestore,
doc,
getDoc
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

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location.href="/login/";
return;

}

const userDoc =
await getDoc(
doc(
db,
"users",
user.uid
)
);

if(!userDoc.exists()) return;

const data =
userDoc.data();

document.getElementById("email")
.textContent =
data.email;

document.getElementById("credits")
.textContent =
data.credits || 0;

document.getElementById("wins")
.textContent =
data.wins || 0;

document.getElementById("losses")
.textContent =
data.losses || 0;

const totalGames =
(data.wins || 0) +
(data.losses || 0);

let rate = 0;

if(totalGames > 0){

rate =
Math.round(
(data.wins / totalGames) * 100
);

}

document.getElementById("winrate")
.textContent =
rate + "%";

if(data.createdAt){

const date =
new Date(data.createdAt);

document.getElementById("createdAt")
.textContent =
date.toLocaleDateString("hu-HU");

}

});
