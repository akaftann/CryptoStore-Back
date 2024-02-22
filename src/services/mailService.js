import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

class MailService{

    constructor(){
        this.transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_CLIENT,
                pass: process.env.EMAIL_PASS
            }
        })
    }

    async sendActivationMail(to, link){
        await this.transporter.sendMail({
            from: "no-reply",
            to,
            subject: 'activation link',
            text: '',
            html: 
                `git status
                <div>
                    <h1>Click to the link below to activate your account</h1>
                    <a href="${link}">${link}</a> 
                </div>
                `
        })
    }
    
}

export default new MailService()