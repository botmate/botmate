#!/usr/bin/env node
import { execSync } from 'child_process';
import colors from 'colors';
import ejs from 'ejs';
import fg from 'fast-glob';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import inquirer from 'inquirer';
import { dirname } from 'path';

const cwd = process.cwd();

async function run() {
  try {
    execSync('pnpm --version');
  } catch {
    console.error('Please install pnpm');
    return;
  }

  const prompt = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the directory',
      default: 'botmate',
    },
    {
      type: 'list',
      name: 'platform',
      message: 'Select a platform',
      choices: [
        {
          name: 'Telegram',
          checked: true,
        },
        {
          name: 'Discord',
        },
        {
          name: 'Slack',
          disabled: 'Coming soon',
        },
      ],
    },
  ]);

  const name = prompt.name;
  const projectDir = `${cwd}/${name}`;

  if (existsSync(projectDir)) {
    console.error(colors.red('Directory already exists'));
    return;
  }

  console.info('Creating botmate project...');

  await mkdir(projectDir, { recursive: true });

  const templateDir = `${__dirname}/../files`;
  const files = await fg(`${templateDir}/**/*`, { dot: true });

  for (const file of files) {
    let relativePath = file.replace(templateDir, '');

    if (file.endsWith('.ejs')) {
      relativePath = relativePath.replace('.ejs', '');
    }

    const targetPath = `${projectDir}${relativePath}`;
    const content = await ejs.renderFile(file, {
      name,
      platform: prompt.platform.toLowerCase(),
    });

    console.info(colors.green(`CREATE:`), `${relativePath}`);

    const dir = dirname(targetPath);

    await mkdir(dir, { recursive: true });
    await writeFile(targetPath, content);
  }

  console.info('Project created');
  console.info('Run the following commands to start the project:');
  console.info(colors.cyan.bold(`$ cd ${name}`));
  console.info(colors.cyan.bold('$ pnpm install'));
}

run();
