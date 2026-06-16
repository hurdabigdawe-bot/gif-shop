import {
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

export async function saveUserData(
db,
currentUser,
balance,
wins,
losses
){

if(!currentUser) return;

try{

await updateDoc(
doc(
db,
"users",
currentUser.uid
),
{
credits: balance,
wins: wins,
losses: losses
}
);

}catch(error){

console.error(
"Mentési hiba:",
error
);

}

}
