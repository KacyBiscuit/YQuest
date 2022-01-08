const mongoose = require('mongoose')

const UserProfileSchema = new mongoose.Schema({
    guild_id: String,
    user_id: String,
    nation: String,
    group: String,
    bio: String
})

module.exports = mongoose.model('UserProfile', UserProfileSchema)