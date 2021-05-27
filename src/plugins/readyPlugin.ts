import Plugin from './plugin';

export default class ReadyPlugin extends Plugin {
  constructor() {
    super(['ready']);
  }

  public async onReady(context): Promise<void> {
    console.log('Bot is online and ready to go.');
    context.stopPropagation = false;
  }
}
