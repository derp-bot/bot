import { Message, MessageReaction, User } from "discord.js-light";

export type ReactionMessage = {
  action: 'add' | 'remove',
  reaction: MessageReaction,
  user: User,
  reply: (text: string) => Promise<Message>,
};

export const reactionAdded = (emoji: string) => {
  return (reactionMessage: ReactionMessage) => reactionMessage.action === 'add' && reactionMessage.reaction.emoji.name === emoji;
}
