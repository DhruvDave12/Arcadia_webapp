const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Make it general i.e., make this for all games just create a field here with game input which when clicked on the button automatically gets filled and then render everywhere.
// So only one route and we will refresh it every time to get data.
const eventDataSchema = new Schema({
    
    eventType: {
        type: String,
    },
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
    },
    description: {
        type: String,
    }
})


module.exports = mongoose.model('eventData', eventDataSchema);