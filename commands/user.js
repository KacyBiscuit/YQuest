const {SlashCommandBuilder} = require("@discordjs/builders")
const {MessageEmbed, Message, Constants} = require('discord.js')
const { Client } = require('unb-api');
const UserProfile = require("../models/UserProfile")
const GroupSchema = require("../models/GroupSchema")
const NationSchema = require("../models/NationSchema")
const GuildSettings = require("../models/GuildSettings")
require("dotenv").config();

const unclient = new Client(process.env.UNBOAT_TOKEN);

const embedError = new MessageEmbed()
	.setColor(Constants.Colors.RED)
	.setTitle(`<:Error:773585662720606229> Error!`)
	.setDescription('Something went wrong')
	.setTimestamp()

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("get information on a user")
        .addMentionableOption(option => option
            .setName("user")
            .setDescription("The User you want info on")
            .setRequired(false)),
    async execute(interaction) {
        let user
        try{
            if(!interaction.options.getMentionable("user")) user = interaction.member
            else {user = interaction.options.getMentionable("user")}
        } 
        catch(err) {interaction.reply({embeds: [embedError]})}
        
        unclient.getUserBalance(interaction.guild.id, user.id).then(bank => {
        GuildSettings.findOne({ guild_id: interaction.guild.id }, (err, settings) => {
            if (err) {
                console.log(err)
                interaction.reply({
                    embeds: [embedError],
                    ephemeral: true
                })
                return
            }
            UserProfile.findOne({ guild_id: interaction.guild.id, user_id: user.id }, (err2, profile) => {
                if (err2) {
                    console.log(err2)
                    interaction.reply({
                        embeds: [embedError],
                        ephemeral: true
                    })
                    return
                }
                if (!profile) {
                    interaction.reply({
                        content: "User does not have a valid profile, use \`/user-edit\` to give them some properties",
                        embeds: [embedError],
                        ephemeral: true
                    })
                    return
                }
                NationSchema.findOne({ guild_id: interaction.guild.id, name: profile.nation }, (err3, nation) => {
                    if (err3) {
                        console.log(err3)
                        interaction.reply({
                            embeds: [embedError],
                            ephemeral: true
                        })
                        return
                    }
                    const embed = new MessageEmbed()
                        .setTitle(user.displayName)
                        .setDescription(`Aka: ${user.user.username}\nID: ${user.id}`)
                        .setThumbnail(user.displayAvatarURL(true))
                        .setColor(nation.colour ?? Constants.Colors.DARK_BUT_NOT_BLACK)
                        .addField("📜Guild:", profile.group ?? "Not In Guild", true)
                        .addField("💸Bank", `  Cash: ${settings.currency} ${bank.cash}\n  Bank: ${settings.currency} ${bank.bank}`, true)
                        .addField("✏️Bio", profile.bio ?? `No bio set, set one with \`/user-edit ${user.username}#${user.discriminator} bio:<Text Here>\``, false)
                    interaction.reply({embeds:[embed]})
                })
            })
        })
        });
    }
}