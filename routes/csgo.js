const express = require('express');
const router = express.Router();
const multer = require('multer');
const {storage} = require('../cloudinary/index.js');
// here we are telling multer to store the stuff inside the storage we created in cloudinary.
const upload = multer({storage});
const {cloudinary} = require('../cloudinary/index.js');
const {isLoggedIn, isAdmin} = require('../middleware.js');
const CSOwner = require('../models/csgoOwners.js');
const CSMembs = require('../models/csgoMembers.js');


// csgo start
router.get('/csgo', async(req,res) => {
    res.render('events/CSGO/csgo.ejs')
})

router.get('/csgo/reg', isLoggedIn, async(req,res) => {
    res.render('events/CSGO/csgoReg.ejs');
})

router.get('/csgo/membs', async(req,res) => {
    
    const team = await CSMembs.find();
    res.render('events/CSGO/csgoMembers.ejs', {team});
})
router.get('/csgo/teams', async(req,res) => {

    const owner = await CSOwner.find();
    res.render('events/CSGO/csgoTeams.ejs', {owner});
})


// TEAM DATA FETCH
router.post('/csgo/reg/team',async(req,res) => {
    const{ign, rank, bestRank, mainWeapon, secondaryWeapon, pname} = req.body;
    const member = new CSMembs({
        name: pname,
        ign: ign, 
        currentRank: rank,
        bestRank: bestRank,
        mainWeapon: mainWeapon,
        secondaryWeapon: secondaryWeapon
    });
    await member.save();
    req.flash('success', "Congrats, your registration has been accepted\nPlease check your details");
    res.redirect('/csgo/membs');

})

router.post('/csgo/reg/owner', upload.single('image'), async(req,res) => {
    const {username, teamName, ign} = req.body;
    const owner = new CSOwner({
        name: username,
        teamName: teamName,
        ign: ign
    })
    owner.teamLogo.url = req.file.path;
    owner.teamLogo.fileName = req.file.filename;

        owner.points = 0;
        owner.wins = 0;
        owner.loss = 0;
        owner.draws = 0;
        owner.roundsPlayed = 0;
        owner.roundsWon = 0;
        owner.roundsLost = 0;
        owner.roundDifference = 0;
    await owner.save();
    req.flash('success', "Congrats, your registration has been accepted\nPlease check your details");
    res.redirect('/csgo/teams');
})

router.get('/csgo/pointsTable', async(req,res) => {
    
    const allTeams = await CSOwner.find();
    res.render('events/CSGO/csgoPointstable.ejs', {allTeams});
})
// csgo end

module.exports = router;