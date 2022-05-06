const {
  DERP_BOT_TOKEN,
  GITHUB_SHA,
} = require('./config');
const { Client, Intents } = require('discord.js');
const { start, dispatch, spawn } = require('nact');
const { createCommander, refreshCommands, dispatchCommand } = require('./commands');
const log = require('simplog');

const system = start();

createCommander(system);

log.info(`Starting the derp sha:${GITHUB_SHA || 'unknown'}`);

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
  ],
});

client.on('ready', () => {
  log.debug(`Logged in as ${client.user.tag}!`);

  // Now that we're logged in, refresh our commands.
  refreshCommands(client);
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    dispatchCommand(interaction);
  }
});

client.login(DERP_BOT_TOKEN);
