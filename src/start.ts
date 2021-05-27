import { Bot } from './bot';
import config from './config';
import ReadyPlugin from './plugins/readyPlugin';

async function main(): Promise<void> {
  const derpBot = new Bot(config.token);

  derpBot.register(new ReadyPlugin());

  await derpBot.start();
}

main();
