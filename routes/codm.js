const express = require('express');
const router = express.Router();
const CODM = require('../models/codm.js');
const {isLoggedIn} = require('../middleware.js');
const multer = require('multer');
const {storage} = require('../cloudinary/index.js');
// here we are telling multer to store the stuff inside the storage we created in cloudinary.
const upload = multer({storage});
const {cloudinary} = require('../cloudinary/index.js');


router.get('/codm', async(req,res) => {
    res.render('events/CODM/codm.ejs')
})

router.get('/codm/reg', isLoggedIn, async(req,res) => {
    res.render('events/CODM/codmReg.ejs');
})


router.get('/codm/teams', async(req,res) => {

    const codmowner = await CODM.find();
    res.render('events/CODM/codmTeams.ejs', {codmowner});
})


router.post('/codm/reg/owner', upload.single('image'), async(req,res) => {
    const {username, teamName, ign , teamMember2 , ign2 , uid2, teamMember3, ign3, uid3, teamMember4, ign4, uid4, uid, teamMember5, ign5, uid5} = req.body;
    const codmowner = new CODM({
        name: username,
        teamName: teamName,
        uid: uid,
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
        p5n: teamMember5,
        ign5: ign5,
        uid5: uid5,
    })
    codmowner.teamLogo.url = req.file.path;
    codmowner.teamLogo.fileName = req.file.filename;
    codmowner.wins = 0;
    codmowner.loss = 0;
    codmowner.points = 0;
    codmowner.draws = 0;
    codmowner.roundsPlayed = 0;
    codmowner.roundsWon = 0;
    codmowner.roundsLost = 0;
    codmowner.roundDifference = 0;

    await codmowner.save();
    req.flash('success', "Congrats, your registration has been accepted\nPlease check your details");
    res.redirect('/codm/teams');
})
router.get('/codmteam/view/:id', async(req,res) => {
    const {id} = req.params;
    const team = await CODM.findById(id);
    res.render('events/CODM/codmMembers.ejs', {team});
})


router.get("/codm/pointstable", async(req,res) => {
    const allTeams = await CODM.find();
    for(let i=0; i<allTeams.length; i++){
        for(let j=i+1; j<allTeams.length; j++){
            
            if(allTeams[i].points < allTeams[j].points){
                let temp = allTeams[i];
                allTeams[i] = allTeams[j];
                allTeams[j] = temp;
            }
        }
    }

    res.render("events/CODM/pointstable.ejs", {allTeams});
})

router.post("/editEvent/codm", async(req,res) => {
    const {win, loss, draws, roundsPlayed, roundsWon, roundsLost, roundDifference, points} = req.body;
    const teamsToEdit = await CODM.find();
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
    res.redirect("/codm/pointstable");
})

module.exports = router;