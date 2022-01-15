// const User = require('../../models/user');
// const ResetToken = require("../../models/resetToken");
// const crypto = require("crypto");
// const { createRandomBytes } = require('./resetUtils');
// const { mailTransport, generateResetMail } = require('./mail');

// exports.forgotPassword = async (req, res) => {
//     const { email } = req.body;
//     if (!email) return req.flash("failure", "Please provide a valid email");

//     const user = await User.findOne({ email });
//     if (!user) return req.flash("failure", "No user found");

//     const token = await ResetToken.findOne({ owner: user._id });
//     if (token) return req.flash("failure", "Only after one hour you can get another token");

//     const tokenn = await createRandomBytes();

//     const resetToken = new ResetToken({
//         owner: user._id,
//         token: tokenn
//     });
//     await resetToken.save();

//     mailTransport.sendMail({
//         from: "security@gmail.com",
//         to: user.email,
//         subject: "Password Reset Email",
//         html: generateResetMail(`http://localhost:7777/reset-password?token=${token}&id=${user._id}`),
//     });

//     req.flash("success", "Password link has been sent to your email address");

// }