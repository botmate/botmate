import { existsSync } from 'fs';
import { join } from 'path';

export const isProjectRepo = () => {
  return existsSync(join(process.cwd(), 'nx.json'));
};
