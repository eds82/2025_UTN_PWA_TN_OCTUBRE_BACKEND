import nodemailer from 'nodemailer'
import ENVIRONMENT from './environment.config.js'

//La configuarcion para nuestro mailer
const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: 'grossrull24@gmail.com',
            pass: ENVIRONMENT.GMAIL_PASSWORD
        }
    }
)


export default transporter