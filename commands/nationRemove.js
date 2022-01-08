const {SlashCommandBuilder} = require("@discordjs/builders")
const {MessageEmbed, Constants, Permissions} = require('discord.js')
const NationSchema = require("../models/NationSchema")

const embedError = new MessageEmbed()
	.setColor(Constants.Colors.RED)
	.setTitle(`<:Error:773585662720606229> Error!`)
	.setDescription('Something went wrong')
	.setTimestamp()

const embedPermission = new MessageEmbed()
	.setColor(Constants.Colors.RED)
	.setTitle(`<:Error:773585662720606229> Error!`)
	.setDescription('You dont have permission to do that!')
	.setTimestamp()

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nation-remove")
        .setDescription("temp")
        .addStringOption(option => option
            .setName("name")
            .setDescription("The name of the nation you'd like to delete")
            .setRequired(true)),
    async execute(interaction) {
        if(!interaction.member.permissions.has([Permissions.FLAGS.MANAGE_GUILD])) {
            interaction.reply({
                embeds: [embedPermission],
                ephemeral: true
            })
            return
        }
        NationSchema.deleteOne({ guild_id: interaction.guild.id, name: interaction.options.getString("name") }, function(err, result) {
            if (err) {
              console.log(err);
              interaction.reply({embeds: [embedError]})
            } else {
                if(!result) {
                    interaction.reply({content: "No nations found with this name", embeds: [embedError]})
                    return
                }
            }
        })
        const embedSuccess = new MessageEmbed()
            .setColor(Constants.Colors.GREEN)
            .setTitle(`<:Success:773585663689490432> Success!`)
            .setDescription(`Successfully removed ${interaction.options.getString("name")}!`)
            .setTimestamp()
        interaction.reply({embeds: [embedSuccess]})
    }
}