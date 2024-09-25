import { PenLine } from 'lucide-react';
import React from 'react';

import { Plugin } from '@botmate/client';

import Page from './page';

export class TelegramPost extends Plugin {
  displayName = '@botmate/plugin-telegram-post';

  async beforeLoad() {
    this.addToSidebar({
      icon: PenLine,
      label: 'Telegram Post',
      path: '/telegram-post',
    });
    this.addRoute({
      path: '/telegram-post',
      element: <Page />,
    });
  }
}
