const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const teamSchema = new Schema({
    name: {
        type: String
    },
    ign: {
        type: String
    },
    mainWeapon: {
        type: String,
    },
    secondaryWeapon: {
        type: String,
    },
    mainChar: {
        type: String,
    },
    currentRank: {
        type: String,
    },
    bestRank: {
        type: String,
    },
    owned: {
        type: Boolean,
    }
})

module.exports = mongoose.model('Team', teamSchema);

