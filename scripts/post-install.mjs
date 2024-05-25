import { writeFile } from 'fs/promises';

const corePlugins = ['plugin-auth', 'plugin-users'];

async function generatePlugins() {
  let content = '/* eslint-disable @nx/enforce-module-boundaries */\n';

  for (const plugin of corePlugins) {
    content += `export * from '../../../plugins/@botmate/${plugin}/src/client';\n`;
  }

  await writeFile('packages/core/app/src/plugins.ts', content, 'utf-8');

  console.log('Plugins generated');
}

generatePlugins();
