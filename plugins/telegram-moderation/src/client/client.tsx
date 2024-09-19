import { ShieldIcon } from 'lucide-react';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Plugin } from '@botmate/client';

import Layout from './layout';
import AntiSpamPage from './pages/anti-spam';
import FiltersPage from './pages/filters';
import HomePage from './pages/home';
import NewUsers from './pages/new-users';

export class TelegramModeration extends Plugin {
  static displayName = 'Telegram Moderation';

  async beforeLoad() {
    this.addToSidebar({
      label: 'Moderation',
      icon: ShieldIcon,
      path: '/moderation',
      regex: /^\/moderation/,
    });

    this.addRoute({
      path: '/moderation/*',
      element: (
        <Layout>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="/new-users" element={<NewUsers />} />
            <Route path="/filters" element={<FiltersPage />} />
            <Route path="/anti-spam" element={<AntiSpamPage />} />
          </Routes>
        </Layout>
      ),
    });
  }
}
