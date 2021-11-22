const express = require('express');
const router = express.Router();
// const User = require('../models/user.js');
const BGMI = require('../models/bgmi.js');
const multer = require('multer');
const {storage} = require('../cloudinary/index.js');
// here we are telling multer to store the stuff inside the storage we created in cloudinary.
const upload = multer({storage});
const {cloudinary} = require('../cloudinary/index.js');
// Model for valorant
const Team = require('../models/valorantTeam.js');
const Owner = require('../models/valorantOwner.js');
const CSOwner = require('../models/csgoOwners.js');
const CSMembs = require('../models/csgoMembers.js');
const ValoData = require('../models/valoData.js')
const {isLoggedIn} = require('../middleware.js');



router.get('/event', async(req,res) => {
    res.render('events/event.ejs')
})

router.get('/valorant', async(req,res) => {
    res.render('events/valorant.ejs')
})

router.get('/valo/reg', isLoggedIn, async(req,res) => {
    res.render('events/valoReg.ejs');
})

router.get('/valo/pointsTable', async(req,res) => {
    
    const allTeams = await Owner.find();
    res.render('events/valoPointstable.ejs', {allTeams});
})

router.get('/valo/membs', async(req,res) => {
    
    const team = await Team.find();
    res.render('events/valoMembers.ejs', {team});
})

router.get('/valo/teams', async(req,res) => {
    const owner = await Owner.find();
    res.render('events/valoTeams.ejs', {owner});
})

router.get('/addEvent', async(req,res)=>{
    res.render('events/addEvent.ejs');
})

router.get('/addEvent/Valorant',async(req,res)=>{
    res.render('events/addValorant.ejs');
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
    await owner.save();
    req.flash('success', "Congrats, your registration has been accepted\nPlease check your details");
    res.redirect('/valo/teams');
})

//taking data of adding a valo event
router.post('/addEvent/Valorant', upload.single('image'),async(req,res)=>{
    const{eventName,prize} = req.body;

    const valoData = new ValoData({
        eventName:eventName,
        prize:prize

    })

    valoData.eventLogo.url = req.file.path;
    valoData.eventLogo.fileName = req.file.filename;
    await valoData.save();
    req.flash('success', "Congrats");
    res.redirect('/valorant');
})




// csgo start
router.get('/csgo', async(req,res) => {
    res.render('events/csgo.ejs')
})

router.get('/csgo/reg', isLoggedIn, async(req,res) => {
    res.render('events/csgoReg.ejs');
})

router.get('/csgo/membs', async(req,res) => {
    
    const team = await CSMembs.find();
    res.render('events/csgoMembers.ejs', {team});
})
router.get('/csgo/teams', async(req,res) => {

    const owner = await CSOwner.find();
    res.render('events/csgoTeams.ejs', {owner});
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
    await owner.save();
    req.flash('success', "Congrats, your registration has been accepted\nPlease check your details");
    res.redirect('/csgo/teams');
})

router.get('/csgo/pointsTable', async(req,res) => {
    
    const allTeams = await CSOwner.find();
    res.render('events/csgoPointstable.ejs', {allTeams});
})
// csgo end


// bgmi start
router.get('/bgmi', async(req,res) => {
    res.render('events/bgmi.ejs')
})

router.get('/bgmi/reg', isLoggedIn, async(req,res) => {
    res.render('events/bgmiReg.ejs');
})


router.get('/bgmi/teams', async(req,res) => {

    const bgmiowner = await BGMI.find();
    res.render('events/bgmiTeams.ejs', {bgmiowner});
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
    await bgmiowner.save();
    req.flash('success', "Congrats, your registration has been accepted\nPlease check your details");
    res.redirect('/bgmi/teams');
})
router.get('/bgmiteam/view/:id', async(req,res) => {
    const {id} = req.params;
    const team = await BGMI.findById(id);
    res.render('events/bgmiMembers.ejs', {team});
})
// bgmi end


// // codm start
// router.get('/codm', async(req,res) => {
//     res.render('events/codm.ejs')
// })

// router.get('/codm/reg', isLoggedIn, async(req,res) => {
//     res.render('events/codmReg.ejs');
// })


// router.get('/codm/teams', async(req,res) => {

//     const owner = await Owner.find();
//     res.render('events/codmTeams.ejs', {owner});
// })


// router.post('/codm/reg/owner', upload.single('image'), async(req,res) => {
//     const {username, teamName, ign} = req.body;
//     const owner = new Owner({
//         name: username,
//         teamName: teamName,
//         ign: ign
//     })
//     owner.teamLogo.url = req.file.path;
//     owner.teamLogo.fileName = req.file.filename;
//     await owner.save();
//     req.flash('success', "Congrats, your registration has been accepted\nPlease check your details");
//     res.redirect('/codm/teams');
// })
// // codm end



// Valo admin level stuff backend
router.get('/team/view/:id', async(req,res) => {
    const {id} = req.params;
    const team = await Owner.findById(id).populate('players');
    res.render('events/valoView.ejs', {team, id});
})

router.get('/valo/add/admin/:oid', async(req,res) => {
    const {oid} = req.params;
    const playersList = await Team.find();
    res.render('events/playerList', {playersList, oid});
})

router.get('/player/:id/:oid', async(req,res) => {
    const {id, oid} = req.params;
    const playerToAdd = await Team.findById(id);
    playerToAdd.owned = true;
    await playerToAdd.save();
    const teamToGet = await Owner.findById(oid);
    teamToGet.players.push(playerToAdd);
    await teamToGet.save();
    res.redirect(`/team/view/${oid}`);
})

router.get('/remove/:pid/:tid', async(req,res) => {
    const {pid, tid} = req.params;
    const team = await Owner.findByIdAndUpdate(tid, {$pull: {players: pid}});
    req.flash('success', "Successfully removed the player!");
    res.redirect(`/team/view/${tid}`);
})
router.get('/edit/admin/:tid', async(req,res) => {
    const {tid} = req.params;
    res.render('events/editStats.ejs', {tid});
})

router.post('/edit/:tid', async(req,res) => {
    const {tid} = req.params;
    const teamToEdit = await Owner.findById(tid);
    const{wins, loss, draws, roundsPlayed, roundsWon, roundsLoss, roundsDiff, points} = req.body;
    teamToEdit.points = points;
    teamToEdit.wins = wins;
    teamToEdit.loss = loss;
    teamToEdit.draws = draws;
    teamToEdit.roundsPlayed = roundsPlayed;
    teamToEdit.roundsWon = roundsWon;
    teamToEdit.roundsLost = roundsLoss;
    teamToEdit.roundsDiff = roundsDiff;

    await teamToEdit.save();
    req.flash('success', "Updated Successfully!");
    res.redirect('/valo/pointsTable');
})




// CSGO Admin Level Stuff
router.get('/team/view/csgo/:id', async(req,res) => {
    const {id} = req.params;
    const team = await CSOwner.findById(id).populate('players');
    res.render('events/csgoView.ejs', {team, id});
})

router.get('/csgo/add/admin/:oid', async(req,res) => {
    const {oid} = req.params;
    const playersList = await CSMembs.find();
    res.render('events/csgoplayerList.ejs', {playersList, oid});
})

router.get('/csgo/add/admin/:oid', async(req,res) => {
    const {oid} = req.params;
    const playersList = await CSMembs.find();
    res.render('events/playerList', {playersList, oid});
})

router.get('/csgo/player/:id/:oid', async(req,res) => {
    const {id, oid} = req.params;
    const playerToAdd = await CSMembs.findById(id);
    const teamToGet = await CSOwner.findById(oid);
    teamToGet.players.push(playerToAdd);
    await teamToGet.save();
    console.log(teamToGet);
    res.redirect(`/team/view/csgo/${oid}`);
})

router.get('/csgo/remove/:pid/:tid', async(req,res) => {
    const {pid, tid} = req.params;
    const team = await CSOwner.findByIdAndUpdate(tid, {$pull: {players: pid}});
    req.flash('success', "Successfully removed the player!");
    res.redirect(`/team/view/csgo/${tid}`);
})

router.get('/csgo/edit/admin/:tid', async(req,res) => {
    const {tid} = req.params;
    console.log(tid);
    res.render('events/editStatsCSGO.ejs', {tid});
})

router.post('/csgo/edit/:tid', async(req,res) => {
    const {tid} = req.params;
    const teamToEdit = await CSOwner.findById(tid);
    const{wins, loss, draws, roundsPlayed, roundsWon, roundsLoss, roundsDiff, points} = req.body;
    teamToEdit.points = points;
    teamToEdit.wins = wins;
    teamToEdit.loss = loss;
    teamToEdit.draws = draws;
    teamToEdit.roundsPlayed = roundsPlayed;
    teamToEdit.roundsWon = roundsWon;
    teamToEdit.roundsLost = roundsLoss;
    teamToEdit.roundsDiff = roundsDiff;

    await teamToEdit.save();
    req.flash('success', "Updated Successfully!");
    res.redirect('/csgo/pointsTable');
})
module.exports = router;