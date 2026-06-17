import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

/* =========================
   FIREBASE CONFIG
========================= */

const firebaseConfig = {

apiKey:
"AIzaSyBoIILW2sbfyuSSvK108YAxnLPB_GlZZP0",

authDomain:
"game-6df94.firebaseapp.com",

projectId:
"game-6df94",

storageBucket:
"game-6df94.firebasestorage.app",

messagingSenderId:
"443187158566",

appId:
"1:443187158566:web:2e055a515f29b5021110e7"

};

/* =========================
   INIT
========================= */

const app =
initializeApp(
firebaseConfig
);

const auth =
getAuth(app);

const db =
getFirestore(app);

/* =========================
   EXPORTS
========================= */

export {
app,
auth,
db
};
