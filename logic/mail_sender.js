import nodemailer from "nodemailer"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"


const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({path: path.resolve(__dirname, '../.env')})

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
})

export const sendMail = async (to, subject, text, html) => {
    let mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: to,
        subject: subject,
        text: text,
        html: html
    }
      
    transporter.sendMail(mailOptions, function(error){
        if (error) {
            console.log(error)
        }
    })
}

