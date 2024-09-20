#!/usr/bin/env node
import { execSync } from 'child_process';
import colors from 'colors';
import ejs from 'ejs';
import execa from 'execa';
import fg from 'fast-glob';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import inquirer from 'inquirer';
import ora from 'ora';
import { dirname, join } from 'path';

const cwd = process.cwd();

const libraries: Record<string, string> = {
  telegram: 'grammy',
  discord: 'discord.js',
  slack: '@slack/bolt',
};

async function run() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const version = require('../package.json').version;
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
  const projectDir = join(cwd, name);

  if (existsSync(projectDir)) {
    console.error(colors.red('Directory already exists'));
    process.exit(1);
  }

  console.log();

  const creating = ora('Creating project').start();

  await mkdir(projectDir, { recursive: true });

  const templateDir = join(__dirname, '..', 'files');
  const files = await fg(`${templateDir}/**/*`, { dot: true });

  for (const file of files) {
    let relativePath = file.replace(templateDir, '');

    if (file.endsWith('.ejs')) {
      relativePath = relativePath.replace('.ejs', '');
    }

    const targetPath = join(projectDir, relativePath);
    const content = await ejs.renderFile(file, {
      name,
      platform: prompt.platform.toLowerCase(),
      version,
    });

    const dir = dirname(targetPath);

    await mkdir(dir, { recursive: true });
    await writeFile(targetPath, content);
  }

  await writeFile(
    join(projectDir, '.npmrc'),
    [
      'strict-peer-dependencies=false',
      'auto-install-peers=true',
      'ignore-workspace-root-check=true',
    ].join('\n'),
  );

  creating.succeed('Project created!');

  const formatting = ora('Formatting...').start();

  await execa('prettier', ['--write', projectDir]);

  formatting.succeed('Formatted');

  const installing = ora('Installing dependencies').start();

  const library = libraries[prompt.platform.toLowerCase()];

  await execa('pnpm', ['install', library], {
    cwd: projectDir,
  });

  installing.succeed('Dependencies installed');

  ora('Done').succeed();

  console.log();

  console.info('Run the following commands to start the project:');
  console.info(colors.cyan(`$ cd ${name}`));
  console.info(colors.cyan('$ pnpm dev'));
}

run();
