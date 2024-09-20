import { PlatformType, Plugin } from '@botmate/server';
import type { Bot } from 'grammy';
import OpenAI from 'openai';

import { Config } from '../config.types';
import TotalMessagess from './widgets/total_message';

export class OpenAIChatbot extends Plugin {
  displayName = 'OpenAI Chatbot';
  platformType = PlatformType.Telegram;

  client?: OpenAI;

  async load() {
    const cm = this.configManager<Config>();
    const bot = this.bot.instance<Bot>();

    this.addWidget('total_message', {
      component: TotalMessagess,
      name: 'Total Messages',
      props: {},
    });

    bot.on('message', async (ctx) => {
      if (!this.client) {
        const apiKey = await cm.get('key');
        if (!apiKey) {
          this.logger.warn(`No API key was found for OpenAI`);
          return;
        }

        this.client = new OpenAI({
          apiKey,
        });
      }

      try {
        ctx.replyWithChatAction('typing');

        const chatCompletion = await this.client.chat.completions.create({
          messages: [{ role: 'user', content: ctx.message.text! }],
          model: 'gpt-3.5-turbo',
        });

        if (chatCompletion.choices) {
          const text = chatCompletion.choices[0].message.content;
          if (text) {
            ctx.reply(text);
          }
        }
      } catch (error) {
        this.logger.error('Error:', error);
        ctx.reply('An error occurred while processing your request');
      }
    });
  }
}
