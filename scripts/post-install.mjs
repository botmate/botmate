import { readdir, writeFile } from 'fs/promises';

async function generatePlugins() {
  const corePlugins = await readdir('packages/plugins/@botmate');
  let content = '/* eslint-disable @nx/enforce-module-boundaries */\n';

  for (const plugin of corePlugins) {
    content += `export * from '../../../plugins/@botmate/${plugin}/src/client/client';\n`;
  }

  await writeFile('packages/core/app/src/plugins.ts', content, 'utf-8');

  console.log('Plugins generated');
}

generatePlugins();
