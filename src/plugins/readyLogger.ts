import Plugin from './plugin';
import { PluginHelper } from './pluginRegistry';

export default function readyLogger(): Plugin {
  return async function ({ onReady, logger }: PluginHelper) {
    onReady(async (): Promise<void> => {
      await logger.info('Bot is ready to go.');
    });
  };
}
