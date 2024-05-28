import { createLogger } from '@botmate/utils';
import { existsSync } from 'fs';
import { mkdir, rm } from 'fs/promises';
import { join } from 'path';

export const logger: ReturnType<typeof createLogger> = createLogger('build');

const TMP_DIR = 'tmp';

export const createTmpDir = async () => {
  const path = join(process.cwd(), TMP_DIR);
  if (!existsSync(path)) {
    await mkdir(path);
  }

  return {
    tmpDir: path,
    cleanup: () => {
      return rm(path, { recursive: true });
    },
  };
};
