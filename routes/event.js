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
const {isLoggedIn, statusChecker} = require('../middleware.js');

// Model for valorant
const Team = require('../models/valorantTeam.js');
const Owner = require('../models/valorantOwner.js');
const CSOwner = require('../models/csgoOwners.js');
const CSMembs = require('../models/csgoMembers.js');
const ValoData = require('../models/valoData.js');
const valorantTeam = require('../models/valorantTeam.js');


// DO ADMIN AUTHORIZATION
router.get('/event', isLoggedIn, async(req,res) => {
    
    const valoData = await ValoData.find();
    const current = [];
    const future = [];
    const past = [];
    // console.log(valoData);

    for(let i=0; i<valoData.length; i++){
        statusChecker(valoData[i]);
    }

    for(let data of valoData){
        if(data.eventStatus === "Current"){
            current.push(data);
        } else if(data.eventStatus === "Past"){
            past.push(data);
        } else if(data.eventStatus === "Future"){
            future.push(data);
        }
    }

    // future.forEach((imgs, i) => {
    //     console.log(imgs.url);
    // })
    // console.log(valoData, current, past, future);
    const currentUser = req.user;
    res.render('events/EventManagement/event.ejs', {valoData, current, past, future, currentUser});
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

router.post("/editEvent", async(req,res) => {
    const {win, loss, draws, roundsPlayed, roundsWon, roundsLost, roundDifference, points} = req.body;
    const teamsToEdit = await Owner.find();
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
    res.redirect("/valo/pointsTable");
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

router.get("/csgopointstable", async(req,res) => {
    const allTeams = await CSOwner.find();
    const currentUser = req.user;
    for(let i=0; i<allTeams.length; i++){
        for(let j=i+1; j<allTeams.length; j++){
            if(allTeams[i].points < allTeams[j].points){
                let temp = allTeams[i];
                allTeams[i] = allTeams[j];
                allTeams[j] = temp;
            }
        }
    }
    res.render("events/CSGO/editStatsCSGO.ejs", {allTeams, currentUser})
})

router.post("/editEvent/csgo", async(req,res) => {
    const {win, loss, draws, roundsPlayed, roundsWon, roundsLost, roundDifference, points} = req.body;
    const teamsToEdit = await CSOwner.find();
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
    res.redirect("/csgopointstable");
})


// codm admin level stuff
router.get('/team/view/codm/:id', async(req,res) => {
    const {id} = req.params;
    const team = await CODM.findById(id);

    res.render('events/CODM/codmView.ejs', {team, id});
})

module.exports = router;

// task.date = new Date().toISOString().slice(0, 10); --> to get date in yyyymmdd format