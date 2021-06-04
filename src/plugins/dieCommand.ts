import { Subscription } from "rxjs";
import { Bot } from "../bot";
import { CommandMessage } from "../commands";

export default function dieCommand(bot: Bot) {
  let subscription: Subscription;
  subscription = bot.listenForCommand('die').subscribe(async (command: CommandMessage) => {
    await command.message.reply('Your wish is my command.');
    subscription.unsubscribe();
    process.exit(0);
  });
}
