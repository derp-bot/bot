import { Subscription } from "rxjs";
import { Bot } from "../bot";

export default function readyLogger(bot: Bot): void {
  let subscription: Subscription;
  subscription = bot.getReady().subscribe(isReady => {
    if (isReady) {
      console.log('Bot is ready to go.');
      subscription.unsubscribe();
    }
  });
}
