const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { DERP_BOT_TOKEN } = require('../config');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { dispatch, spawnStateless, spawn, query } = require('nact');
const { readdirSync } = require('fs');

const REGISTER_COMMAND = Symbol('register-command');
const INVOKE_COMMAND = Symbol('invoke-command');
const GET_COMMAND_LIST = Symbol('get-command-list');

const files = readdirSync(__dirname);
let commander;

const registerCommand = (name, description, cb) => {
  const childActor = spawnStateless(commander, cb, name);

  dispatch(commander, {
    type: REGISTER_COMMAND,
    payload: {
      name,
      description,
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
          name: commandName,
          description: state[commandName].description,
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
  .map(command => new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description)
  )
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
