import { PlatformType, Plugin } from '@botmate/server';

export class RandomNumberGenerator extends Plugin {
  displayName = 'Random Number Generator';
  platformType = PlatformType.Telegram;

  async load() {
    console.log('Random Number Generator loaded');
  }
}
