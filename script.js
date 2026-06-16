const btn = document.getElementById("buyBtn");

btn.addEventListener("click", async () => {
  const response = await fetch("/api/create-payment");

  const data = await response.json();

  window.location.href = data.paymentUrl;
});
