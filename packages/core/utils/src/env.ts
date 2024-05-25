import 'dotenv/config';
import { cleanEnv, num, str } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    default: 'development',
    choices: ['development', 'production'],
  }),
  PORT: num({ default: 3000 }),
  JWT_SECRET: str({
    default: 'jwt_secret',
  }),
});
