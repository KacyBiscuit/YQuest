const mongoose = require('mongoose')

const GuildSettingsSchema = new mongoose.Schema({
    guild_id: String,
    currency: String,
    quest_approval: Boolean,
    quest_channel_id: String,
    bounty_approval: Boolean,
    bounty_channel_id: String
})

module.exports = mongoose.model('GuildSettings', GuildSettingsSchema)