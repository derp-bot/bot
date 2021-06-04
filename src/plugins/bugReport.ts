import { filter } from "rxjs/operators";
import { Bot } from "../bot";
import { reactionAdded, ReactionMessage } from "../reactions";
import { wait } from "../timing";

export default function bugReport(bot: Bot) {
  bot.getReactions()
    .pipe(
      filter(reactionAdded('🐛')),
      filter(reactionMessage => bot.isMyMessage(reactionMessage.reaction.message))
    )
    .subscribe(async (reactionMessage: ReactionMessage) => {
      reactionMessage.reaction.message.channel.startTyping();
      await wait(2);
      await reactionMessage.reply(`Thanks for the bug report, ${reactionMessage.user.toString()}.`);
      await wait(3);
      await reactionMessage.reply(`Okay, just kidding, there aren't bug reports yet.`);
      await reactionMessage.reaction.message.channel.stopTyping(true);
    });
}
