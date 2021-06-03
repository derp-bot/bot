import { Message } from 'discord.js';
import config from '../config';
import Plugin from './plugin';

const { commandPrefix } = config;

export type StopFunction = () => void;

export type ReadyHandler = (stop: StopFunction) => Promise<void>;

export type CommandHandler = (
  message: Message,
  stop: StopFunction,
) => Promise<void>;

export type PluginContext = {
  onReady(handler: ReadyHandler): Promise<void>;
  onCommand(command: string, handler: CommandHandler): Promise<void>;
  logger: any;
};

export default class PluginRegistry {
  private helper: PluginContext;

  private readyHandlers: ReadyHandler[];
  private commandHandlers: Map<string, CommandHandler[]>;

  constructor() {
    this.readyHandlers = [];
    this.commandHandlers = new Map<string, CommandHandler[]>();

    this.helper = {
      onReady: async (handler: ReadyHandler) => {
        this.readyHandlers.push(handler);
      },

      onCommand: async (command: string, handler: CommandHandler) => {
        let handlers = this.commandHandlers.get(command);
        if (!handlers) {
          handlers = [];
          this.commandHandlers.set(command, handlers);
        }
        handlers.push(handler);
      },

      logger: {
        info: (message: string) => {
          console.log(message);
        },
      },
    };
  }

  public async add(plugin: Plugin): Promise<void> {
    await plugin(this.helper);
  }

  public async onReady(): Promise<void> {
    let stopNow = false;
    const stop = () => {
      stopNow = true;
    };
    for (const handler of this.readyHandlers) {
      await handler(stop);
      if (stopNow) {
        return;
      }
    }
  }

  public async onMessage(message: Message): Promise<void> {
    let stopNow = false;
    const stop = () => {
      stopNow = true;
    };
    // Is this thing a command? If so, it'll start with the prefix.
    if (message.content.startsWith(commandPrefix)) {
      // Do command things.
      // TODO: This is really dumb right now, should only look at first word or something.
      const command = message.content.substr(1);
      const handlers = this.commandHandlers.get(command);
      if (handlers) {
        for (const handler of handlers) {
          await handler(message, stop);
          if (stopNow) {
            return;
          }
        }
      }
    }
  }
}
