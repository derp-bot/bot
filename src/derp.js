import { Client, Intents } from 'discord.js';
import { SlashCommandsManager } from './managers/slashCommands.js';
import log from 'simplog';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir } from 'fs';

export class Derp extends Client {
  constructor() {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
      ]
    });

    this.slashCommands = new SlashCommandsManager(this);

    this.on('ready', () => this.initialize());
    this.on('interactionCreate', interaction => this.slashCommands.onSlashCommand(interaction));

    // Load all our slash commands.
    const commandsPath = fileURLToPath(import.meta.url);
    const commandsDir = join(dirname(commandsPath), 'commands');
    readdir(commandsDir, async (err, files) => {
      if (err) {
        log.error(`Error reading commands: ${err}`);
        return;
      }

      files.forEach(async (file) => {
        try {
          log.debug(`Loading ${file}...`)
          const commandModule = await import(join(commandsDir, file));
          commandModule.default(this.slashCommands);
        } catch (err) {
          log.error(`Error reading ${file}: ${err}`);
        }
      });

      log.debug('Done.');

    });
  }

  initialize() {
    this.slashCommands.refreshCommands();
  }

}
