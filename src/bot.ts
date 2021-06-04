import { Client, Message } from 'discord.js-light';
import { fromEvent, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { CommandMessage, isCommand, toCommandMessage } from './commands';

export class Bot {
  private token: string;
  private commandPrefix: string;
  private client: Client;

  constructor({
    token,
    commandPrefix,
  }: {
    token: string,
    commandPrefix?: string,
  }) {
    this.token = token;
    this.commandPrefix = commandPrefix || '!';
    this.client = new Client({
      cacheChannels: false,
      cacheEmojis: false,
      cacheGuilds: true,
      cacheOverwrites: false,
      cachePresences: false,
      cacheRoles: false,
    });
  }

  public getReady(): Observable<boolean> {
    return new Observable(subscribe => {
      subscribe.next(false);
      this.client.once('ready', () => {
        subscribe.next(true);
        subscribe.complete();
      });
    });
  }

  public getMessages(): Observable<Message> {
    return fromEvent(this.client, 'message') as Observable<Message>;
  }

  public listenForCommand(name: string): Observable<CommandMessage> {
    return this.getMessages()
      .pipe(
        filter(isCommand),
        map(toCommandMessage),
      );
  }

  public use(): void {
  }

  public async start(): Promise<void> {
    try {
      await this.client.login(this.token);
    } catch (error) {
      console.error(error);
    }
  }
}
