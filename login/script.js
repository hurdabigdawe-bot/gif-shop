import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {

apiKey: "AIzaSyBoIILW2sbfyuSSvK108YAxnLPB_GlZZP0",

authDomain: "game-6df94.firebaseapp.com",

projectId: "game-6df94",

storageBucket: "game-6df94.firebasestorage.app",

messagingSenderId: "443187158566",

appId: "1:443187158566:web:2e055a515f29b5021110e7"

};

const app =
initializeApp(firebaseConfig);

const auth =
getAuth(app);

const email =
document.getElementById("email");

const password =
document.getElementById("password");

const message =
document.getElementById("message");

document
.getElementById("registerBtn")
.addEventListener("click", async ()=>{

try{

await createUserWithEmailAndPassword(
auth,
email.value,
password.value
);

message.innerText =
"✅ Sikeres regisztráció!";

}catch(error){

message.innerText =
error.message;

}

});

document
.getElementById("loginBtn")
.addEventListener("click", async ()=>{

try{

await signInWithEmailAndPassword(
auth,
email.value,
password.value
);

message.innerText =
"✅ Sikeres bejelentkezés!";

window.location.href =
"/";

}catch(error){

message.innerText =
error.message;

}

});
