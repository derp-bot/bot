import { Bot } from '../bot';
import Plugin from './plugin';
import PluginContext from './pluginContext';

export type ReadyHandler = (context: PluginContext) => Promise<void>;

export type PluginHelper = {
  onReady(ReadyHandler): Promise<void>;
  logger: any;
};

export default class PluginRegistry {
  private helper: PluginHelper;

  private readyHandlers: ReadyHandler[];

  constructor(private bot: Bot) {
    this.readyHandlers = [];

    this.helper = {
      onReady: async (handler: ReadyHandler) => {
        this.readyHandlers.push(handler);
      },

      logger: {
        info: message => {
          console.log(message);
        },
      },
    };
  }

  public async add(plugin: Plugin): Promise<void> {
    await plugin(this.helper);
  }

  public async onReady(): Promise<void> {
    const context = new PluginContext(this.bot);
    for (let index = 0; index < this.readyHandlers.length; index++) {
      const handler = this.readyHandlers[index];
      await handler(context);
    }
  }

  // async runEventHandler(event: string, data?: any) {
  //   const context = new PluginContext(event, data);
  //   for (let index = 0; index < this.plugins.length; index++) {
  //     const plugin = this.plugins[index];
  //     if (plugin.canRespondTo(event)) {
  //       await plugin.dispatch(context);
  //       if (context.stopPropagation) {
  //         break;
  //       }
  //     }
  //   }
  // }
}
