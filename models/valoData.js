const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const valoDataSchema = new Schema({
    
    eventName: {
        type: String,
        required: true,
    },
    prize: {
        type: String,
        required: true,
    },
    eventLogo: {
        url: String,
        fileName: String,
    },
    // added only in model, add this in code ....
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    winner:{
        type: String,
    },
    tagLine: {
        type: String,
    },
    eventStatus: {
        type: String,
    }
})


module.exports = mongoose.model('valoData', valoDataSchema);