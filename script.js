const btn = document.getElementById("buyBtn");

btn.addEventListener("click", async () => {

    const response = await fetch("/api/create-payment");

    const data = await response.json();

    window.location.href = data.paymentUrl;

});

const params = new URLSearchParams(window.location.search);

if(params.get("success")){

    const gifCount = 1000;
    const soundCount = 1000;

    const gif =
        Math.floor(Math.random()*gifCount)+1;

    const sound =
        Math.floor(Math.random()*soundCount)+1;

    document.getElementById("reward").style.display="block";

    document.getElementById("gifImage").src =
        `/gifs/gif${gif}.gif`;

    document.getElementById("audio").src =
        `/sounds/sound${sound}.mp3`;
}
