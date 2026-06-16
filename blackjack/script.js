import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
  getFirestore,
  doc,
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

const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");

document.getElementById("registerBtn").addEventListener("click", async () => {

  try {

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );

    await setDoc(
      doc(
        db,
        "users",
        userCredential.user.uid
      ),
      {
        email: email.value,
        credits: 5000,
        wins: 0,
        losses: 0,
        createdAt: Date.now()
      }
    );

    message.innerText =
      "✅ Sikeres regisztráció!";

  } catch(error) {

    console.error(error);

    alert(
      error.code + "\n" +
      error.message
    );

    message.innerText =
      error.code;
  }

});

document.getElementById("loginBtn").addEventListener("click", async () => {

  try {

    await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    message.innerText =
      "✅ Sikeres bejelentkezés!";

    setTimeout(() => {

      window.location.href = "/";

    }, 1000);

  } catch(error) {

    console.error(error);

    alert(
      error.code + "\n" +
      error.message
    );

    message.innerText =
      error.code;
  }

});
