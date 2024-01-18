import stripe from "stripe"

const stripeInstance = stripe(process.env.STRIPE_PRIVATE_KEY)

export const createCheckout = async (items) => {
    console.log('starting checkout...', items)
    try{
        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types:["card"],
            mode:"payment",
            line_items: items.map(item => {
                return{
                    price_data:{
                        currency:"usd",
                        product_data:{
                            name: item.name
                        },
                        unit_amount: (item.price)*100,

                    },
                    quantity: item.quantity
                }
            }),
            success_url: 'http://localhost:5173/',
            cancel_url: 'http://127.0.0.1:5173/cancel'
        })

        return session

    }catch(e){
     throw new Error(e)
    }
}

export const webhook = async(payload, sig) => {
    try {
        const event = stripeInstance.webhooks.constructEvent(payload, sig, process.env.STRIPE_ENDPOINT_SECRET)
    
        if (event.type === 'checkout.session.completed') {
          const session = event.data.object;
    
          // Оплата успішна. Тут ви можете виконати код для обробки успішної оплати.
          console.log('Payment succeeded:', session.id);
        }
    
        return 'success'
      } catch (err) {
        console.error('Error handling webhook:', err.message);
        
      }
}