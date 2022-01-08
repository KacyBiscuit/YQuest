const {SlashCommandBuilder} = require("@discordjs/builders")
const {MessageEmbed, Constants, Permissions } = require("discord.js")
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
        .setName("nation-add")
        .setDescription("Add a nation to the list.")
        .addStringOption(option => option
            .setName("name")
            .setDescription("The name of the nation")
            .setRequired(true))
        .addStringOption(option => option
            .setName("colour")
            .setDescription("The colour that will be shown on a users profile")
            .addChoice("Red", "RED")
            .addChoice("Orange", "ORANGE")
            .addChoice("Yellow", "YELLOW")
            .addChoice("Green", "GREEN")
            .addChoice("Aqua", "AQUA")
            .addChoice("Blue", "BLUE")
            .addChoice("Purple", "BLURPLE")
            .addChoice("White", "WHITE")
            .setRequired(true)),
    async execute(interaction) {
        if(!interaction.member.permissions.has([Permissions.FLAGS.MANAGE_GUILD])) {
            interaction.reply({
                embeds: [embedPermission],
                ephemeral: true
            })
            return
        }
        NationSchema.findOne({ guild_id: interaction.guild.id, name: interaction.options.getString("name") }, (err, nation) => {
            NationSchema.find({ guild_id: interaction.guild.id }, (err, nations) => {
                if (err) {
                    console.log(err)
                    interaction.reply({
                        embeds: [embedError],
                        ephemeral: true
                    })
                    return
                }
                if (nations.length >= 20) {
                    interaction.reply({
                        content: "Too many nations, please stop it.",
                        embeds: [embedError],
                        ephemeral: true
                    })
                    return
                }
            });
            if (err) {
                console.log(err)
                interaction.reply({
                    embeds: [embedError],
                    ephemeral: true
                })
                return
            }
            if(nation) {
                interaction.reply({
                    content: "Nation with this name already exists",
                    embeds: [embedError],
                    ephemeral: true
                })
                return
            }
            let finalColour
            switch(interaction.options.getString("colour")) {
                case "RED": finalColour = Constants.Colors.RED
                break;
                case "ORANGE": finalColour = Constants.Colors.ORANGE
                break;
                case "YELLOW": finalColour = Constants.Colors.YELLOW
                break;
                case "GREEN": finalColour = Constants.Colors.GREEN
                break;
                case "AQUA": finalColour = Constants.Colors.AQUA
                break;
                case "BLUE": finalColour = Constants.Colors.BLUE
                break;
                case "BLURPLE": finalColour = Constants.Colors.BLURPLE
                break;            
                case "WHITE": finalColour = Constants.Colors.WHITE
                break;
            }   
            nation = new NationSchema({
                guild_id: interaction.guild.id,
                name: interaction.options.getString("name"),
                colour: finalColour
            })
            nation.save(err => {
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
                    .setColor(finalColour) 
                    .setDescription(`Succesfully created nation "${interaction.options.getString("name")}"`)
                    .setTimestamp()
                ]})
            })
        }) 
    }
 }