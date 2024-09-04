import Topo from '@hapi/topo';
import { Package } from '@lerna/package';
import { getPackagesSync } from '@lerna/project';
import path from 'path';

import {
  CORE_CLIENT,
  PACKAGES_PATH,
  PLUGINS_DIR,
  ROOT_PATH,
} from './constants';

export async function getPackages() {
  try {
    const packages = getPackagesSync(ROOT_PATH);
    return sortPackages(packages);
  } catch (e) {
    console.error('Failed to parse pnpm list output');
    return [];
  }
}

export function sortPackages(packages: Package[]): Package[] {
  const sorter = new Topo.Sorter<Package>();
  for (const pkg of packages) {
    const pkgJson = require(`${pkg.location}/package.json`);
    const after = Object.keys({
      ...pkgJson.dependencies,
      ...pkgJson.devDependencies,
      ...pkgJson.peerDependencies,
    });
    sorter.add(pkg, { after, group: pkg.name });
  }

  return sorter.nodes;
}

export const getPluginPackages = (packages: Package[]) =>
  packages
    .filter((item) => item.location.match(/\bplugins\/.*\b/))
    .filter((item) => item.get('botmate'));

export const CJS_EXCLUDE_PACKAGES = [
  path.join(PACKAGES_PATH, 'core/build'),
  path.join(PACKAGES_PATH, 'core/cli'),
  CORE_CLIENT,
];

export const getCjsPackages = (packages: Package[]) =>
  packages
    .filter((item) => !PLUGINS_DIR.some((dir) => item.location.startsWith(dir)))
    .filter((item) => !CJS_EXCLUDE_PACKAGES.includes(item.location))
    .filter((item) => !item.get('botmate'))
    .filter((item) => item.name !== '@botmate/ui');
