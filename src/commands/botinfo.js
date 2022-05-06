const { registerCommand } = require('./index');
const { GITHUB_SHA } = require('../config');
const { inlineCode, hyperlink } = require('@discordjs/builders');

registerCommand(
  'botinfo',
  'Replies with some debugging info about the bot.',
  async (msg) => {
    const shaLink = hyperlink(inlineCode(GITHUB_SHA), `https://github.com/derp-bot/bot/commit/${GITHUB_SHA}`);

    await msg.payload.interaction.reply({
      content: `Derp the Bot!
sha: ${shaLink}`,
      ephemeral: true,
    });
  });

