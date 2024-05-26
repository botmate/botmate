#!/usr/bin/env node
import ejs from 'ejs';
import fg from 'fast-glob';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import inquirer from 'inquirer';

const cwd = process.cwd();

async function run() {
  const prompt = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of your bot?',
    },
  ]);

  const name = prompt.name;
  const projectDir = `${cwd}/${name}`;
  if (existsSync(projectDir)) {
    console.log('Directory already exists');
    return;
  }

  await mkdir(projectDir, { recursive: true });

  console.log('Creating botmate project...');

  const templateDir = `${__dirname}/files`;
  const files = await fg(`${templateDir}/**/*`, { dot: true });

  for (const file of files) {
    let relativePath = file.replace(templateDir, '');

    if (file.endsWith('.ejs')) {
      relativePath = relativePath.replace('.ejs', '');
    }

    const targetPath = `${projectDir}${relativePath}`;
    const content = await ejs.renderFile(file);
    console.log('Creating file', targetPath);
    await writeFile(targetPath, content);
  }

  console.log('✅ Done!');
  console.log('To start the app, run:');
  console.log(`cd ${name}`);
  console.log('npm install');
  console.log('npm run setup');
  console.log('npm run start');
}

run();
