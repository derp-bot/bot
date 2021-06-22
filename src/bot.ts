import { Client, Message, MessageReaction, User } from 'discord.js-light';
import got from 'got/dist/source';
import { fromEvent, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { CommandMessage, isCommand, toCommandMessage } from './commands';
import { ReactionMessage } from './reactions';
import config from './config';

export class Bot {
  private token: string;
  private commandPrefix: string;
  private client: Client;
  private heartbeat: NodeJS.Timeout;

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

  public getReplies(repliesToThis: Message): Observable<Message> {
    const referenceId = repliesToThis.id;
    return this.getMessages().pipe(
      filter((message: Message) => message.reference?.messageID === referenceId)
    );
  }

  public listenForCommand(name: string): Observable<CommandMessage> {
    return this.getMessages()
      .pipe(
        filter(isCommand),
        map(toCommandMessage),
        filter(({ command }) => command.name === name)
      );
  }

  public getReactions() {
    return new Observable<ReactionMessage>((subscribe) => {
      this.client.on('messageReactionAdd', async (reaction: MessageReaction, user: User) => {
        // If the author is null re-fetch the message.
        // TODO: Is this hilariously slow?
        if (!reaction.message.author) {
          reaction.message = await reaction.message.fetch(true);
        }
        subscribe.next({
          action: 'add',
          reaction,
          user,
          reply: async (text: string) => reaction.message.channel.send(text),
        });
      });
      this.client.on('messageReactionRemove', async (reaction: MessageReaction, user: User) => {
        // If the author is null re-fetch the message.
        if (!reaction.message.author) {
          reaction.message = await reaction.message.fetch(true);
        }
        subscribe.next({
          action: 'remove',
          reaction,
          user,
          reply: async (text: string) => reaction.message.channel.send(text),
        });
      });
    });
  }

  public isMyMessage(message: Message): boolean {
    if (!message.author) {
      console.warn('message.author is falsy, probably need to fetch this message before calling this');
    }
    return message.author == this.client.user;
  }

  public async start(): Promise<void> {
    try {
      await this.client.login(this.token);
      this.startHeartbeat();
    } catch (error) {
      console.error(error);
    }
  }

  private startHeartbeat() {
    const { heartbeatHealthcheckUrl } = config;
    if (!heartbeatHealthcheckUrl) {
      console.warn('No healthcheck URL === no heart beat');
      return;
    }
    this.heartbeat = setInterval(() => {
      // Let our healthcheck know we're alive.
      got(heartbeatHealthcheckUrl)
        .catch(error => {
          console.error('Error during heartbeat', error);
        })
    }, 3 * 60 * 1000)
  }
}
