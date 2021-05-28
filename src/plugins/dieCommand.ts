import { Message } from 'discord.js';
import Plugin from './plugin';
import { PluginHelper } from './pluginRegistry';

export default function dieCommand(
  deathMessage: string = 'Time to die.',
): Plugin {
  return async ({ onCommand, logger }: PluginHelper): Promise<void> => {
    onCommand('die', async (_message: Message): Promise<void> => {
      await logger.info(deathMessage);
      process.exit(0);
    });
  };
}
