import {isSignatureCompatible} from '../services/webhookHandler.js'
import dotenv from 'dotenv'
import getRawBody from 'raw-body'
import contentType from 'content-type'
dotenv.config()

export const webhook = (req,res, next) => {
    //const body = JSON.stringify(req.body);
    const body = getRawBody(req, {
        length: req.headers['content-length'],
        limit: '1mb',
        encoding: contentType.parse(req).parameters.charset
      },  (err, string) =>{
        if (err) return (err)
        return string
        
      })
    const headers = req.headers
    const webhookSecret = process.env.SUMSUB_PRIVATE_KEY
    console.log('body: ', body)
    const isSignatureValid = isSignatureCompatible(webhookSecret, headers, body);

    if (isSignatureValid) {
        // Обробка вхідного вебхуку тут
        console.log('Webhook received and signature is valid!');
        console.log('Webhook data:', req.body);
        res.status(200).send('Webhook received and signature is valid!');
    } else {
        // Неправильна сумісність підпису - можливо, це атака
        console.log('Invalid signature. Possible security threat!');
        res.status(403).send('Invalid signature');
    }

}