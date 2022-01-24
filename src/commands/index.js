const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { DERP_BOT_TOKEN, DERP_CLIENT_ID, DERP_GUILD_ID } = require('../config');
const ping = require('./ping');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { dispatch, spawnStateless } = require('nact');
const { readdirSync } = require('fs');

const commands = [];
const files = readdirSync(__dirname);
files
  .filter(filename => filename !== 'index.js')
  .forEach(filename => {
    const command = require(`./${filename}`);
    commands.push(command);
  });

const refreshCommands = async () => {
  const rest = new REST({ version: '9' }).setToken(DERP_BOT_TOKEN);
  const discordCommands = commands
  .map(command => new SlashCommandBuilder().setName(command.name).setDescription(command.description))
  .map(discordCommand => discordCommand.toJSON());

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationGuildCommands(DERP_CLIENT_ID, DERP_GUILD_ID), {
        body: discordCommands,
      },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
};

const createCommander = (system) => {
  const commandsByName = commands
    .reduce((all, current) => {
      all[current.name] = current;
      return all;
  }, {});

  return spawnStateless(system, async (msg, ctx) => {
    const { interaction } = msg;
    const { commandName } = interaction;

    let childCommand;
    if (ctx.children.has(commandName)) {
      childCommand = ctx.children.get(commandName);
    } else {
      childCommand = commandsByName[commandName].spawn(ctx.self);
    }

    dispatch(childCommand, msg);
  }, 'commander');
}

module.exports = {
  createCommander,
  refreshCommands,
};
