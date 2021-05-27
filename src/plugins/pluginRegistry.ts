import { Recoverable } from 'repl';
import Plugin from './plugin';
import PluginContext from './pluginContext';

export default class PluginRegistry {
  private plugins: Plugin[];

  constructor() {
    this.plugins = [];
  }

  public add(plugin: Plugin): void {
    this.plugins.push(plugin);
  }

  async runEventHandler(event: string, data?: any) {
    const context = new PluginContext(event, data);
    for (let index = 0; index < this.plugins.length; index++) {
      const plugin = this.plugins[index];
      if (plugin.canRespondTo(event)) {
        await plugin.dispatch(context);
        if (context.stopPropagation) {
          break;
        }
      }
    }
  }
}
