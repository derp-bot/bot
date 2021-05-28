import Plugin from './plugin';
import PluginContext from './pluginContext';
import { PluginHelper } from './pluginRegistry';

export default function readyLogger(): Plugin {
  return async function ({ onReady, logger }: PluginHelper) {
    onReady(async (_context: PluginContext): Promise<void> => {
      await logger.info('Bot is ready to go.');
    });
  };
}
