import {isSignatureCompatible} from '../services/webhookHandler.js'
import dotenv from 'dotenv'
dotenv.config()

export const webhook = async (req,res, next) => {
    //const body = JSON.stringify(req.body);
    const body = req.body

    const headers = req.headers
    const webhookSecret = process.env.SUMSUB_PRIVATE_KEY
    const rawBodyBuffer = Buffer.from(req.body);
    const rawBodyString = rawBodyBuffer.toString('utf-8');
    const parsedJson = JSON.parse(rawBodyString);
    const isSignatureValid = isSignatureCompatible(webhookSecret, headers, body);

    if (isSignatureValid) {
        // Обробка вхідного вебхуку тут
        console.log('Webhook received and signature is valid!');
        console.log('Webhook data:', parsedJson);
        res.status(200).send('Webhook received and signature is valid!');
    } else {
        // Неправильна сумісність підпису - можливо, це атака
        console.log('Invalid signature. Possible security threat!');
        res.status(403).send('Invalid signature');
    }

}