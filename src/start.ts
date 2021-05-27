import { Bot } from './bot';
import config from './config';
import DieCommand from './plugins/dieCommand';
import ReadyPlugin from './plugins/readyPlugin';

async function main(): Promise<void> {
  console.log('Checking config...');
  if (!config.token) {
    console.error('The bot token is required to run');
    process.exit(1);
  }

  console.log('Instantiating bot...');
  const derpBot = new Bot(config.token);

  console.log('Adding plugins...');
  derpBot.register(new ReadyPlugin());
  derpBot.register(new DieCommand());

  console.log('Starting bot...');
  await derpBot.start();
}

console.log('About to run main routine.');
main();
