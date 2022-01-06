const {SlashCommandBuilder} = require("@discordjs/builders")
const {MessageEmbed, Constants, Permissions } = require("discord.js")
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
    
const embedSuccess = new MessageEmbed()
    .setColor(Constants.Colors.GREEN)
    .setTitle(`<:Success:773585663689490432> Success!`)
    .setDescription('Successfully created new bounty!')
    .setTimestamp()


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
        .setName("createbounty")
        .setDescription("Create a bounty.")
        .addIntegerOption(option => option
            .setName("difficulty")
            .setDescription("Values not between 0 and 11 will be converted to the nearest extreme")
            .setRequired(true))
        .addStringOption(option => option
            .setName("bounty-master")
            .setDescription("Who created the bounty?")
            .setRequired(true))
        .addStringOption(option => option
            .setName("bounty-location")
            .setDescription("Where is this bounty available?")
            .setRequired(true))
        .addStringOption(option => option
            .setName("bounty-objective")
            .setDescription("What is the objective of the bounty")
            .setRequired(true))
        .addStringOption(option => option
            .setName("confirmation-location")
            .setDescription("Where do you go to finish the bounty?")
            .setRequired(true))
        .addStringOption(option => option
            .setName("reward-type")
            .setDescription("Is the reward in money or an item?")
            .addChoice("Cash Reward", "true")
            .addChoice("Item Reward", "false")
            .setRequired(true))
        .addIntegerOption(option => option
            .setName("cash-reward")
            .setDescription("Set to 0 if you previously selected Item Reward")
            .setRequired(true))
        .addStringOption(option => option
            .setName("item-reward")
            .setDescription("Leave blank if the reward is in cash")
            .setRequired(false))
        .addStringOption(option => option
            .setName("notes")
            .setDescription("Leave blank if none")
            .setRequired(false)),
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
            if(!settings) {
                interaction.reply({
                    content: "No server settings found",
                    embeds: [embedError],
                    ephemeral: true
                })
                return
            }
            if(!interaction.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES])) {
                interaction.reply({
                    content: "This is only temporary, but fornow creating bountys is an admin only feature because Kacy is tired and needs rest",
                    embeds: [embedPermission],
                    ephemeral: true
                })
                return
            }
            if (!interaction.client.channels.cache.get(settings.bounty_channel_id)) {
                interaction.reply({
                    content: "No bounty channel found",
                    embeds: [embedError],
                    ephemeral: true
                })
                return
            }
            let dif = interaction.options.getInteger("difficulty");
            if(dif > 11) dif = 11;
            if(dif < 0) dif = 0;
            let stars = ''
            for (let i = 0; i < dif; i++) {
                stars += "<:star:928672116679798804>"
            }
            for (let i = 10; i > dif; i--) {
                stars += "<:grey:928672116667207690>"
            }
            if(dif == 11){
                stars = `<:red:928672116411359303>
                         <:red:928672116411359303>
                         <:red:928672116411359303>
                         <:red:928672116411359303>
                         <:red:928672116411359303>
                         <:red:928672116411359303>
                         <:red:928672116411359303>
                         <:red:928672116411359303>
                         <:red:928672116411359303>
                         <:red:928672116411359303>`
            }
            const embedFinal = new MessageEmbed()
            .setColor(Constants.Colors.BLURPLE)
            .setTitle(`New bounty created by ${interaction.user.name}`)
            .setDescription(stars)
            .addFields(
                {name: 'Bounty Master:', value: interaction.options.getString("bounty-master"), inline: true},
                {name: 'Location:', value: interaction.options.getString("bounty-location"), inline: true},
                {name: 'Objective:', value: interaction.options.getString("bounty-objective"), inline: true},
                {name: 'Confirmation:', value: interaction.options.getString("confirmation-location"), inline: true},
            )
            if(interaction.options.getString("reward-type") == "true") {
                let emoji = interaction.client.emojis.cache.get(settings.currency.replace(/[^0-9]/g, ''));
                if (!emoji) emoji = settings.currency
                embedFinal.addField("Reward:", `${emoji}${new Intl.NumberFormat().format(interaction.options.getInteger("cash-reward"))}`, true)
            } else {
                embedFinal.addField("Reward:", interaction.options.getString("item-reward"), true)
            }
            if(interaction.options.getString("notes")) embedFinal.addField("Notes:", interaction.options.getString("notes"), true)
            interaction.client.channels.cache.get(settings.bounty_channel_id).send({
                embeds: [embedFinal]}
            )
            interaction.reply({
                embeds: [embedSuccess]
            })
        })
    }
 }