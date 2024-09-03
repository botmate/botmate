import { Plugin } from '@botmate/client';

export class RandomNumberGenerator extends Plugin {
  displayName = 'Random Number Generator';

  load(): void {
    console.log('Random Number Generator loaded');
  }
}
