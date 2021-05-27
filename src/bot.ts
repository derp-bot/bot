import { Client } from 'discord.js-light';
import PluginRegistry from './plugins/pluginRegistry';
import Plugin from './plugins/plugin';

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
      this.registry.runEventHandler('ready');
    });
    this.client.on('message', message => {
      this.registry.runEventHandler('message', { message });
    });
  }

  public register(plugin: Plugin): void {
    this.registry.add(plugin);
  }

  public async start(): Promise<void> {
    await this.login();
  }

  private async login(): Promise<void> {
    try {
      await this.client.login(this.token);
    } catch (error) {
      console.error(error);
    }
  }
}
