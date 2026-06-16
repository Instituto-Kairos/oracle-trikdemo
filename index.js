//
// -> import --------------------------------------------------
//

const fs = require("node:fs");
const path = require("node:path");

const {
    Client,
    Collection,
    GatewayIntentBits,
    REST,
    Routes
} = require("discord.js");

//
// -> config --------------------------------------------------
//

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const oracle = new Client({
    intents: [    
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

//
// -> register ------------------------------------------------
//

oracle.commands = new Collection();

const commands = [];

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const filePath =
        path.join(commandsPath, file);
    const command = require(filePath);
    oracle.commands.set(
        command.data.name,
        command
    );
    commands.push(
        command.data.toJSON()
    );
}

const rest = new REST({
    version: "10"
}).setToken(token);
(async () => {
    try {
        console.log(
            "🗂️ Verificando registros..."
        );
        await rest.put(
            Routes.applicationGuildCommands(
                clientId,
                guildId
            ),
            { body: commands }
        );
        console.log(
            "✅ Serviços Iniciados."
        );
    } catch (error) {
        console.error(error);
    }
})();

//
// -> events --------------------------------------------------
//


const eventsPath =
    path.join(__dirname, "events");

const eventFiles =
    fs.readdirSync(eventsPath)
    .filter(
        file => file.endsWith(".js")
    );

for (const file of eventFiles) {

    const filePath =
        path.join(eventsPath, file);

    const event =
        require(filePath);

    oracle.on(
        event.name,
        (...args) =>
            event.execute(...args)
    );

}

//
// -> ready -------------------------------------------------
//

oracle.once("clientReady", () => {
    console.log(
        `💽 Online. #${oracle.user.tag}`
    );
});

//
// -> execute -------------------------------------------------
//

oracle.on(
    "interactionCreate",
    async interaction => {
        if (
            !interaction.isChatInputCommand()
        ) return;
        const command =
            oracle.commands.get(
                interaction.commandName
            );
        if (!command) return;
        try {
            await command.execute(
                interaction
            );
        } catch (error) {
            console.error(error);
            if (interaction.replied) {
                await interaction.followUp({
                    content:
                        "Erro ao executar comando.",
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content:
                        "Erro ao executar comando.",
                    ephemeral: true
                });
            }
        }
    }
);

//
// -> start ---------------------------------------------------
//

oracle.login(token);