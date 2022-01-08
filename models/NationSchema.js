const mongoose = require('mongoose')

const NationSchema = new mongoose.Schema({
    guild_id: String,
    name: String,
    colour: Number
})

module.exports = mongoose.model('NationSchema', NationSchema)