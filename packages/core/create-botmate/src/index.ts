#!/usr/bin/env node
import { createLogger } from '@botmate/utils';
import { execSync } from 'child_process';
import ejs from 'ejs';
import fg from 'fast-glob';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import inquirer from 'inquirer';

const cwd = process.cwd();

async function run() {
  const logger = createLogger('cli');

  try {
    execSync('pnpm --version');
  } catch {
    logger.error('Please install pnpm');
    return;
  }

  const prompt = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the directory',
    },
    {
      type: 'checkbox',
      name: 'platforms',
      message: 'Select platforms',
      choices: [
        {
          name: 'Telegram',
          checked: true,
        },
        {
          name: 'Slack',
        },
        {
          name: 'Discord',
        },
      ],
    },
  ]);

  const name = prompt.name;
  const projectDir = `${cwd}/${name}`;

  if (existsSync(projectDir)) {
    logger.error('Directory already exists');
    return;
  }

  logger.info('Creating botmate project...');

  await mkdir(projectDir, { recursive: true });

  const templateDir = `${__dirname}/files`;
  const files = await fg(`${templateDir}/**/*`, { dot: true });

  for (const file of files) {
    let relativePath = file.replace(templateDir, '');

    if (file.endsWith('.ejs')) {
      relativePath = relativePath.replace('.ejs', '');
    }

    const targetPath = `${projectDir}${relativePath}`;
    const content = await ejs.renderFile(file);

    logger.info(`CREATE: ${relativePath}`);

    await writeFile(targetPath, content);
  }

  logger.info('Inslalling dependencies using "pnpm"');

  execSync('pnpm install', {
    cwd: projectDir,
    stdio: 'inherit',
  });
}

run();
