import { Bot } from './bot';
import config from './config';
import ReadyPlugin from './plugins/readyPlugin';

async function main(): Promise<void> {
  if (!config.token) {
    console.error('The bot token is required to run');
    process.exit(1);
  }

  const derpBot = new Bot(config.token);

  derpBot.register(new ReadyPlugin());

  await derpBot.start();
}

main();
