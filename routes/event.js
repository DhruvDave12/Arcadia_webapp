const express = require('express');
const BGMI = require('../models/bgmi.js');
const CODM = require('../models/codm.js');

const router = express.Router();
// const User = require('../models/user.js');
const multer = require('multer');
const {storage} = require('../cloudinary/index.js');
// here we are telling multer to store the stuff inside the storage we created in cloudinary.
const upload = multer({storage});
const {cloudinary} = require('../cloudinary/index.js');
const {isLoggedIn} = require('../middleware.js');

// Model for valorant
const Team = require('../models/valorantTeam.js');
const Owner = require('../models/valorantOwner.js');
const CSOwner = require('../models/csgoOwners.js');
const CSMembs = require('../models/csgoMembers.js');
const ValoData = require('../models/valoData.js');
const valorantTeam = require('../models/valorantTeam.js');


// DO ADMIN AUTHORIZATION
router.get('/event', async(req,res) => {
    
    const valoData = await ValoData.find();
    const current = [];
    const future = [];
    const past = [];

    for(let data of valoData){
        if(data.eventStatus === "Current"){
            current.push(data);
        } else if(data.eventStatus === "Past"){
            past.push(data);
        } else if(data.eventStatus === "Future"){
            future.push(data);
        }
    }

    future.forEach((imgs, i) => {
        console.log(imgs.url);
    })
    // console.log(valoData, current, past, future);
    res.render('events/EventManagement/event.ejs', {valoData, current, past, future});
})

// Valo admin level stuff backend
router.get('/team/view/:id', async(req,res) => {
    const {id} = req.params;
    const team = await Owner.findById(id).populate('players');
    res.render('events/Valorant/valoView.ejs', {team, id});
})

router.get('/valo/add/admin/:oid', async(req,res) => {
    
    const {oid} = req.params;
    const playersList = await Team.find();
    res.render('events/Valorant/playerList', {playersList, oid});
})

router.get('/player/:id/:oid',  async(req,res) => {
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
    const player = await valorantTeam.findById(pid);
    player.owned = false;
    await player.save();
    req.flash('success', "Successfully removed the player!");
    res.redirect(`/team/view/${tid}`);
})
router.get('/edit/admin/:tid',  async(req,res) => {
    const {tid} = req.params;
    res.render('events/Valorant/editStats.ejs', {tid});
})

router.post('/edit/:tid',  async(req,res) => {
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
    teamToEdit.roundDifference = roundsDiff;

    await teamToEdit.save();
    req.flash('success', "Updated Successfully!");
    res.redirect('/valo/pointsTable');
})


// CSGO Admin Level Stuff
router.get('/team/view/csgo/:id', async(req,res) => {
    const {id} = req.params;
    const team = await CSOwner.findById(id).populate('players');
    res.render('events/CSGO/csgoView.ejs', {team, id});
})

router.get('/csgo/add/admin/:oid', async(req,res) => {
    const {oid} = req.params;
    const playersList = await CSMembs.find();
    res.render('events/CSGO/csgoplayerList.ejs', {playersList, oid});
})

router.get('/csgo/player/:id/:oid', async(req,res) => {
    const {id, oid} = req.params;
    const playerToAdd = await CSMembs.findById(id);
    const teamToGet = await CSOwner.findById(oid);
    playerToAdd.owned = true;
    await playerToAdd.save();
    teamToGet.players.push(playerToAdd);
    await teamToGet.save();
    console.log(teamToGet);
    res.redirect(`/team/view/csgo/${oid}`);
})

router.get('/csgo/remove/:pid/:tid', async(req,res) => {
    const {pid, tid} = req.params;
    const team = await CSOwner.findByIdAndUpdate(tid, {$pull: {players: pid}});
    const player = await CSMembs.findById(pid);
    player.owned = false;
    await player.save();

    console.log(player);
    req.flash('success', "Successfully removed the player!");
    res.redirect(`/team/view/csgo/${tid}`);
})

router.get('/csgo/edit/admin/:tid', async(req,res) => {
    const {tid} = req.params;
    console.log(tid);
    res.render('events/CSGO/editStatsCSGO.ejs', {tid});
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
    teamToEdit.roundDifference = roundsDiff;

    await teamToEdit.save();
    console.log(teamToEdit);
    req.flash('success', "Updated Successfully!");
    res.redirect('/csgo/pointsTable');
})
module.exports = router;

// codm admin level stuff
router.get('/team/view/codm/:id', async(req,res) => {
    const {id} = req.params;
    const team = await CODM.findById(id);

    res.render('events/CODM/codmView.ejs', {team, id});
})


// task.date = new Date().toISOString().slice(0, 10); --> to get date in yyyymmdd format