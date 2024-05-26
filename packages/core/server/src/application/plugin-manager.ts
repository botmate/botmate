import { ModelStatic } from '@botmate/database';
import { Logger, createLogger } from '@botmate/utils';
import colors from 'colors';
import exca from 'execa';
import { createWriteStream, existsSync } from 'fs';
import { cp, lstat, mkdir, readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import * as tar from 'tar';

import { Plugin } from '../plugin';
import { Application } from './application';
import { PluginModel, initModel } from './plugin-model';
import { createTmpDir, isTypeScriptPackage } from './utils';

const builtinPlugins = ['auth', 'users'];

export type PluginMeta = {
  name: string;
  displayName: string;
  description: string;
  version: string;
  dependencies: Record<string, string>;
  localPath: string;
  serverPath: string;
  clientPath?: string;
};

export class PluginManager {
  protected plugins: PluginMeta[] = [];
  protected instanes: Map<string, Plugin> = new Map();
  protected model: ModelStatic<PluginModel>;

  logger: Logger;

  constructor(private app: Application) {
    this.logger = createLogger('plugin-manager');
    this.model = initModel(this.app.db);
  }

  async initialize() {
    this.logger.debug('Initializing...');
    await this.model.sync();
    await this.prepare();
  }

  async getPlugins() {
    return this.plugins;
  }

  async resolvePlugin(name: string) {
    try {
      const m = await import(name);
      console.log('m', m);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async setup() {
    this.logger.info('Setting up plugins...');

    const plugins = await this.getPlugins();
    for (const plugin of plugins) {
      await this.install(plugin.name);
    }
  }

  /**
   * Install a plugin by name [local]
   * @param pluginName
   * @returns
   */
  async install(pluginName: string) {
    const plugin = this.plugins.find((p) => p.name === pluginName);
    if (!plugin) {
      const plugins = await this.getLocalPlugins('storage/plugins');
      console.log('plugins from storage/plugins', plugins);

      this.logger.warn(`Plugin ${colors.bold(pluginName)} not found`);
      return;
    }

    const exist = await this.model.findOne({
      where: { name: plugin.name },
    });
    if (!exist) {
      await this.build(plugin.name);
      await this.model.create({
        name: plugin.name,
        displayName: plugin.displayName,
        builtin: builtinPlugins.some(
          (p) => plugin.name === `@botmate/plugin-${p}`,
        ),
        version: plugin.version,
        description: plugin.description,
        options: {},
        enabled: true,
        installed: true,
        dependencies: plugin.dependencies,
      });
    } else {
      this.logger.warn(
        `Plugin ${colors.bold(pluginName)} is already installed`,
      );
    }
  }

  /**
   * Uninstall a plugin by name
   * @param pluginName
   * @returns
   */
  async uninstall(pluginName: string) {
    const plugin = this.plugins.find((p) => p.name === pluginName);
    if (!plugin) {
      this.logger.error(`Plugin ${colors.bold(pluginName)} not found`);
      return;
    }

    await this.model.destroy({
      where: { name: plugin.name },
    });
  }

  async getInstalledPlugins() {
    const pkgJsonPath = join(process.cwd(), 'package.json');

    if (!existsSync(pkgJsonPath)) {
      this.logger.debug('No package.json found');
      return [];
    }

    this.logger.debug('Reading plugins from package.json');
    const pkgJson = await readFile('package.json', 'utf-8').then((data) =>
      JSON.parse(data),
    );

    const dependencies = Object.keys(pkgJson.dependencies || {});

    if (!dependencies.length) {
      this.logger.debug('No dependencies found in package.json');
      return [];
    }

    const plugins: PluginMeta[] = [];

    for (const dep of dependencies) {
      if (dep.startsWith('@botmate/plugin-')) {
        const pluginPath = join(process.cwd(), 'node_modules', dep);
        const pkgJSON = join(pluginPath, 'package.json');
        const pkg = await readFile(pkgJSON, 'utf-8').then((data) =>
          JSON.parse(data),
        );

        const isTypeScript = await isTypeScriptPackage(pluginPath);
        const serverPath = join(
          pluginPath,
          isTypeScript ? 'src/server/index.ts' : 'server/index.js',
        );
        const clientPath = join(
          pluginPath,
          isTypeScript ? 'src/client/index.ts' : 'client/index.js',
        );

        plugins.push({
          name: pkg.name,
          displayName: pkg.displayName || pkg.name,
          description: pkg.description,
          version: pkg.version,
          dependencies: pkg.botmate?.dependencies || {},
          localPath: pluginPath,
          serverPath,
          clientPath,
        });
      }
    }

    if (plugins.length > 0) {
      this.logger.info(
        `Found ${plugins.map((p) => colors.bold(p.displayName)).join(', ')}`,
      );
    }

    return plugins;
  }

  /**
   * Fetch all plugins from the given folder and prepare them.
   */
  async prepare() {
    const storagePlugins = await this.getLocalPlugins('storage/plugins');
    const corePlugins = await this.getLocalPlugins('packages/plugins/@botmate');
    const installedPlugins = await this.getInstalledPlugins();

    this.plugins = [...corePlugins, ...storagePlugins, ...installedPlugins];

    for (const plugin of this.plugins) {
      this.logger.debug(`Processing ${colors.bold(plugin.displayName)}`);

      try {
        const module = await import(plugin.serverPath);
        const exportKey = Object.keys(module)[0];
        if (!exportKey) {
          this.logger.error(
            `Failed to prepare plugin ${colors.bold(
              plugin.name,
            )}: No export found`,
          );
          continue;
        }

        const PluginClass = module[exportKey];
        const pluginLogger = createLogger(plugin.name);
        const instance = new PluginClass(this.app, pluginLogger);
        await instance.beforeLoad();
        this.instanes.set(plugin.displayName, instance);
      } catch (e) {
        this.logger.error(
          `Failed to prepare plugin ${colors.bold(plugin.name)}`,
        );
        console.error(e);
      }
    }

    this.logger.debug('Plugins are initialized');
  }

  /**
   * Get all plugins from the given folder.
   */
  async getLocalPlugins(pluginFolder: string) {
    const path = join(process.cwd(), pluginFolder);

    this.logger.debug(`Reading plugins from "${colors.bold(pluginFolder)}"`);

    if (!existsSync(pluginFolder)) {
      return [];
    }

    const list = await readdir(path);

    if (list.length === 0) {
      this.logger.debug('No plugins found');
      return [];
    }

    const plugins: PluginMeta[] = [];

    for (const item of list) {
      const pluginPath = join(path, item);
      const stat = await lstat(pluginPath);

      if (stat.isDirectory()) {
        const isOrg = item.startsWith('@');
        if (isOrg) {
          const subPlugins = await this.getLocalPlugins(
            `storage/plugins/${item}`,
          );
          plugins.push(...subPlugins);
          continue;
        }
        const pkgJSON = join(pluginPath, 'package.json');
        const pkg = await readFile(pkgJSON, 'utf-8').then((data) =>
          JSON.parse(data),
        );

        const isTypeScript = await isTypeScriptPackage(pluginPath);
        const serverPath = join(
          pluginPath,
          isTypeScript ? 'src/server/index.ts' : 'server/index.js',
        );
        const clientPath = join(
          pluginPath,
          isTypeScript ? 'src/client/index.ts' : 'client/index.js',
        );

        plugins.push({
          name: pkg.name,
          displayName: pkg.displayName || pkg.name,
          description: pkg.description,
          version: pkg.version,
          dependencies: pkg.botmate?.dependencies || {},
          localPath: pluginPath,

          serverPath,
          clientPath,
        });
      }
    }

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

  /**
   * Build the plugin for production.
   * @param name Name of the plugin
   */
  async build(name: string, force = false) {
    this.logger.info(`Building plugin ${colors.bold(name)}`);

    const plugin = this.plugins.find((p) => p.name === name);
    if (plugin && !force) {
      this.logger.warn(`Plugin already built, skipping...`);
      return;
    }

    const tmpDir = await createTmpDir();
    const pluginPath = join(tmpDir, name.replace('/', '__'));

    const url = await exca('npm', ['view', name, 'dist.tarball'], {
      stdio: 'pipe',
    });
    if (url.failed) {
      this.logger.error(`Failed to fetch tarball for ${name}`);
      return;
    }

    const tarball = url.stdout.trim();
    const tarballPath = `${pluginPath}.tgz`;

    await fetch(tarball)
      .then((res) => res.arrayBuffer())
      .then(async (res) => {
        const fileStream = createWriteStream(tarballPath, {
          flags: 'wx',
        });
        const readable = new Readable();
        readable.push(Buffer.from(res));
        readable.push(null);
        readable.pipe(fileStream);
        await finished(fileStream);
      });

    const pluginStoragePath = join(process.cwd(), 'storage/plugins', name);
    await mkdir(pluginStoragePath, { recursive: true });

    await tar.extract({
      file: tarballPath,
      cwd: tmpDir,
    });

    await cp(join(tmpDir, 'package'), pluginStoragePath, {
      recursive: true,
    });
  }
}
