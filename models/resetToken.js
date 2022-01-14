const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');

const resetTokenSchema = new Schema({
    
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        expires: 3600, // 1hr 
        default: Date.now(),
    }
});

// below is used to hash the token if modified.
resetTokenSchema.pre("save", async function (next) {
    if(this.isModified("token")) {
        const hash = await bcrypt.hash(this.token, 8);
        this.token = hash;
    }
    next();
});

resetTokenSchema.methods.compareToken = async function (token) {
    const result = await bcrypt.compareSync(token, this.token);
    return result;
};

resetTokenSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('ResetToken', resetTokenSchema);