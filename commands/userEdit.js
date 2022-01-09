const {SlashCommandBuilder, SlashCommandStringOption} = require("@discordjs/builders")
const {MessageEmbed, Constants, Permissions } = require("discord.js")
const UserProfile = require("../models/UserProfile")
const GroupSchema = require("../models/GroupSchema")
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

const embedSuccess = new MessageEmbed()
	.setColor(Constants.Colors.GREEN)
	.setTitle(`<:Success:773585663689490432> Success!`)
	.setDescription('Successfully created new quest!')
	.setTimestamp()

const cmd = new SlashCommandBuilder()
.setName("user-edit")
.setDescription("Edit a user's profile.")
.addMentionableOption(option => option
    .setName("user")
    .setDescription("The user you'd like to edit")
    .setRequired(true))
.addStringOption(option => option
    .setName("bio")
    .setDescription("The user's bio")
    .setRequired(false))
.addStringOption(option => option
    .setName("guild")
    .setDescription("The guild the user is part of")
    .setRequired(false)
    .addChoice("Not yet available", "false"))
.addStringOption(option => option
    .setName("nation")
    .setDescription("The user's nation")
    .setRequired(false))

module.exports = {
    data: cmd,
    async execute(interaction) {  
        if((!interaction.member.permissions.has([Permissions.FLAGS.MANAGE_GUILD]) && (interaction.member.id != interaction.options.getMentionable("user").id))) {
            interaction.reply({
                embeds: [embedPermission],
                ephemeral: true
            })
            return
        }   
        UserProfile.findOne({ guild_id: interaction.guild.id, user_id: interaction.options.getMentionable("user").id }, (err, user) => {
            if (err) {
                console.log(err)
                interaction.reply({
                    embeds: [embedError],
                    ephemeral: true
                })
                return
            }
            if (!user) {
                user = new UserProfile({
                    guild_id: interaction.guild.id,
                    user_id: interaction.options.getMentionable("user").id,
                    nation: 'None',
                    group: 'None',
                    bio: 'None'
                })
            }
            if(interaction.options.getString("bio")) {
                if (interaction.options.getString("bio").length > 1023) {
                    user.bio = interaction.options.getString("bio").substr(0,1020) + "..."
                } else {
                    user.bio = interaction.options.getString("bio")
                }
            }
            if(interaction.options.getString("nation")) {
                NationSchema.findOne({ guild_id: interaction.guild.id, name: interaction.options.getString("nation")}, (err, nation) => {
                    if (err) {
                        console.log(err)
                        interaction.reply({
                            embeds: [embedError],
                            ephemeral: true
                        })
                        return
                    }
                    if(!nation) {
                        interaction.reply({
                            content: "Nation not found",
                            embeds: [embedError],
                            ephemeral: true
                        })
                        return
                    }
                })
                user.nation = interaction.options.getString("nation")
            }
            if(interaction.options.getString("guild")) {
                user.guild = interaction.options.getString("guild")
            }
            user.save(err => {
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
                    .setDescription(`Succesfully edited user "${interaction.options.getMentionable("user")}"`)
                    .setTimestamp()
                ]})
            })
        }) 
    }
 }