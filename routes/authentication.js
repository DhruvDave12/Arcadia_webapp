const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { isValidObjectId } = require("mongoose");
const crypto = require("crypto");
const multer = require("multer");
const { storage } = require("../cloudinary/index.js");
// here we are telling multer to store the stuff inside the storage we created in cloudinary.
const upload = multer({ storage });
const { cloudinary } = require("../cloudinary/index.js");

// function authPassValidation()
router.get("/register", async (req, res) => {
    res.render("authentication/register.ejs");
});

router.get("/login", async (req, res) => {
    res.render("authentication/login.ejs");
});

router.post("/register", upload.single("image"), async (req, res) => {
    
        const {
            email,
            password,
            confirmPassword,
            username,
            ign,
            clgname,
            clgid,
            dob,
            valorant,
            csgo,
            apex,
            bgmi,
            r6s,
            codm,
            codPC,
            other,
            isArcadian,
        } = req.body;

        if (confirmPassword !== password) {
            req.flash("error", "Both passwords must match");
            res.redirect("/register");
        } else {
            // Now we will add entry of user in our database
            let gamesArr = [];
            if (valorant === "on") {
                gamesArr.push("Valorant");
            }
            if (csgo === "on") {
                gamesArr.push("CSGO");
            }
            if (apex === "on") {
                gamesArr.push("APEX Legends");
            }
            if (bgmi === "on") {
                gamesArr.push("BGMI");
            }
            if (r6s === "on") {
                gamesArr.push("Rainbow Six Siege");
            }
            if (codm === "on") {
                gamesArr.push("COD Mobile");
            }
            if (codPC === "on") {
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
            });

            if (isArcadian) {
                user.isArcadian = true;
            } else {
                user.isArcadian = false;
            }
            user.reseter = password;
            user.profilePhoto.url = req.file.path;
            user.profilePhoto.fileName = req.file.filename;
            req.flash("success", "Your Account Has Been Registered, Please login!");
            res.redirect("/login");
        
    } 
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login",
    }),
    async (req, res) => {
        const { email } = req.body;
        req.flash("success", "Welcome Back");

        const user = await User.findOne({ email: email });
        const redirectUrl = req.session.returnTo || `/homepage/${user._id}`;
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    }
);

router.get("/logout", async (req, res) => {
    req.logout();
    req.flash("success", "Logged Out Successfully");
    res.redirect("/login");
});

module.exports = router;
