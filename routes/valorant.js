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
const ValoData = require('../models/valoData.js')
const {isLoggedIn} = require('../middleware.js');

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


// Valorant add event feature
//taking data of adding a valo event
router.post('/addEvent/Valorant', upload.single('image'),async(req,res)=>{
    const{eventName,prize, startDate, endDate, tagLine} = req.body;

    const valoData = new ValoData({
        eventName:eventName,
        prize:prize,
        startDate: startDate,
        endDate: endDate,
        tagLine: tagLine,
    })

    valoData.eventLogo.url = req.file.path;
    valoData.eventLogo.fileName = req.file.filename;

    const currentDate = new Date().toISOString().slice(0,10); // yyyymmdd

    const currentYear = parseInt(currentDate.slice(0,4));
    const yearStart = parseInt(startDate.slice(0,4));
    const yearEnd = parseInt(endDate.slice(0,4));

    const monthCurrent = parseInt(currentDate.substring(5,7));
    const monthStart = parseInt(startDate.substring(5,7));
    const monthEnd = parseInt(endDate.substring(5,7));

    const currentDay = parseInt(currentDate.substring(8));
    const startDay = parseInt(startDate.substring(8));
    const endDay = parseInt(endDate.substring(8));


    if(currentYear == yearStart){
        if(currentYear == yearEnd){
            if(monthCurrent > monthStart && monthCurrent < monthEnd){
                valoData.eventStatus = "Current";
            }
            if(monthCurrent < monthStart){
                valoData.eventStatus = "Future";
            }
            if(monthCurrent > monthEnd){
                valoData.eventStatus = "Past";
            }
            if(monthCurrent == monthStart && monthCurrent == monthEnd){
                if(currentDay >= startDay && currentDay <= endDay){
                    valoData.eventStatus = "Current";
                }
                if(currentDay < startDay){
                    valoData.eventStatus = "Future";
                }
                if(currentDay > endDay){
                    valoData.eventStatus = "Past";
                }
            }
            else if(monthCurrent == monthEnd){
                if(currentDay <= endDay){
                    valoData.eventStatus = "Current";
                }
                if(currentDay > endDay){
                    valoData.eventStatus = "Past";
                }
            } else if(monthCurrent == monthStart){
                if(currentDay <= startDay){
                    valoData.eventStatus = "Future";
                }
                if(currentDay > startDay){
                    valoData.eventStatus = "Current";
                }
            }
        }
        else if(currentYear < yearEnd){
            valoData.eventStatus = "Current";
        }
    } else if(currentYear < yearStart){
        valoData.eventStatus = "Future";
    } else{
        valoData.eventStatus = "Past";
    }
    
    await valoData.save();
    req.flash('success', "Congrats, Successfully event added!");
    res.redirect('/event');
})


module.exports = router;