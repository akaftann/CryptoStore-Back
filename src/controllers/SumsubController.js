import {isSignatureCompatible} from '../services/webhookHandler.js'
import dotenv from 'dotenv'
import { verifyStatus } from '../services/users.js'
dotenv.config()

export const webhook = async (req,res, next) => {
    const body = req.body
    const headers = req.headers
    const webhookSecret = process.env.SUMSUB_PRIVATE_KEY
    const rawBodyBuffer = Buffer.from(req.body);
    const rawBodyString = rawBodyBuffer.toString('utf-8');
    const parsedJson = JSON.parse(rawBodyString);
    const isSignatureValid = isSignatureCompatible(webhookSecret, headers, body);

    if (!isSignatureValid) {
        console.log('Invalid signature. Possible security threat!');
        res.status(403).send('Invalid signature');
    }
    console.log('Webhook received and signature is valid!');
    if(parsedJson.reviewStatus==="completed" && parsedJson.reviewResult.reviewAnswer==="GREEN"){
        console.log('Activation of verification users status...');
        await verifyStatus(parsedJson.externalUserId)
    }
    
    console.log('Webhook data:', parsedJson);
    res.status(200).send('Webhook received and signature is valid!');

}