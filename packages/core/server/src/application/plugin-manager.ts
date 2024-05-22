import { ModelStatic } from '@botmate/database';
import { Logger, createLogger } from '@botmate/utils';
import colors from 'colors';
import { existsSync } from 'fs';
import { lstat, readFile, readdir } from 'fs/promises';
import { join } from 'path';

import { Plugin } from '../plugin';
import { Application } from './application';
import { PluginModel, initModel } from './plugin-model';

type PluginMeta = {
  name: string;
  packageName: string;
  description: string;
  version: string;
  dependencies: string[];
  localPath: string;
};

export class PluginManager {
  protected plugins: PluginMeta[] = [];
  protected instanes: Map<string, Plugin> = new Map();
  protected model: ModelStatic<PluginModel>;

  logger: Logger;

  constructor(private app: Application) {
    this.logger = createLogger('plugin-manager');
  }

  async initialize() {
    this.logger.debug('Initializing plugin manager...');

    this.model = initModel(this.app.db);
    await this.initializePlugins();
  }

  /**
   * Initialize all plugins.
   */
  async initializePlugins() {
    const storagePlugins = await this.getPlugins('storage/plugins');
    const corePlugins = await this.getPlugins('packages/plugins/@botmate');

    this.logger.debug('Syncing plugins...');
    for (const plugin of [...corePlugins, ...storagePlugins]) {
      this.logger.debug(`Loading ${colors.bold(plugin.packageName)}`);

      const serverEntry = join(
        plugin.localPath,
        this.app.isDev ? 'src/server/server.ts' : 'server.js',
      );

      try {
        const module = await import(serverEntry);
        const exportKey = Object.keys(module)[0];
        if (!exportKey) {
          this.logger.error(
            `Failed to load plugin ${colors.bold(
              plugin.name,
            )}: No export found`,
          );
          continue;
        }

        const PluginClass = module[exportKey];
        const pluginLogger = createLogger(plugin.name);
        const instance = new PluginClass(this.app, pluginLogger);
        await instance.beforeLoad();
        this.instanes.set(plugin.name, instance);
      } catch (e) {
        this.logger.error(`Failed to load plugin ${colors.bold(plugin.name)}`);
        this.logger.error(e);
      }
    }

    this.logger.debug('Syncing plugins done.');
  }

  /**
   * Get all plugins from the given folder.
   */
  async getPlugins(pluginFolder: string) {
    this.logger.debug(`Reading plugins from "${colors.bold(pluginFolder)}"`);

    if (!existsSync(pluginFolder)) {
      this.logger.warn(`No plugins found in "${colors.bold(pluginFolder)}"`);
      return [];
    }

    const path = join(process.cwd(), pluginFolder);

    const list = await readdir(path);

    const plugins: PluginMeta[] = [];

    for (const item of list) {
      const pluginPath = join(path, item);
      const stat = await lstat(pluginPath);

      if (stat.isDirectory()) {
        const pkgJSON = join(pluginPath, 'package.json');
        const pkg = await readFile(pkgJSON, 'utf-8').then((data) =>
          JSON.parse(data),
        );

        plugins.push({
          name: pkg.displayName || pkg.name,
          packageName: pkg.name,
          description: pkg.description,
          version: pkg.version,
          dependencies: Object.keys(pkg.botmate?.dependencies || {}),
          localPath: pluginPath,
        });
      }
    }

    this.logger.info(
      `Found ${plugins.map((p) => colors.bold(p.packageName)).join(', ')}`,
    );

    return plugins;
  }

  /**
   * Load all plugins.
   */
  async loadAll() {
    for (const plugin of this.instanes.values()) {
      await plugin.load();
    }
  }
}
