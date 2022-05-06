const { registerCommand } = require('./index');

registerCommand({
  name: 'ping',
  description: 'Replies with pong!',
  cb: async (msg) => {
    await msg.payload.interaction.reply({
      content: 'Pong!',
      ephemeral: true,
    });
  }
});

