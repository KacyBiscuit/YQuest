const { ButtonInteraction, Permissions, MessageEmbed, Constants } = require("discord.js");
const GuildSettings = require("../models/GuildSettings")

const embedPermission = new MessageEmbed()
	.setColor(Constants.Colors.RED)
	.setTitle(`<:Error:773585662720606229> Error!`)
	.setDescription('You dont have permission to do that!')
	.setTimestamp()

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute (interaction) {
        if (!interaction.isButton()) return;
        if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
            interaction.reply({
                embeds: [embedPermission]
            })
            return
        }
        const { guildId, customId, message } = interaction
        GuildSettings.findOne({ guild_id: interaction.guild.id }, (err, settings) => {
            if (err) throw err
            const embed = message.embeds[0]
            switch(customId) {
                case "quest-approve": {
                    interaction.client.channels.cache.get(settings.quest_channel_id).send({
                        embeds: [embed]
                    })
                    message.edit({embeds: [embed.setColor(Constants.Colors.GREEN)], components: []})
                }
                break;
                case "decline": {
                    message.edit({embeds: [embed.setColor(Constants.Colors.RED)], components: []})
                }
                break;
                case "bounty-approve": {
                    interaction.client.channels.cache.get(settings.bounty_channel_id).send({
                        embeds: [embed]
                    })
                    message.edit({embeds: [embed.setColor(Constants.Colors.GREEN)], components: []})
                }
                break;
            }
        })
    }
}