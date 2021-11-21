const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
    name: {
        type: String,
    },
    ign: {
        type: String,
    },
    currentRank: {
        type: String,
    },
    bestRank: {
        type: String,
    },
    mainWeapon: {
        type: String,
    },
    secondaryWeapon: {
        type: String,
    }
})

module.exports = mongoose.model('CSteam', teamSchema);