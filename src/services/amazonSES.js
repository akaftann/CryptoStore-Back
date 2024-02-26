import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import dotenv from 'dotenv'
dotenv.config()

const SES_CONFIG = {
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_SES_REGION,
}

const sesClient = new SESClient(SES_CONFIG)

export const sendMail = async (recipientMail, link)=>{
    console.log('sender is : ', process.env.AWS_SES_SENDER)
    let params = {
        Source: process.env.AWS_SES_SENDER,
        Destination: {
            ToAddresses: [recipientMail],
        },
        ReplyToAddresses: [],
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `
                            <div>
                                <h1>Click to the link below to activate your account</h1>
                                <a href="${link}">${link}</a> 
                            </div>
                          `
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Activation link'
            }
        }
    }

    try{
        const sendEmailComand = new SendEmailCommand(params)
        const res = await sesClient.send(sendEmailComand)
        console.log('Email has benn sent: ', res)
    }catch(e){
        console.error(e)
    }
}