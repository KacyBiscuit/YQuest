const mongoose = require('mongoose')

const GroupSchema = new mongoose.Schema({
    guild_id: String,
    name: String,
    nation: String,
    logo: String
})

module.exports = mongoose.model('GroupSchema', GroupSchema)