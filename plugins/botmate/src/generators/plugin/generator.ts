import {
  ProjectConfiguration,
  Tree,
  formatFiles,
  generateFiles,
} from '@nx/devkit';
import { libraryGenerator } from '@nx/node';
import { rmdir } from 'fs/promises';
import { camelCase, capitalize } from 'lodash/fp';

import { PluginGeneratorSchema } from './schema';

export async function coreGenerator(
  tree: Tree,
  options: PluginGeneratorSchema,
) {
  const projectRoot = `packages/plugins/@botmate`;

  options.name = `plugin-${options.name}`;

  await libraryGenerator(tree, {
    name: options.name,
    directory: `${projectRoot}/${options.name}`,
    projectNameAndRootFormat: 'as-provided',
    publishable: true,
    buildable: true,
    importPath: `@botmate/${options.name}`,
    compiler: 'tsc',
  });

  const projectJson = JSON.parse(
    tree.read(`${projectRoot}/${options.name}/project.json`).toString(),
  ) as ProjectConfiguration;
  projectJson.sourceRoot = projectJson.sourceRoot.replace('/src', '');
  projectJson.targets.build.options.rootDir = `${projectRoot}/${options.name}/src`;
  tree.write(
    `${projectRoot}/${options.name}/project.json`,
    JSON.stringify(projectJson, null, 2),
  );

  const className =
    capitalize(camelCase(options.name.replace('plugin-', ''))) + 'Plugin';

  generateFiles(tree, `${__dirname}/files`, `${projectRoot}/${options.name}`, {
    className,
  });

  await rmdir(`${projectRoot}/${options.name}/src/lib`, { recursive: true });

  await formatFiles(tree);
}

export default coreGenerator;
