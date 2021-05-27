export default class PluginContext {
  constructor(
    public event: string,
    public data?: any,
    public stopPropagation?: boolean,
  ) {}
}
