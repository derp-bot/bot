const Discord = require('discord.js');
const client = new Discord.Client();
const got = require('got');

const { DISCORD_BOT_TOKEN, HEARTBEAT_HEALTHCHECKS_IO_URL } = process.env;

setInterval(() => {
  // Send a heartbeat request to our healtcheck so it knows we're alive.
  got
    .post(HEARTBEAT_HEALTHCHECKS_IO_URL, {
      body: '💙',
    })
    .then(() => {
      console.log('💙!');
    })
    .catch(error => {
      console.error(`error:heartbeat`, error);
    });
}, 5 * 60 * 1000);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

client.login(DISCORD_BOT_TOKEN);
