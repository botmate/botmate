import { getPackages } from '@lerna/project';
import { existsSync } from 'fs';
import { join } from 'path';

import { Application } from '../application';

export class PlatformManager {
  constructor(private app: Application) {}

  async listPlatforms() {
    const platformDir = join(this.app.rootPath, 'platforms');
    if (existsSync(platformDir)) {
      const platforms = (await getPackages()).filter((pkg) =>
        pkg.name.startsWith('@botmate/platform-'),
      );
      return platforms.map((pkg) => ({
        name: pkg.name,
        displayName: pkg.get('displayName'),
        description: pkg.get('description'),
        version: pkg.version,
        credentials: pkg.get('credentials'),
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
              name: pkg.name,
              displayName: pkg.displayName,
              description: pkg.description,
              version: pkg.version,
              credentials: pkg.credentials,
            });
          } catch {}
        }
      }

      return platforms;
    }
  }
}
