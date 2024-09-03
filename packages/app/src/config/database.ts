import { cleanEnv, str } from 'envalid';

export const database = cleanEnv(process.env, {});
