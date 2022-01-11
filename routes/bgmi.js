const express = require('express');
const router = express.Router();
const BGMI = require('../models/bgmi.js');
const {isLoggedIn} = require('../middleware.js');
const multer = require('multer');
const {storage} = require('../cloudinary/index.js');
// here we are telling multer to store the stuff inside the storage we created in cloudinary.
const upload = multer({storage});
const {cloudinary} = require('../cloudinary/index.js');

// bgmi start
router.get('/bgmi', async(req,res) => {
    res.render('events/BGMI/bgmi.ejs')
})

router.get('/bgmi/reg', isLoggedIn, async(req,res) => {
    res.render('events/BGMI/bgmiReg.ejs');
})


router.get('/bgmi/teams', async(req,res) => {

    const bgmiowner = await BGMI.find();
    res.render('events/BGMI/bgmiTeams.ejs', {bgmiowner});
})


router.post('/bgmi/reg/owner', upload.single('image'), async(req,res) => {
    const {username, teamName, ign , teamMember2 , ign2 , uid2, teamMember3, ign3, uid3, teamMember4, ign4, uid4} = req.body;
    const bgmiowner = new BGMI({
        name: username,
        teamName: teamName,
        ign: ign,
        p2n : teamMember2,
        ign2 : ign2,
        uid2 : uid2,
        p3n : teamMember3,
        ign3 : ign3,
        uid3 : uid3,
        p4n : teamMember4,
        ign4 : ign4,
        uid4 : uid4,
    })
    bgmiowner.teamLogo.url = req.file.path;
    bgmiowner.teamLogo.fileName = req.file.filename;

    bgmiowner.wins = 0;
    bgmiowner.loss = 0;
    bgmiowner.points = 0;
    bgmiowner.draws = 0;
    bgmiowner.roundsPlayed = 0;
    bgmiowner.roundsWon = 0;
    bgmiowner.roundsLost = 0;
    bgmiowner.roundDifference = 0;

    await bgmiowner.save();
    req.flash('success', "Congrats, your registration has been accepted\nPlease check your details");
    res.redirect('/bgmi/teams');
})
router.get('/bgmiteam/view/:id', async(req,res) => {
    const {id} = req.params;
    const team = await BGMI.findById(id);
    res.render('events/BGMI/bgmiMembers.ejs', {team});
})

router.get("/bgmi/pointstable", async(req,res) => {
    const allTeams = await BGMI.find();

    for(let i=0; i<allTeams.length; i++){
        for(let j=i+1; j<allTeams.length; j++){
            
            if(allTeams[i].points < allTeams[j].points){
                let temp = allTeams[i];
                allTeams[i] = allTeams[j];
                allTeams[j] = temp;
            }
        }
    }

    res.render("events/BGMI/pointstable.ejs", {allTeams});

})

router.post("/editEvent/bgmi", async(req,res) => {
    const {win, loss, draws, roundsPlayed, roundsWon, roundsLost, roundDifference, points} = req.body;
    const teamsToEdit = await BGMI.find();
    if(teamsToEdit.length===1){
        teamsToEdit[0].points = points;
        teamsToEdit[0].wins = win;
        teamsToEdit[0].loss = loss;
        teamsToEdit[0].draws = draws;
        teamsToEdit[0].roundsPlayed = roundsPlayed;
        teamsToEdit[0].roundsWon = roundsWon;
        teamsToEdit[0].roundsLost = roundsLost;
        teamsToEdit[0].roundDifference = roundDifference;

        await teamsToEdit[0].save();
    } else {
        for(let i = 0 ; i<teamsToEdit.length; i++){
            teamsToEdit[i].points = points[i];
            teamsToEdit[i].wins = win[i];
            teamsToEdit[i].loss = loss[i];
            teamsToEdit[i].draws = draws[i];
            teamsToEdit[i].roundsPlayed = roundsPlayed[i];
            teamsToEdit[i].roundsWon = roundsWon[i];
            teamsToEdit[i].roundsLost = roundsLost[i];
            teamsToEdit[i].roundDifference = roundDifference[i];
    
            await teamsToEdit[i].save();
        }
    }
    
    
    req.flash("success", "Points table updated successfully");
    res.redirect("/bgmi/pointstable");
})
// bgmi end


module.exports = router;