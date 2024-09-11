import { Subscribe } from '@react-rxjs/core';
import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter, Route, RouteObject, Routes } from 'react-router-dom';

import type { IBot } from '@botmate/server';
import '@botmate/ui/styles.css';
import { ThemeProvider } from 'next-themes';
import { Subject } from 'rxjs';
import { Toaster } from 'sonner';

import { Api } from './api';
import MainLayout from './layouts/main';
import SettingsLayout from './layouts/settings';
import AnalyticsPage from './pages/bots/analytics';
import DashboardPage from './pages/bots/dashboard';
import MarketplacePage from './pages/bots/marketplace';
import GeneralSettingsPage from './pages/bots/settings';
import PluginSettingsPage from './pages/bots/settings/plugins';
import AppearanceSettingsPage from './pages/bots/settings/secutiry';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import SetupPage from './pages/setup';
import { AppProvider } from './providers/app';
import BotProvider from './providers/bot';
import PluginsProvider from './providers/plugins';
import { store } from './store';

export class EventEmitter {
  private _events = new Map<string, Subject<any>>();

  on(event: string, callback: (data: any) => void) {
    if (!this._events.has(event)) {
      this._events.set(event, new Subject());
    }

    this._events.get(event)?.subscribe(callback);
  }

  emit(event: string, data?: any) {
    if (this._events.has(event)) {
      this._events.get(event)?.next(data);
    }
  }
}

export class Application {
  api = new Api();

  private _routes: RouteObject[] = [];

  bot: IBot | null = null;
  emitter = new EventEmitter();

  private _pluginSettings = new Map<string, React.ReactNode>();

  get routes() {
    return this._routes;
  }

  get pluginSettings() {
    return this._pluginSettings;
  }

  getRootComponent() {
    // todo: setup dynamic routes
    return () => (
      <Subscribe>
        <Toaster />
        <ThemeProvider attribute="class">
          <BrowserRouter>
            <ReduxProvider store={store}>
              <Routes>
                <Route element={<AppProvider app={this} />}>
                  <Route index path="/" element={<HomePage />} />
                  <Route path="/setup" element={<SetupPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route element={<BotProvider app={this} />} path="/bots/:id">
                    <Route element={<PluginsProvider />}>
                      <Route element={<MainLayout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="analytics" element={<AnalyticsPage />} />
                        <Route
                          path="marketplace"
                          element={<MarketplacePage />}
                        />
                        <Route path="settings" element={<SettingsLayout />}>
                          <Route index element={<GeneralSettingsPage />} />
                          <Route
                            path="advanced"
                            element={<AppearanceSettingsPage />}
                          />
                          <Route
                            path="plugins"
                            element={<PluginSettingsPage />}
                          />
                        </Route>
                      </Route>
                    </Route>
                  </Route>
                </Route>
              </Routes>
            </ReduxProvider>
          </BrowserRouter>
        </ThemeProvider>
      </Subscribe>
    );
  }

  render(container: string) {
    const element = document.getElementById(container);
    if (element) {
      const root = createRoot(element);
      const App = this.getRootComponent();

      root.render(<App />);

      Sentry.init({
        dsn: 'https://5177382ad836b2ffc883c3938f310dfe@o4507889496096768.ingest.us.sentry.io/4507889504550912',
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration(),
        ],
        // Tracing
        tracesSampleRate: 1.0, //  Capture 100% of the transactions
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ['localhost'],
        // Session Replay
        replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
        replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
      });

      return root;
    }
  }
}

export * from './events';
