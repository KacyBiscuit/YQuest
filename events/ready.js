const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();

module.exports = {
    name: "ready",
    once: true,
    execute (client, commands) {
        const CLIENT_ID = client.user?.id

        const rest = new REST({
            version: '9'
        }).setToken(process.env.TOKEN || '');
    
        (async () => {
            try {
                if (process.env.ENV === "production") {
                    await rest.put(Routes.applicationCommands(CLIENT_ID), {
                        body: commands
                    })
                    console.log("Commands registered Globally")
                } else {
                    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.TEST_GUILD_ID_ONE), {
                        body: commands
                    })
                    console.log("Commands registered Locally")
                }
            } catch (err) {
                if (err) console.error(err)
            }
        })();
    
    }
}