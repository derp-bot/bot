import { Message } from "discord.js";
import config from "./config";

export type Command = {
  name: string;
  args: string[];
};

export type CommandMessage = {
  command: Command;
  message: Message
};

export type CommandBlueprint = {
  name: string,
  description: string,
};

export const isCommand = (message: Message) => message.content?.startsWith(config.commandPrefix);

export const toCommandMessage = (message: Message): CommandMessage => {
  const [commandName, ...args] = message.content.split(' ');

  return {
    message,
    command: {
      name: commandName.toLowerCase().trim().substring(1),
      args,
    }
  };
}

