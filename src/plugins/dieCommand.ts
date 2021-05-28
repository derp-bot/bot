import Plugin from './plugin';
import PluginContext from './pluginContext';
import { PluginHelper } from './pluginRegistry';

export default function dieCommand(deathMessage = 'Time to die.'): Plugin {
  return async function ({ onCommand, logger }: PluginHelper) {
    onCommand('die', async (_context: PluginContext): Promise<void> => {
      await logger.info(deathMessage);
      process.exit(0);
    });
  };
}
