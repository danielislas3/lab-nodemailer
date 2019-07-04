const nodemailer= require('nodemailer')
require('dotenv').config()


const trasporter = nodemailer.createTransport({
  service:'SendGrid',
  auth:{
    user:process.env.USR,
    pass:process.env.PASS
  }
})

exports.sendToken=(email,token)=>{
  return trasporter.sendMail({
      subject:"Confirmacion de cuenta",
      from: '"Tu ceunta fake.com" <staf@ironhacks.com>',
      to:email,
      html:`
      <h1>click <a href="http://localhost:3000/auth/confirm/${token}">aqui</a> para confirmar 🤓</h1>`
    })
  }