// Initialize our environment.
require('dotenv').config();

const { DERP_BOT_TOKEN } = require('./config');
const { Client, Intents } = require('discord.js');
const { start, dispatch, spawn } = require('nact');
const { createCommander, refreshCommands } = require('./commands');

const system = start();
const commander = createCommander(system);


const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
  ],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Now that we're logged in, refresh our commands.
  refreshCommands(client);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  dispatch(commander, { interaction, });
});

client.login(DERP_BOT_TOKEN);
