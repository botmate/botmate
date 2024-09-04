import React from 'react';

import { Plugin } from '@botmate/client';

import SettingsPage from './settings';

export class OpenAIChatbot extends Plugin {
  displayName = 'OpenAI Chatbot';

  async beforeLoad() {
    this.setSettingsPage(<SettingsPage />);
  }
}
