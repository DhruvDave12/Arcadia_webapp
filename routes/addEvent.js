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


router.get('/addEvent', isLoggedIn, async(req,res)=>{
    res.render("events/EventManagement/addEvent.ejs");
})


router.post('/addEvent', isLoggedIn, upload.single('image'),async(req,res)=>{
    const{eventName,prize, startDate, endDate, tagLine, gameName, othergame, desc} = req.body;
   
    const eventData = new EventData({
        eventType: gameName,
        eventName:eventName,
        prize:prize,
        startDate: startDate,
        endDate: endDate,
        tagLine: tagLine,
        description: desc,
    })

    eventData.eventLogo.url = req.file.path;
    eventData.eventLogo.fileName = req.file.filename;

    statusChecker(eventData);
    
    await eventData.save();
    req.flash('success', "Congrats, Successfully event added!");
    res.redirect('/event');
})

module.exports = router;