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
})


module.exports = mongoose.model('User', valoDataSchema);