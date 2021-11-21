const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bgmiSchema = new Schema({
    name: {
        type: String,
    },
    teamName: {
        type: String,
    },
    ign: {
        type: String,
    },
    p2n: {
        type: String,
    },
    ign2: {
        type: String,
    },
    uid2: {
        type: String,
    },
    p3n: {
        type: String,
    },
    ign3: {
        type: String,
    },
    uid3: {
        type: String,
    },
    p4n: {
        type: String,
    },
    ign4: {
        type: String,
    },
    uid4: {
        type: String,
    },
    teamLogo: {
        url: String,
        fileName: String,
    },
})

module.exports = mongoose.model('Bgmi', bgmiSchema);
