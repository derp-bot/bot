import { SlashCommandBuilder } from '@discordjs/builders';

export default function(slashCommands) {

  slashCommands.addCommand(
    new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Replies with pong!'),
    async (derp, interaction) => {
      await interaction.reply({
        content: 'Pong!',
        ephemeral: true,
      });
    },
  );

}

