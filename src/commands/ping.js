const { spawnStateless } = require('nact');

module.exports = {
  name: 'ping',
  description: 'Replies with pong!',
  spawn: (parent) => spawnStateless(parent, (msg) => {
    msg.interaction.reply('Pong!');
  }, 'ping'),
};
