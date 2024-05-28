import { createLogger } from '@botmate/utils';
import { execSync } from 'child_process';
import { Command } from 'commander';
import ejs from 'ejs';
import fg from 'fast-glob';
import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { camelCase, upperFirst } from 'lodash/fp';
import { join } from 'path';

function getTemplates() {
  let dir = join(__dirname, '..', 'files', 'plugin');
  if (!existsSync(dir)) {
    dir = join(__dirname, '..', '..', 'files', 'plugin');
  }

  return fg('**/*', { cwd: dir, absolute: true });
}

function getRelativePath(path: string) {
  return path.replace(process.cwd(), '.');
}

const requiredDevDeps = ['typescript', '@types/node'];

export function plugin(cmd: Command) {
  const plugin = cmd.command('plugin');
  plugin
    .command('create')
    .argument('<name>', 'Name of the plugin')
    .description('Create a new plugin')
    .action(async (name) => {
      // if (isProjectRepo()) {
      //   console.log(
      //     `You can't create a plugin in a project repo. Please use "nx" to create a new plugins.`,
      //   );
      //   return;
      // }

      const logger = createLogger('plugin');

      logger.info(`Creating plugin "${name}"`);

      const pluginDir = join(process.cwd(), 'plugins', name);
      if (existsSync(pluginDir)) {
        logger.error(`Plugin "${name}" already exists`);
        return;
      }

      await mkdir(pluginDir, { recursive: true });

      const files = await getTemplates();

      for (const file of files) {
        const content = await ejs.renderFile(file, {
          name,
          className: upperFirst(camelCase(name)),
        });

        let path = join(pluginDir, file.replace(/.*plugin\//, ''));

        path = path.replace(/\.ejs$/, '');

        await mkdir(join(path, '..'), { recursive: true });

        logger.info(`CREATE ${getRelativePath(path)}`);
        await writeFile(path, content);
      }

      const tsConfig = await readFile(
        join(process.cwd(), 'tsconfig.json'),
        'utf-8',
      );
      const tsConfigObj = JSON.parse(tsConfig);
      tsConfigObj.compilerOptions.paths = {
        ...tsConfigObj.compilerOptions.paths,
        [`botmate-plugin-${name}`]: [`plugins/${name}/src`],
      };

      logger.info(`UPDATE ./tsconfig.json`);
      await writeFile(
        join(process.cwd(), 'tsconfig.json'),
        JSON.stringify(tsConfigObj, null, 2),
      );

      const pkgJson = await readFile(
        join(process.cwd(), 'package.json'),
        'utf-8',
      );

      const pkgJsonObj = JSON.parse(pkgJson);

      let isInstalled = false;
      const devDeps = pkgJsonObj.devDependencies || {};
      for (const dep of requiredDevDeps) {
        if (!devDeps[dep]) {
          isInstalled = true;
          break;
        }
      }

      if (isInstalled) {
        logger.info(`Installing required devDependencies...`);

        execSync(`pnpm install -Dw ${requiredDevDeps.join(' ')}`, {
          stdio: 'inherit',
        });
      }
    });
}
