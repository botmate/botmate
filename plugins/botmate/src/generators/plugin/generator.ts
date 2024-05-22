import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import { PluginGeneratorSchema } from './schema';
import { libraryGenerator } from '@nx/react';
import { Linter } from '@nx/eslint';
import { join } from 'path';

export async function pluginGenerator(
  tree: Tree,
  options: PluginGeneratorSchema
) {
  const projectName = `plugin-${options.name}`;
  const projectRoot = `packages/plugins/@botmate/${projectName}`;

  await libraryGenerator(tree, {
    name: projectName,
    directory: projectRoot,
    projectNameAndRootFormat: 'as-provided',
    buildable: true,
    bundler: 'vite',
    linter: Linter.EsLint,
    publishable: true,
    style: 'none',
    importPath: `@botmate/${projectName}`,
  });

  generateFiles(tree, join(__dirname, 'files'), projectRoot, options);

  await formatFiles(tree);
}

export default pluginGenerator;
