import Plugin from './plugin';
import { PluginContext } from './pluginRegistry';

export default function readyLogger(): Plugin {
  return async function ({ onReady, logger }: PluginContext) {
    onReady(async (): Promise<void> => {
      await logger.info('Bot is ready to go.');
    });
  };
}
