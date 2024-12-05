// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String
    },
    googleId: {
        type: String
    },
    facebookId: {
        type: String
    },
    githubId: {
        type: String
    }
});

module.exports = mongoose.model('User', UserSchema);
