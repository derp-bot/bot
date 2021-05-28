import { Bot } from './bot';
import config from './config';
import dieCommand from './plugins/dieCommand';
import readyLogger from './plugins/readyLogger';

async function main(): Promise<void> {
  if (!config.token) {
    console.error('The bot token is required to run');
    process.exit(1);
  }

  const derpBot = new Bot(config.token);

  derpBot.use(readyLogger());
  derpBot.use(dieCommand());

  await derpBot.start();
}

main();
