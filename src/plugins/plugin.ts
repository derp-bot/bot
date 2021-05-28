import { PluginContext } from './pluginRegistry';

type Plugin = (context: PluginContext) => Promise<void>;

export default Plugin;
