import * as payments from '../services/stripe.js'

export const checkout = async (req,res) => {
    const items = req.body
    try{
        const session = await payments.createCheckout(items.items)
        res.json({url: session.url})
    }catch(e){
        res.status(500).json({error:e.message})
    }
}

export const webhooks = async(req, res) => {
    const payload = req.body
    try{
        const sig = req.headers['stripe-signature']
        const res = await payments.webhook(payload, sig)
        res.status(200).json(res)
    }catch(e){
        res.status(500).json({error:e.message})
    }
}