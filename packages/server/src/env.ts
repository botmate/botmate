import 'dotenv/config';
import { cleanEnv, num, str } from 'envalid';

export const env = cleanEnv(process.env, {
  DATABASE_URL: str({
    desc: 'The URL of MongoDB database',
  }),
  PORT: num({ default: 8233 }),
});
