const nodemailer = require('nodemailer');

exports.generateOTP = () => {
    let otp = "";

    for (let i = 0; i <= 3; i++) {
        const randVal = Math.round(Math.random() * 9);
        otp = otp + randVal;
    }
    return otp;

}


exports.mailTransport = () =>
    nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASSWORD,
        }
    });


exports.generateEmailTemplate = code => `
    <h1>Hi User</h1>,

    <p>Thanks for getting started with Arcadia!
    
    We need a little more information to complete your registration, including a confirmation of your email address. 
    
    Following is your 4-digit verification code </p>
    <h1>${code}</h1>
        
    <h4>If you have problems, please contact us at davedhruv1201@gmail.com</h4>`


exports.generateResetMail = url => `<h1>Hi User</h1>,

        <p>Please enter the following code to reset your password!
        
        We need a little more information to complete your registration, including a confirmation of your email address. 
        
        Click on the following link to reset password </p>
        <a href = "${url}">Reset Password </a>
            
        <h4>If you have problems, please contact us at davedhruv1201@gmail.com</h4>`