const {SlashCommandBuilder} = require("@discordjs/builders");
const {Permissions, MessageEmbed, Constants} = require("discord.js")
const GuildSettings = require("../models/GuildSettings")

const embedError = new MessageEmbed()
	.setColor(Constants.Colors.RED)
	.setTitle(`{<:Error:773585662720606229> Error!`)
	.setDescription('Something went wrong!')
	.setTimestamp()

const embedPermission = new MessageEmbed()
	.setColor(Constants.Colors.RED)
	.setTitle(`<:Error:773585662720606229> Error!`)
	.setDescription('You dont have permission to do that!')
	.setTimestamp()

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setquestchannel")
        .setDescription("Set where new quests will appear.")
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("Where the quests will appear.")
            .setRequired(true)),
            async execute(interaction) {
                if(!interaction.member.permissions.has([Permissions.FLAGS.MANAGE_GUILD])) {
                    interaction.reply({
                        embeds: [embedPermission],
                        ephemeral: true
                    })
                    return
                }
                GuildSettings.findOne({ guild_id: interaction.guild.id }, (err, settings) => {
                    if (err) {
                        console.log(err)
                        interaction.reply({
                            embeds: [embedError],
                            ephemeral: true
                        })
                        return
                    }
                    if (!settings) {
                        settings = new GuildSettings({
                            guild_id: interaction.guild.id,
                            currency: "£",
                            quest_approval: true,
                            quest_channel_id: interaction.options.getChannel("channel").id,
                            bounty_approval: true,
                            bounty_channel_id: "please set a bounty channel"
                        })
                    } else {
                        settings.quest_channel_id = interaction.options.getChannel("channel").id
                    }
        
                    settings.save(err => {
                        if (err) {
                            console.log(err)
                            interaction.reply({
                                embeds: [embedError],
                                ephemeral: true
                            })
                            return
                        }
                        interaction.reply({embeds: [new MessageEmbed()
                            .setTitle('<:Success:773585663689490432> Success!')
                            .setColor(Constants.Colors.GREEN) 
                            .setDescription(`Sucessfully set to ${interaction.options.getChannel("channel")}`)
                            .setTimestamp()
                        ]})
                    })
                })
            }
}