import { Subscription } from "rxjs";
import { Bot } from "../bot";
import { CommandMessage } from "../commands";

export default function pingCommand(bot: Bot) {
  let subscription: Subscription;
  subscription = bot.listenForCommand('ping').subscribe(async (command: CommandMessage) => {
    await command.message.reply('Pong!');
  });
}
