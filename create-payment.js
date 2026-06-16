const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async () => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "huf",
            product_data: {
              name: "Vicces GIF + Hang Csomag"
            },
            unit_amount: 1000 * 100 // 1000 Ft
          },
          quantity: 1
        }
      ],

      mode: "payment",

      success_url:
        "https://SAJATOLDALAD.netlify.app/?success=true",

      cancel_url:
        "https://SAJATOLDALAD.netlify.app/?cancel=true"
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        paymentUrl: session.url
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message
      })
    };
  }
};
