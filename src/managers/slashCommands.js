import { isAsyncCommand } from '../util.js';
import { isProduction } from '../config.js';
import log from 'simplog';

export class SlashCommandsManager {
  constructor(derp) {
    this.derp = derp;
    // A Map of string command name to async callback that runs the command.
    this.commands = new Map();
  }

  addCommand(builder, handler) {
    this.commands.set(builder.name, {
      builder,
      handler,
    });
  }

  async refreshCommands() {
    const discordCommands = [];
    for (let entry of this.commands.entries()) {
      const [ name, command ] = entry;
      discordCommands.push(command.builder.toJSON());
    }

    try {
      log.debug('Started refreshing application commands...');

      if (isProduction) {
        log.debug('Setting commands globally...');
        await this.derp.application.commands.set(discordCommands);

      } else {
        log.debug(`Fetching guilds...`);
        const guilds = await this.derp.guilds.fetch();
        log.debug(`Found ${guilds.size} guilds.`);

        log.debug(`Sending ${discordCommands.length} guild commands...`);
        const requests = guilds.map(guild => this.derp.guilds.resolve(guild.id).commands.set(discordCommands));
        await Promise.all(requests);
      }

      log.debug('Successfully sent application commands.');
    } catch (error) {
      log.error(error);
    }
  }

  async onSlashCommand(interaction) {
    if (!interaction.isCommand()) {
      return;
    }

    const command = this.commands.get(interaction.commandName);
    if (!command) {
      log.warn(`Unknown slash command: ${interaction.commandName}`);
      return
    }

    const { handler } = command;

    if (isAsyncCommand(handler)) {
      interaction.channel.sendTyping();
    }

    handler(this.derp, interaction);
  }

}
