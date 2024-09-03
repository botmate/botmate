import { join } from 'path';

export const globExcludeFiles = [
  '!src/**/__tests__',
  '!src/**/__test__',
  '!src/**/__e2e__',
  '!src/**/demos',
  '!src/**/fixtures',
  '!src/**/*.mdx',
  '!src/**/*.md',
  '!src/**/*.+(test|e2e|spec).+(js|jsx|ts|tsx)',
];

export const ROOT_PATH = join(__dirname, '../../..');
export const PACKAGES_DIR = join(ROOT_PATH, 'packages');
export const PLUGINS_DIR = ['plugins'];
export const CORE_APP = join(PACKAGES_DIR, 'app');
export const CORE_CLIENT = join(PACKAGES_DIR, 'client');
export const PACKAGES_PATH = join(ROOT_PATH, 'packages');
