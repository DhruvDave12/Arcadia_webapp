const express = require('express');
const router = express.Router();
const multer = require('multer');
const {storage} = require('../cloudinary/index.js');
// here we are telling multer to store the stuff inside the storage we created in cloudinary.
const upload = multer({storage});
const {cloudinary} = require('../cloudinary/index.js');
// Model for valorant
const Team = require('../models/valorantTeam.js');
const Owner = require('../models/valorantOwner.js');
const EventData = require('../models/valoData.js')
const {isLoggedIn, statusChecker} = require('../middleware.js');


router.get('/valorant', async(req,res) => {
    res.render('events/Valorant/valorant.ejs')
})

router.get('/valo/reg', isLoggedIn, async(req,res) => {
    res.render('events/Valorant/valoReg.ejs');
})

router.get('/valo/pointsTable', async(req,res) => {
    
    const allTeams = await Owner.find();
    for(let i=0; i<allTeams.length; i++){
        for(let j=i+1; j<allTeams.length; j++){
            if(allTeams[i].points < allTeams[j].points){
                let temp = allTeams[i];
                allTeams[i] = allTeams[j];
                allTeams[j] = temp;
            }
        }
    }

    const currentUser = req.user;
    res.render('events/Valorant/valoPointstable.ejs', {allTeams, currentUser});
})

router.get('/valo/membs', async(req,res) => {
    
    const team = await Team.find();
    res.render('events/Valorant/valoMembers.ejs', {team});
})

router.get('/valo/teams', async(req,res) => {
    const owner = await Owner.find();
    res.render('events/Valorant/valoTeams.ejs', {owner});
})

// TEAM DATA FETCH
router.post('/valo/reg/team',async(req,res) => {
    const{ign, rank, bestRank, mainChar, mainWeapon, secondaryWeapon, pname} = req.body;

    const team = new Team({
        name: pname,
        ign: ign,
        mainWeapon: mainWeapon,
        secondaryWeapon: secondaryWeapon,
        mainChar: mainChar,
        currentRank: rank,
        bestRank: bestRank,
        owned: false,
    })
    
    await team.save();
    req.flash('success', "Congrats, your registration has been accepted\nPlease check your details");
    res.redirect('/valo/membs');
})

router.post('/valo/reg/owner', upload.single('image'), async(req,res) => {
    const {username, teamName, ign} = req.body;
    const owner = new Owner({
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
    res.redirect('/valo/teams');
})


// Valorant add event feature
//taking data of adding a valo event



module.exports = router;