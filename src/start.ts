import { Bot } from './bot';
import config from './config';
import plugins from './plugins';

async function main(): Promise<void> {
  if (!config.token) {
    console.error('The bot token is required to run');
    process.exit(1);
  }

  const derpBot = new Bot({
    token: config.token,
  });

  // Run all the plugin things.
  Object.values(plugins).forEach(plugin => plugin(derpBot));

  await derpBot.start();
}

main();
