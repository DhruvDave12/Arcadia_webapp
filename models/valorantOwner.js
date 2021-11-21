const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ownerSchema = new Schema({
    name: {
        type: String,
    },
    teamName: {
        type: String,
    },
    teamLogo: {
        url: String,
        fileName: String,
    },
    ign:{
        type: String,
    },
    players: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Team'
        }
    ],
    
    points: {
        type: Number,
    },
    wins: {
        type: Number,
    },
    loss: {
        type: Number,
    }, 
    draws: {
        type: Number,
    },
    roundsPlayed: {
        type: Number,
    },
    roundsWon: {
        type: Number,
    },
    roundsLost:{
        type:Number,
    },
    roundDifference: {
        type: Number,
    },
})

module.exports = mongoose.model('Owner', ownerSchema);