/* =========================
   TOAST
========================= */

const toast =
document.getElementById(
"toast"
);

function showToast(text){

if(!toast){
return;
}

toast.textContent =
text;

toast.classList.add(
"show"
);

setTimeout(()=>{

toast.classList.remove(
"show"
);

},2500);

}

/* =========================
   COPY WALLET
========================= */

async function copyWallet(id){

try{

const element =
document.getElementById(id);

if(!element){

showToast(
"❌ Wallet nem található"
);

return;

}

const address =
element.textContent.trim();

await navigator.clipboard.writeText(
address
);

showToast(
"📋 Wallet cím másolva"
);

}catch(error){

console.error(error);

showToast(
"❌ Másolási hiba"
);

}

}

/* =========================
   GLOBAL
========================= */

window.copyWallet =
copyWallet;

/* =========================
   OPTIONAL
========================= */

console.log(
"💎 Donation Center betöltve"
);
