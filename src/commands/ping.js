const { registerCommand } = require('./index');

registerCommand('ping', 'Replies with pong!', (msg) => {
  msg.payload.interaction.reply('Pong!');
});

