const { SlashCommandBuilder } = require("discord.js");
const Task = require("../models/Task");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("newtask")
        .setDescription("Cria uma nova task")
        .addStringOption(option =>
            option
                .setName("name")
                .setDescription("Nome da task")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("description")
                .setDescription("Descrição da task")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("goal_personas")
                .setDescription("Meta de personas")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("goal_chars")
                .setDescription("Meta de caracteres")
                .setRequired(true)
        ),
    async execute(interaction) {
        const name = interaction.options.getString("name");
        const description = interaction.options.getString("description");
        const goalPersonas = interaction.options.getInteger("goal_personas");
        const goalChars = interaction.options.getInteger("goal_chars");

        try {
            await Task.create({
                t_name: name,
                t_description: description,
                goal_personas: goalPersonas,
                goal_chars: goalChars
            });
            await interaction.reply({
                content: `✅ Task **${name}** criada com sucesso!`
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "❌ Erro ao criar task.",
                ephemeral: true
            });
        }
    }
};