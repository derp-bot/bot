import { SlashCommandBuilder } from '@discordjs/builders';
import { GITHUB_SHA } from '../config.js';
import { inlineCode, hyperlink } from '@discordjs/builders';

export default function(slashCommands) {

  slashCommands.addCommand(
    new SlashCommandBuilder()
      .setName('botinfo')
      .setDescription('Replies with some debugging info about the bot.'),
    async (derp, interaction) => {
      const shaLink = hyperlink(inlineCode(GITHUB_SHA), `https://github.com/derp-bot/bot/commit/${GITHUB_SHA}`);

      await interaction.reply({
        content: `Derp the Bot!
sha: ${shaLink}`,
        ephemeral: true,
      });
    },
  );
}

