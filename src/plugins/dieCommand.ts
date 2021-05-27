import Plugin from './plugin';
import PluginContext from './pluginContext';

export default class DieCommand extends Plugin {
  constructor() {
    super(['message']);
  }

  async onMessage(context: PluginContext): Promise<void> {
    const { message } = context.data;
    if (message.content === '!die') {
      console.log('Time to die.');
      process.exit(0);
    }
  }
}
