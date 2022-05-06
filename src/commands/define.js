const { registerCommand } = require('./index');

registerCommand({
  name: 'define',
  description: 'Provides definitions for the given word via Wordnik.com.',
  options: [{
    name: 'word',
    description: 'The word you want me to define.',
  }],
  cb: async (msg) => {
    await msg.payload.interaction.reply('define!');
  },
});


