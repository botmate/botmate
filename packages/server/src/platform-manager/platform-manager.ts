import { getPackages } from '@lerna/project';
import { existsSync } from 'fs';
import { join } from 'path';

import { Application } from '../application';

export class PlatformManager {
  constructor(private app: Application) {}

  async listPlatforms() {
    const platformDir = join(this.app.rootPath, 'platforms');
    console.log('platformDir', platformDir);
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
    }

    return [];
  }
}
