import * as Sentry from '@sentry/react';
import { LucideIcon } from 'lucide-react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter, Route, RouteObject, Routes } from 'react-router-dom';

import type { IBot, IPlugin } from '@botmate/server';
import loadable from '@loadable/component';
import { ThemeProvider, useTheme } from 'next-themes';
import { Toaster } from 'sonner';

import { Plugin } from '../plugin';
import { Api } from './api';
import PluginRoutes from './components/plugin-routes';
import MainLayout from './layouts/main';
import SettingsLayout from './layouts/settings';
import WorkflowsPage from './pages/bots/workflow';
import { AppProvider } from './providers/app';
import AuthProvider from './providers/auth';
import BotProvider from './providers/bot';
import PluginsProvider from './providers/plugins';
import { SocketProvider } from './providers/socket';
import TRPCProvider from './providers/trpc';
import { store } from './store';

const AnalyticsPage = loadable(() => import('./pages/bots/analytics'));
const DashboardPage = loadable(() => import('./pages/bots/dashboard'));
const MarketplacePage = loadable(() => import('./pages/bots/marketplace'));
const GeneralSettingsPage = loadable(
  () => import('./pages/bots/settings/index'),
);
const PluginSettingsPage = loadable(
  () => import('./pages/bots/settings/plugins'),
);
const AppearanceSettingsPage = loadable(
  () => import('./pages/bots/settings/secutiry'),
);
const HomePage = loadable(() => import('./pages/home'));
const LoginPage = loadable(() => import('./pages/login'));
const SetupPage = loadable(() => import('./pages/setup'));

type ClientParams = {
  version: string;
  latestVersion: string;
  mode: 'development' | 'production';
};

export type MainSidebarItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  regex?: RegExp;
};

const ToastProvider = () => {
  const theme = useTheme();
  // todo: toast theme
  return <Toaster theme={theme.theme === 'dark' ? 'dark' : 'light'} />;
};

export class Application {
  api = new Api();

  private _routes: (RouteObject & { _plugin: IPlugin })[] = [];

  bot: IBot | null = null;
  version = '';

  private _sidebar: MainSidebarItem[] = [];
  private _pluginSettings = new Map<string, React.ReactNode>();
  private _pluginInstances = new Map<string, Plugin>();

  constructor(private _options: ClientParams) {
    this.version = _options.version;
  }

  /**
   * The method to add a new item to the sidebar.
   * All the items listed here are from the plugins.
   */
  get sidebar() {
    return this._sidebar;
  }

  get routes() {
    return this._routes;
  }

  get pluginSettings() {
    return this._pluginSettings;
  }

  get options() {
    return this._options;
  }

  get pluginInstances() {
    return this._pluginInstances;
  }

  getRootComponent() {
    // todo: setup dynamic routes
    return () => (
      <ThemeProvider attribute="class">
        <TRPCProvider>
          <SocketProvider>
            <ToastProvider />
            <BrowserRouter>
              <ReduxProvider store={store}>
                <Routes>
                  <Route element={<AppProvider app={this} />}>
                    <Route path="/setup" element={<SetupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<AuthProvider />}>
                      <Route index element={<HomePage />} />
                      <Route
                        element={<BotProvider app={this} />}
                        path="/bots/:botId"
                      >
                        <Route element={<PluginsProvider />}>
                          <Route element={<MainLayout />}>
                            <Route index element={<DashboardPage />} />
                            <Route
                              path="analytics"
                              element={<AnalyticsPage />}
                            />
                            <Route
                              path="marketplace"
                              element={<MarketplacePage />}
                            />
                            <Route
                              path="workflows"
                              element={<WorkflowsPage />}
                            />
                            <Route path="settings" element={<SettingsLayout />}>
                              <Route index element={<GeneralSettingsPage />} />
                              <Route
                                path="advanced"
                                element={<AppearanceSettingsPage />}
                              />
                              <Route
                                path="plugins/:name"
                                element={<PluginSettingsPage />}
                              />
                            </Route>
                            <Route path="*" element={<PluginRoutes />} />
                          </Route>
                        </Route>
                      </Route>
                    </Route>
                  </Route>
                </Routes>
              </ReduxProvider>
            </BrowserRouter>
          </SocketProvider>
        </TRPCProvider>
      </ThemeProvider>
    );
  }

  render(container: string) {
    const element = document.getElementById(container);
    if (element) {
      const root = createRoot(element);
      const App = this.getRootComponent();

      root.render(<App />);

      this.options.mode === 'production'
        ? Sentry.init({
            dsn: 'https://5177382ad836b2ffc883c3938f310dfe@o4507889496096768.ingest.us.sentry.io/4507889504550912',
            integrations: [
              Sentry.browserTracingIntegration(),
              Sentry.replayIntegration(),
            ],
            // Tracing
            tracesSampleRate: 1.0,
            // Session Replay
            replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
            replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
          })
        : null;

      return root;
    }
  }
}

export * from './events';
