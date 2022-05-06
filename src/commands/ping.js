const { registerCommand } = require('./index');

registerCommand('ping', 'Replies with pong!', async (msg) => {
  await msg.payload.interaction.reply({
    content: 'Pong!',
    ephemeral: true,
  });
});

