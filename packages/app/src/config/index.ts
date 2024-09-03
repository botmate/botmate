import { database } from './database';

export async function getConfig() {
  return {
    ...database,
  };
}
