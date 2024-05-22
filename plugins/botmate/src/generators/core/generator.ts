import { formatFiles, Tree } from '@nx/devkit';
import { CoreGeneratorSchema } from './schema';
import { libraryGenerator } from '@nx/node';

export async function coreGenerator(tree: Tree, options: CoreGeneratorSchema) {
  await libraryGenerator(tree, {
    name: options.name,
    directory: `packages/core/${options.name}`,
    projectNameAndRootFormat: 'as-provided',
    publishable: true,
    buildable: true,
    importPath: `@botmate/${options.name}`,
    compiler: 'tsc',
  });
  await formatFiles(tree);
}

export default coreGenerator;
