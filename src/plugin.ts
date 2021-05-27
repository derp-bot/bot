import PluginContext from './pluginContext';

export default class Plugin {
  private dispatchMap: Map<string, (context: PluginContext) => Promise<void>>;

  constructor(protected respondTo: string[]) {
    this.dispatchMap = new Map<
      string,
      (context: PluginContext) => Promise<void>
    >();
    this.dispatchMap.set('ready', async context => {
      await this.onReady(context);
    });
    this.dispatchMap.set('message', async context => {
      await this.onMessage(context);
    });
  }

  public canRespondTo(event: string): boolean {
    return this.respondTo.includes(event);
  }

  public async dispatch(context: PluginContext): Promise<void> {
    const { event } = context;
    context.stopPropagation = true;
    const responder: (context: PluginContext) => Promise<void> =
      this.dispatchMap.get(context.event);
    await responder(context);
  }

  public async onReady(context): Promise<void> {}
  public async onMessage(context): Promise<void> {}
}
