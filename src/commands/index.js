const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { DERP_BOT_TOKEN } = require('../config');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { dispatch, spawnStateless, spawn, query } = require('nact');
const { readdirSync } = require('fs');
const log = require('simplog');

const REGISTER_COMMAND = Symbol('register-command');
const INVOKE_COMMAND = Symbol('invoke-command');
const GET_COMMAND_LIST = Symbol('get-command-list');

const files = readdirSync(__dirname);
let commander;

const registerCommand = (commandSpec) => {
  const {
    name,
    description,
    cb,
  } = commandSpec;

  if (!name) {
    throw Error('name is required');
  }
  if (!description) {
    throw Error('description is required');
  }

  const childActor = spawnStateless(commander, cb, name);

  dispatch(commander, {
    type: REGISTER_COMMAND,
    payload: {
      ...commandSpec,
      childActor,
    }
  });
};

const createCommander = (system) => {
  commander = spawn(system, async (state = {}, msg, ctx) => {
    const { payload } = msg;
    const { name } = payload;

    switch (msg.type) {

      case REGISTER_COMMAND:
        return {
          ...state,
          [name]: payload,
        };

      case INVOKE_COMMAND:
        const child = ctx.children.get(name);
        if (child) {
          dispatch(child, msg);
        } else {
          console.error(`No command found with the name ${name}`);
        }
        break;

      case GET_COMMAND_LIST:
        const commands = Object.keys(state)
        .map(commandName => ({
          ...state[commandName],
        }));
        dispatch(msg.payload.sender, commands);
        break;

      default:
      throw Error(`invalid message type in commander: ${msg.type}`);
    }
  }, 'commander');

  files
    .filter(filename => filename !== 'index.js')
    .forEach(filename => {
      require(`./${filename}`);
    });

  return commander;
}

const refreshCommands = async (client) => {
  const rest = new REST({ version: '9' }).setToken(DERP_BOT_TOKEN);

  const commands = await query(commander, (sender) => ({
    type: GET_COMMAND_LIST,
    payload: {
      sender,
    },
  }), 250);

  const discordCommands = commands
  .map(commandSpec => {
    let newCommand = new SlashCommandBuilder()
    .setName(commandSpec.name)
    .setDescription(commandSpec.description)
    .setDefaultPermission(true);

    if (commandSpec.options) {
      commandSpec.options.forEach(optionSpec => {
        newCommand = newCommand.addStringOption(option => option.setName(optionSpec.name)
          .setDescription(optionSpec.description)
          .setRequired(true));
      });
    }

    return newCommand;
  })
  .map(discordCommand => discordCommand.toJSON());

  try {
    log.debug('Started refreshing application commands...');

    log.debug(`Fetching guilds...`);
    // In the future this should page, no need to do that now.
    const guilds = await client.guilds.fetch();
    log.debug(`Found ${guilds.size} guilds.`);

    log.debug(`Sending application guild commands...`);
    const requests = guilds.map(guild => rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), {
      body: discordCommands,
    }));

    await Promise.all(requests);

    log.debug('Successfully reloaded application commands.');
  } catch (error) {
    log.error(error);
  }
};

const dispatchCommand = (interaction) => {
    dispatch(commander, {
      type: INVOKE_COMMAND,
      payload: {
        name: interaction.commandName,
        interaction
      },
    });
};

module.exports = {
  registerCommand,
  createCommander,
  refreshCommands,
  dispatchCommand,
};
