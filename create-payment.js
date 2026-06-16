exports.handler = async () => {

    const BARION_POS_KEY =
        process.env.BARION_POS_KEY;

    const response = await fetch(
        "https://api.barion.com/v2/Payment/Start",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({

                POSKey: BARION_POS_KEY,

                PaymentType:"Immediate",

                GuestCheckOut:true,

                FundingSources:["All"],

                PaymentRequestId:
                    crypto.randomUUID(),

                Locale:"hu-HU",

                Currency:"HUF",

                RedirectUrl:
                    "https://gifzshop.netlify.app/?success=true",

                CallbackUrl:
                    "https://gifzshop.netlify.app/api/payment-success",

                Transactions:[
                    {
                        POSTransactionId:
                            crypto.randomUUID(),

                        Payee:"shop@example.com",

                        Total:1000,

                        Items:[
                            {
                                Name:"Vicces GIF Csomag",
                                Quantity:1,
                                Unit:"db",
                                UnitPrice:1000,
                                ItemTotal:1000
                            }
                        ]
                    }
                ]
            })
        }
    );

    const data = await response.json();

    return {
        statusCode:200,
        body:JSON.stringify({
            paymentUrl:data.GatewayUrl
        })
    };
};
