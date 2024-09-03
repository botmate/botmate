import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter, Route, RouteObject, Routes } from 'react-router-dom';

import '@botmate/ui/styles.css';

import SettingsLayout from './layouts/settings';
import AnalyticsPage from './pages/bots/analytics';
import DashboardPage from './pages/bots/dashboard';
import MarketplacePage from './pages/bots/marketplace';
import GeneralSettingsPage from './pages/bots/settings';
import AppearanceSettingsPage from './pages/bots/settings/appearance';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import SetupPage from './pages/setup';
import { PluginManager } from './plugin-manager';
import { AppProvider } from './providers/app';
import { store } from './store';

export class Application {
  private _routes: RouteObject[] = [];
  private _pm = new PluginManager(this);

  get routes() {
    return this._routes;
  }

  get pluginManager() {
    return this._pm;
  }

  getRootComponent() {
    // todo: setup dynamic routes
    return () => (
      <BrowserRouter>
        <ReduxProvider store={store}>
          <Routes>
            <Route index path="/" element={<HomePage />} />
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<AppProvider app={this} />} path="/bots/:id">
              <Route index element={<DashboardPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="marketplace" element={<MarketplacePage />} />
              <Route path="settings" element={<SettingsLayout />}>
                <Route index element={<GeneralSettingsPage />} />
                <Route path="appearance" element={<AppearanceSettingsPage />} />
              </Route>
            </Route>
          </Routes>
        </ReduxProvider>
      </BrowserRouter>
    );
  }

  render(container: string) {
    Sentry.init({
      dsn: 'https://5177382ad836b2ffc883c3938f310dfe@o4507889496096768.ingest.us.sentry.io/4507889504550912',
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration()
      ],
      // Tracing
      tracesSampleRate: 1.0, //  Capture 100% of the transactions
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ['localhost'],
      // Session Replay
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });

    const element = document.getElementById(container);
    if (element) {
      const root = createRoot(element);
      const App = this.getRootComponent();

      root.render(<App />);
      return root;
    }
  }
}
