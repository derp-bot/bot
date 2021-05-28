import { PluginHelper } from './pluginRegistry';

type Plugin = (helper: PluginHelper) => Promise<void>;

export default Plugin;
