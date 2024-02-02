import 'dotenv/config';
import { Bot } from 'grammy';

const token = process.env.BOT_TOKEN;
export const bot = new Bot(token);
