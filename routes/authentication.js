const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');
const { generateOTP, mailTransport, generateEmailTemplate, generateResetMail } = require("../public/javascripts/mail");
const VerificationToken = require('../models/verificationToken');
const { isValidObjectId } = require('mongoose');
const ResetToken = require("../models/resetToken");
const { createRandomBytes } = require('../public/javascripts/resetUtils');
const crypto = require("crypto");
const { isResetTokenValid } = require('../middleware');
const nodemailer = require('nodemailer');

const multer = require('multer');
const {storage} = require('../cloudinary/index.js');
// here we are telling multer to store the stuff inside the storage we created in cloudinary.
const upload = multer({storage});
const {cloudinary} = require('../cloudinary/index.js');


// function authPassValidation()
router.get('/register', async (req, res) => {
    res.render('authentication/register.ejs');
})

router.get('/login', async (req, res) => {
    res.render('authentication/login.ejs');
})

router.post('/register', upload.single('image'), async (req, res) => {

    try {
        const transporter = nodemailer.createTransport(
            {
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                    user: 'davedhruv1201@gmail.com',
                    pass: 'dhruvd12',
                },
            }
        )
        transporter.verify().then(console.log).catch(console.error);
        const { email, password, confirmPassword, username, ign, clgname, clgid, dob, valorant,
            csgo, apex, bgmi, r6s, codm, codPC, other, isArcadian, userOtp } = req.body;

        if (confirmPassword !== password) {
            req.flash('error', "Both passwords must match");
            res.redirect('/register');
        } else {
            // Now we will add entry of user in our database
            let gamesArr = [];
            if (valorant === 'on') {
                gamesArr.push("Valorant");
            } if (csgo === 'on') {
                gamesArr.push("CSGO");
            } if (apex === 'on') {
                gamesArr.push("APEX Legends");
            } if (bgmi === 'on') {
                gamesArr.push("BGMI");
            } if (r6s === 'on') {
                gamesArr.push("Rainbow Six Siege");
            } if (codm === 'on') {
                gamesArr.push("COD Mobile");
            } if (codPC === 'on') {
                gamesArr.push("COD PC");
            }

            gamesArr.push(other);
            const user = new User({
                email: email,
                clgName: clgname,
                clgID: clgid,
                games: gamesArr,
                ign: ign,
                dob: dob,
                username: username,
            })

            if (isArcadian) {
                user.isArcadian = true;
            } else {
                user.isArcadian = false;
            }
            user.reseter = password;
            user.profilePhoto.url = req.file.path;
            user.profilePhoto.fileName = req.file.filename;
            // generating an OTP

            const otp = generateOTP();
            const verToken = new VerificationToken({
                owner: user._id,
                token: otp
            });

            await verToken.save();

            const registeredUser = await User.register(user, password);
            req.login(registeredUser, () => {
                // Add error feature here.
                transporter.sendMail({
                    from: 'emailverification@email.com',
                    to: user.email,
                    subject: 'Verify your email account',
                    html: generateEmailTemplate(otp),
                });
                res.redirect(`/verify-email/${user._id}`);
            });
        }


    } catch (err) {

        req.flash('error', err.message);
        res.redirect('/register');
    }
})
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), async (req, res) => {
    const { email } = req.body;
    req.flash('success', 'Welcome Back');

    const user = await User.findOne({ email: email });
    const redirectUrl = req.session.returnTo || `/homepage/${user._id}`;
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', async (req, res) => {
    req.logout();
    req.flash('success', "Logged Out Successfully");
    res.redirect('/login');
})

router.get("/verify-email/:id", async (req, res) => {
    const { id } = req.params;
    res.render("authentication/verifyEmail.ejs", { id });
})
router.post("/verify-email", async (req, res) => {
    const { otp } = req.body;
    const { userID } = req.query;
    if (!userID || !otp.trim()) return req.flash("error", "Invalid request, missing parameters");

    // mongoose method
    if (!isValidObjectId(userID)) {
        req.flash("error", "Invalid request, missing parameters");
        return res.redirect('/register');
    }

    const user = await User.findById(userID);
    if (!user) {
        req.flash("error", "No such user exists");
        return res.redirect("/register");
    }

    if (user.verified) {
        req.flash("error", "This account is already verified");
        return res.redirect(`/login`);
    }

    const token = await VerificationToken.findOne({ owner: user._id });
    if (!token) {
        req.flash("error", "Sorry user not found");
        return res.redirect(`/verify-email/${userID}`);

    }

    const isMatched = await token.compareToken(otp);
    if (!isMatched) {
        req.flash("error", "Please provide a valid token");
        return res.redirect(`/verify-email/${userID}`);
    }
    user.verified = true;
    await VerificationToken.findByIdAndDelete(token._id);
    await user.save();

    req.flash("success", `Welcome, ${user.username}`);
    res.redirect(`/homepage/${userID}`);
});

router.get('/forgot-password', async (req, res) => {
    res.render('authentication/forgotPassword.ejs');
})
router.post("/forgot-password", async (req, res) => {
    const transporter = nodemailer.createTransport(
        {
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'davedhruv1201@gmail.com',
                pass: 'dhruvd12',
            },
        }
    )
    transporter.verify().then(console.log).catch(console.error);

    const { email } = req.body;
    if (!email) {
        req.flash("error", "Please provide a valid email");
        return res.redirect("/forgot-password");
    }

    const user = await User.findOne({ email });
    if (!user) {
        req.flash("error", "No user found. Please register");
        return res.redirect("/register");
    }

    const token = await ResetToken.findOne({ owner: user._id });
    if (token) {
        req.flash("error", "Only after one hour you can get another token");
        return res.redirect("/forgot-password");
    }

    const tokenn = await createRandomBytes();


    const resetToken = new ResetToken({
        owner: user._id,
        token: tokenn
    });
    await resetToken.save();



    transporter.sendMail({
        from: "security@gmail.com",
        to: user.email,
        subject: "Password Reset Email",
        html: generateResetMail(`http://localhost:7777/reset-password?token=${tokenn}&id=${user._id}`),
    });

    req.flash("success", "Password link has been sent to your email address");
    res.redirect('/forgot-password');
})

router.get('/reset-password', async (req, res) => {
    const { token, id } = req.query;
    res.render('authentication/resetPassword.ejs', { token, id });
})
router.post("/reset-password", isResetTokenValid, async (req, res) => {
    const { reseter, confirmReseter } = req.body;

    if (reseter != confirmReseter) {
        req.flash("error", "New Password and Confirm password must match!")
        return res.redirect('/reset-password');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        req.flash("error", "User not found. Please register.");
        return res.redirect("/register");
    }


    user.reseter = reseter.trim();
    await User.findByUsername(user.username).then(async function (sanitizedUser) {
        if (sanitizedUser) {
            await sanitizedUser.setPassword(reseter, async function () {
                await sanitizedUser.save();
                req.flash("success", "Password reset successful. Please login with your new password");
                return res.redirect('/login');
            });
        } else {
            req.flash("error", "Something went wrong");
            res.redirect('/login');
        }
    }, function (err) {
        res.send(err);
    })
})

module.exports = router;