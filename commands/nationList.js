const {SlashCommandBuilder} = require("@discordjs/builders")
const {MessageEmbed, Constants} = require('discord.js')
const NationSchema = require("../models/NationSchema")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nation-list")
        .setDescription("temp"),
    async execute(interaction) {
        NationSchema.find({ guild_id: interaction.guild.id }, (err, nations) => {
            const embedSuccess = new MessageEmbed()
	            .setColor(Constants.Colors.BLURPLE)
	            .setTitle(`Nations for ${interaction.guild.name}`)
	            .setDescription(`${nations.length} Nations found!`)
	            .setTimestamp()
            nations.forEach((nation, index) => {
                embedSuccess.addField(`**${index + 1}:** ${nation.name}`, `Colour: ${nation.colour}`, true)
            })
            interaction.reply({embeds: [embedSuccess]})
        })
    }
}