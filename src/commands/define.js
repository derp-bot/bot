import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { WORDNIK_API_KEY } from '../config.js';
import log from 'simplog';
import { got } from 'got';

export default function(slashCommands) {

  if (!WORDNIK_API_KEY) {
    log.warn('No WORDNIK_API_KEY; no define command.');
    return;
  }

  slashCommands.addCommand(
    new SlashCommandBuilder()
      .setName('define')
      .setDescription('Provides definitions for the given word via Wordnik.com.')
      .addStringOption(option => option
        .setName('word')
        .setDescription('The word you want me to define.')
        .setRequired(true)),
    async (derp, interaction) => {
      const word = interaction.options.getString('word');

      if (!word) {
        await interaction.reply('Hmm, got something weird instead of the word I was expecting.')
        return;
      }

      await interaction.deferReply();

      const wordnikUrl = `https://api.wordnik.com/v4/word.json/${word}/definitions?limit=5&includeRelated=false&useCanonical=false&includeTags=false&api_key=${WORDNIK_API_KEY}`;

      const wordnikResponse = await got(wordnikUrl).json();

      if (!wordnikResponse || wordnikResponse.length === 0) {
        await interaction.followUp(`That's weird, I found no definition for this word.`);
        return;
      }

      const definitionEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Definition for ${word}`)
        .setURL(`https://www.wordnik.com/words/${word}`);

      // Add some of those definitions.
      for (let response of wordnikResponse) {
        if (!response.partOfSpeech || !response.text) {
          continue;
        }

        log.debug(response.partOfSpeech, response.text);

        // definitionEmbed.addField(
        //   response.partOfSpeech || 'Definition',
        //   `${response.text} (${response.attributionText})`
        // );
      }

      await interaction.channel.send({
        embeds: [definitionEmbed],
      });
    },
  );
};


