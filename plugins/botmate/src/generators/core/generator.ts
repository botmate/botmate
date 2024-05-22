import { formatFiles, ProjectConfiguration, Tree } from '@nx/devkit';
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

  const projectJson = JSON.parse(
    tree.read(`packages/core/${options.name}/project.json`).toString()
  ) as ProjectConfiguration;
  projectJson.sourceRoot = projectJson.sourceRoot.replace('/src', '');
  projectJson.targets.build.options.rootDir = `packages/core/${options.name}/src`;
  tree.write(
    `packages/core/${options.name}/project.json`,
    JSON.stringify(projectJson, null, 2)
  );

  await formatFiles(tree);
}

export default coreGenerator;
