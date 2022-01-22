const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({

    profilePhoto: {
        url: String,
        fileName: String,
    },
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
    },
    isArcadian: {
        type: Boolean,
        required: true,
    },
    // verified: {
    //     type: Boolean,
    //     required: true,
    //     default: false,
    // },
    // reseter: {
    //     type: String,
    //     required: true,
    // }
})


// userSchema.pre("save", async function (next) {
//     if(this.isModified("password")){
//         const hash = await bcrypt.hash(this.reseter, 8);
//         this.reseter = hash;
//     }
//     next();
// })

// userSchema.methods.comparePassword = async function(reseter){
//     const result = await bcrypt.compareSync(reseter, this.reseter);
//     return result;
// }

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);