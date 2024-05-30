import { RouteObject } from 'react-router-dom';

import { ApplicationContext } from './context';
import { StoreItem, StoreState } from './hooks';
import { PluginManager } from './plugin-manager';
import AppProvider from './provider';

export class Application {
  routes: RouteObject[] = [];
  pluginManager: PluginManager;
  _store: StoreState = {
    items: new Map(),
  };

  constructor() {
    this.pluginManager = new PluginManager(this);
  }

  get plugins() {
    return this.pluginManager.plugins;
  }

  addRoute(route: RouteObject) {
    this.routes.unshift(route);
  }

  registerNamespace(namespace: string) {
    const has = this._store.items.has(namespace);

    if (!has) {
      this._store.items.set(namespace, []);
    }
  }

  useStore<T>(namespace: string) {
    const has = this._store.items.has(namespace);

    if (!has) {
      throw new Error(`Namespace ${namespace} does not exist`);
    }

    return {
      all: () => {
        return this._store.items.get(namespace) as StoreItem<T>[];
      },
      get: (key: string) => {
        return this._store.items
          .get(namespace)
          ?.find((item) => item.key === key);
      },
      insertOne: (item: StoreItem<T>) => {
        const items = this._store.items.get(namespace);

        if (items) {
          items.push(item as StoreItem);
        }

        this._store.items.set(namespace, items as StoreItem[]);
      },
    };
  }

  async getRootComponent() {
    return (
      <ApplicationContext.Provider value={this}>
        <AppProvider app={this} />
      </ApplicationContext.Provider>
    );
  }
}
