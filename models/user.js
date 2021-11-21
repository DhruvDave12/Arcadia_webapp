const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    
    clgName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    clgID: {
        type: Number,
        required: true,
        unique: true,
    },
    games:{
        type: [String],
        required: true,
    },
    ign: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    }
})

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);