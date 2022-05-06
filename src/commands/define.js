const { registerCommand } = require('./index');
const { WORDNIK_API_KEY } = require('../config');
const log = require('simplog');

registerCommand({
  name: 'define',
  description: 'Provides definitions for the given word via Wordnik.com.',
  options: [{
    name: 'word',
    description: 'The word you want me to define.',
  }],
  cb: async (msg) => {
    if (!WORDNIK_API_KEY) {
      try {
        await msg.payload.interaction.reply('Aww, that sucks, looks like someone forgot to give me a Wordnik API key. No definition for you!');
        const message = await msg.payload.interaction.fetchReply();
        await message.react('🐛');
      } catch (err) {
        log.error(`Error trying to respond with no wordnik definition: ${error}`);
      }
      return;
    }
  },
});


