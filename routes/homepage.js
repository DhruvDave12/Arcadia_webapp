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

module.exports = router;