const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

router.get('/homepage/:id', async(req,res) => {
    const user = await User.findById(req.params.id);
    res.render('homepageFiles/homepage.ejs', {user});
})

router.get('/', async(req,res) => {
    res.render('homepageFiles/homeMain.ejs');
})

router.get('/arcadiaList', async(req,res) => {
    const userList = await User.find();
    res.render('homepageFiles/arcadiaList.ejs', {userList});
})

router.get("/edit/profile/:id", async(req,res) => {
    const user = await User.findById(req.params.id);
    res.render("homepageFiles/editProfile.ejs", {user});
})

router.post("/edit/profile/:id", async(req,res) => {
    const {id} = req.params;

    const user = await User.findById(id);
    const {username, clgName, clgID, email, ign, date} = req.body;

    user.email = email;
    user.username = username;
    user.clgName = clgName;
    user.clgID = clgID;
    user.ign = ign;
    user.dob = date;
    await user.save();

    req.flash('success', 'Changes saved successfully');
    res.redirect(`/homepage/${id}`);
})

module.exports = router;