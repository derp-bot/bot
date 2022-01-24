// Initialize our environment.
require('dotenv').config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

const {
  DERP_BOT_TOKEN,
  DERP_CLIENT_ID,
  DERP_GUILD_ID,
} = process.env;

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(DERP_BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(DERP_CLIENT_ID, DERP_GUILD_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.login(DERP_BOT_TOKEN);
