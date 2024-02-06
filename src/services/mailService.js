import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

class MailService{

    constructor(){
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_CLIENT,
                pass: process.env.EMAIL_PASS
            }
        })
    }

    async sendActivationMail(to, link){
        await this.transporter.sendMail({
            from: process.env.EMAIL_CLIENT,
            to,
            subject: 'activation link',
            text: '',
            html: 
                `
                <div>
                    <h1>Click to the link below to activate your account</h1>
                    <a href="${link}">${link}</a> 
                </div>
                `
        })
    }
    
}

export default new MailService()