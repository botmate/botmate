import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import { join } from 'path';

export function shrinkPath(path: string, length = 20) {
  if (path.length <= length) {
    return path;
  }

  const parts = path.split('/');
  const first = parts.shift();
  const last = parts.pop();

  return `${first}/.../${last}`;
}

export async function createTmpDir() {
  const tmpDir = join(
    process.cwd(),
    'tmp',
    Math.random().toString(36).substring(7),
  );
  await mkdir(tmpDir, { recursive: true });
  return tmpDir;
}

export async function isTypeScriptPackage(pkgPath: string) {
  try {
    const hasSrcFolder = existsSync(join(pkgPath, 'src'));
    return hasSrcFolder;
  } catch (e) {
    return false;
  }
}

export async function getExportedName(path: string) {
  const m = await import(path);
  const [key] = Object.keys(m);
  return key;
}
