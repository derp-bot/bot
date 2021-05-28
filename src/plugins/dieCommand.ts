import { Message } from 'discord.js';
import Plugin from './plugin';
import { PluginContext } from './pluginRegistry';

export default function dieCommand(
  deathMessage: string = 'Time to die.',
): Plugin {
  return async ({ onCommand, logger }: PluginContext): Promise<void> => {
    onCommand('die', async (_message: Message): Promise<void> => {
      await logger.info(deathMessage);
      process.exit(0);
    });
  };
}
