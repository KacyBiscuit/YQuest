const {SlashCommandBuilder} = require("@discordjs/builders")
const {MessageEmbed, Constants} = require("discord.js")
const GuildSettings = require("../models/GuildSettings")

function boolToEmoji(bool) {
    if(bool) {
        return '<:Success:773585663689490432>'
    }
    else {
        return '<:Error:773585662720606229>'
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("View server settings."),
    async execute(interaction) {
        const guildSettings = await GuildSettings.findOne({guild_id: interaction.guild.id})
        if (!guildSettings) {
            const embedError = new MessageEmbed()
	        .setColor(Constants.Colors.RED)
	        .setTitle(`{<:Error:773585662720606229> Error!`)
	        .setDescription('Something went wrong!')
	        .setTimestamp()
            interaction.reply({
                embeds: [embedError],
                ephermal: true
            })
            return
        }
        const embedSettings = new MessageEmbed()
	        .setColor(Constants.Colors.BLURPLE)
	        .setTitle(`Settings for **${interaction.guild.name}**!`)
	        .setDescription(`Guild ID: ${guildSettings.guild_id}`)
            .addFields(
                {name: 'Currency', value: `${guildSettings.currency}`},
                {name: 'Bounty Approval', value: `${boolToEmoji(guildSettings.bounty_approval)}`},
                {name: 'Bounty Channel', value: `<#${guildSettings.bounty_channel_id}>`, inline: true},
                {name: 'Quest Approval', value: `${boolToEmoji(guildSettings.quest_approval)}`},
                {name: 'Quest Channel', value: `<#${guildSettings.quest_channel_id}>`, inline: true},
                )
	        .setTimestamp()

        interaction.reply({
            embeds: [embedSettings]
        })
    }
}