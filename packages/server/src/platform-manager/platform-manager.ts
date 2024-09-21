/* eslint-disable @typescript-eslint/no-var-requires */
import { getPackages } from '@lerna/project';
import { existsSync } from 'fs';
import { join } from 'path';

import { PlatformType } from '..';
import { Application } from '../application';

type Credential = {
  [key: string]: {
    description: string;
  };
};

export type PlatformMeta = {
  name: PlatformType;
  displayName: string;
  description: string;
  version: string;
  credentials: Credential;
  path: string;
};

export class PlatformManager {
  constructor(private app: Application) {}

  async listPlatforms(): Promise<PlatformMeta[]> {
    const platformDir = join(this.app.rootPath, 'platforms');
    if (existsSync(platformDir)) {
      const platforms = (await getPackages()).filter((pkg) =>
        pkg.name.startsWith('@botmate/platform-'),
      );
      return platforms.map((pkg) => ({
        name: pkg.name.replace('@botmate/platform-', '') as PlatformType,
        displayName: pkg.get('displayName'),
        description: pkg.get('description'),
        version: pkg.version,
        credentials: pkg.get('credentials') as Credential,
        path: join(pkg.location, 'src'),
      }));
    } else {
      const pkgJSON = require(join(process.cwd(), 'package.json'));
      const dependencies = pkgJSON?.dependencies || {};

      const platforms = [];
      for (const dep of Object.keys(dependencies)) {
        if (dep.startsWith('@botmate/platform')) {
          try {
            const pkg = require(`${dep}/package.json`);
            platforms.push({
              name: pkg.name.replace('@botmate/platform-', ''),
              displayName: pkg.displayName,
              description: pkg.description,
              version: pkg.version,
              credentials: pkg.credentials as Credential,
              path: require.resolve(dep),
            });
          } catch (e) {
            console.error(e);
            this.app.logger.error(`Error loading platform ${dep}`);
          }
        }
      }

      return platforms;
    }
  }
}
