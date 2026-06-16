require('dotenv').config();
require('sequelize');

const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder
} = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

// Criar cliente
const client = new Client({
    intents: [    
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const Persona = require("./tabels/Persona");
const Task = require("./tabels/Task");
const PersonaTask = require("./tabels/PersonaTask");

Persona.belongsToMany(Task, {
    through: PersonaTask,
    foreignKey: "p_rowid"
});

Task.belongsToMany(Persona, {
    through: PersonaTask,
    foreignKey: "t_rowid"
});

module.exports = {
    Persona,
    Task,
    PersonaTask
};

// Criar comando
const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responde com pong e latência')
        .toJSON()
];

// Regex para indentificar tag
const tagRegex =
/^(?:\|\|)?\[(PER\d+)-(\d+)\/(\d+)#(TASK\d+)\](?:\|\|)?\s*([\s\S]*)$/;

// Registrar comandos
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('🗂️ Verificando registros...');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log('Serviços Iniciados.');
  } catch (error) {
    console.error(error);
  }
})();

//
// -> start -------------------------------------------------------------------------
//

client.once('clientReady', () => {
  console.log(`Bot logado como ${client.user.tag}`);
});

//
// -> task counter ------------------------------------------------------------------
//

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'newtask') {
        const sent = await interaction.reply({
            content: 'Cria uma nova tarefa na tabela Task',
            fetchReply: true
        }); 

        
    }
});

//
// -> task counter ------------------------------------------------------------------
//

const messageParts = {};

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const match = message.content.match(tagRegex);
    if (!match) return;

    const personagem = match[1];
    const parte = match[2];
    const totalPartes = parseInt(match[3]);
    const task = match[4];
    const texto = match[5];

    if (parte > totalPartes) {
        console.log("Parte inválida");
        return;
    }

    const key = `${personagem}-${task}`;

    if (!messageParts[key]) {
        messageParts[key] = {
            total: totalPartes,
            partes: {}
        };
    }

    messageParts[key].partes[parte] = texto;

    console.log(`Parte ${parte} recebida`);

    const partesRecebidas =
        Object.keys(messageParts[key].partes).length;

    if (partesRecebidas === totalPartes) {

        const partesOrdenadas =
            Object.keys(messageParts[key].partes)
            .sort((a, b) => a - b);

        const mensagemCompleta =
            partesOrdenadas
            .map(p =>
                messageParts[key].partes[p]
            )
            .join(" ");

        const totalCaracteres =
            mensagemCompleta.length;

        console.log(
            `Total caracteres (${key}):`,
            totalCaracteres
        );

        delete messageParts[key];
    }
});

//
// -> login -------------------------------------------------------------------------
//

client.login(token);