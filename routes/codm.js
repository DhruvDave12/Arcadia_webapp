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
    await codmowner.save();
    req.flash('success', "Congrats, your registration has been accepted\nPlease check your details");
    res.redirect('/codm/teams');
})
router.get('/codmteam/view/:id', async(req,res) => {
    const {id} = req.params;
    const team = await CODM.findById(id);
    res.render('events/CODM/codmMembers.ejs', {team});
})



module.exports = router;