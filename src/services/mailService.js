import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

class MailService{

    constructor(){
        this.transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secureConnection: true,
            auth: {
                user: process.env.EMAIL_CLIENT,
                pass: process.env.EMAIL_PASS
            }
        })
    }

    async sendActivationMail(to, activationCode) {
        console.log('sending activation mail to', to);
        await this.transporter.sendMail({
            from: process.env.EMAIL_CLIENT,
            to,
            subject: 'INTHEDAY Activation Code',
            text: `Your activation code is: ${activationCode}`,
            html: `
                <div>
                    <h1>Use the following activation code to activate your account</h1>
                    <p><strong>Activation Code:</strong> ${activationCode}</p>
                </div>
            `,
        })
    }
    
}

export default new MailService()