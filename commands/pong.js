const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responde com pong e latência'),
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === 'ping') {
            const sent = await interaction.reply({
                content: '🏓 Pong...',
                fetchReply: true
            });

        const latency =
            sent.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply(
            `🏓 Pong!\nLatência: ${latency}ms`
            );
        }
    }
};