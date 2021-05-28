import { Client, Message } from 'discord.js-light';
import Plugin from './plugins/plugin';
import PluginRegistry from './plugins/pluginRegistry';

export class Bot {
  private registry: PluginRegistry;
  private client: Client;

  constructor(private token: string) {
    this.registry = new PluginRegistry();
    this.client = new Client({
      cacheChannels: false,
      cacheEmojis: false,
      cacheGuilds: true,
      cacheOverwrites: false,
      cachePresences: false,
      cacheRoles: false,
    });

    this.client.on('ready', () => {
      this.onReady();
    });
    this.client.on('message', message => {
      this.onMessage(message);
    });
  }

  public use(plugin: Plugin): void {
    this.registry.add(plugin);
  }

  public async start(): Promise<void> {
    try {
      await this.client.login(this.token);
    } catch (error) {
      console.error(error);
    }
  }

  public async onReady(): Promise<void> {
    await this.registry.onReady();
  }

  public async onMessage(message: Message): Promise<void> {
    await this.registry.onMessage(message);
  }
}
