const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { DERP_BOT_TOKEN } = require('../config');
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

const refreshCommands = async (client) => {
  const rest = new REST({ version: '9' }).setToken(DERP_BOT_TOKEN);
  const discordCommands = commands
  .map(command => new SlashCommandBuilder().setName(command.name).setDescription(command.description))
  .map(discordCommand => discordCommand.toJSON());

  try {
    console.log('Started refreshing application commands...');

    console.log(`Fetching guilds...`);
    // In the future this should page, no need to do that now.
    const guilds = await client.guilds.fetch();
    console.log(`Found ${guilds.size} guilds.`);

    console.log(`Sending application guild commands...`);
    const requests = guilds.map(guild => rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), {
      body: discordCommands,
    }));

    await Promise.all(requests);

    console.log('Successfully reloaded application commands.');
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
