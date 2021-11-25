if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

// Routes
const authRoutes = require('./routes/authentication.js');
const homepageRoutes = require('./routes/homepage.js');
const eventRoutes = require('./routes/event.js');
const valorantRoutes = require('./routes/valorant.js');
const csgoRoutes = require('./routes/csgo.js');
const bgmiRoutes = require('./routes/bgmi.js');




// Establishing MongoConnection
mongoose.connect('mongodb://localhost:27017/arcadiaData');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error: "));
db.once("open", () => {
    console.log("DATABASE CONNECTED");
});

const app = express();
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))


const sessionConfig = {
    name: 'session',
    secret: 'thisisatempsecret',
    resave: false,
    saveUninitialized: true,

    // Fancier Options for cookies like setting an expiration date.
    cookie: {
        httpOnly: true, // makes it not accessible on other client js
        // secure: true, // cookies can be secured only with https.
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());
// Passport
// Passport Usage
app.use(passport.initialize());
app.use(passport.session()); // REMEMBER app.use(session) must come before passport.session.
// this below line tells that we will be using a local strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // serializing the user in session
passport.deserializeUser(User.deserializeUser()); // deserializing the user out of the session.

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Using Routes
app.use('/', authRoutes);
app.use('/', homepageRoutes);
app.use('/', eventRoutes);
app.use('/', valorantRoutes);
app.use('/', csgoRoutes);
app.use('/', bgmiRoutes);



app.listen(7777, (req, res) => {
    console.log(`LISTENING TO PORT 7777!!`);
})