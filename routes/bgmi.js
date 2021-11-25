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


module.exports = router;