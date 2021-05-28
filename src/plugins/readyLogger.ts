import Plugin from './plugin';
import { PluginContext } from './pluginRegistry';

export default function readyLogger(): Plugin {
  return async ({ onReady, logger }: PluginContext): Promise<void> => {
    onReady(async (): Promise<void> => {
      await logger.info('Bot is ready to go.');
    });
  };
}
