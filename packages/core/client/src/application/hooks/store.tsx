/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useRef } from 'react';

import {
  type StoreApi,
  createStore,
  useStore as useZustandStore,
} from 'zustand';

export type StoreItem<T = string | number | boolean | Record<string, any>> = {
  key: string;
  value: T;
};

type StoreItems = Map<string, StoreItem[]>;
export type StoreState = {
  items: StoreItems;
};

type StoreActions = {
  addItem: (namespace: string, item: StoreItem) => void;
};

type Store = StoreState & StoreActions;

const defaultInitState: StoreState = {
  items: new Map(),
};
const createRootStore = (initState: StoreState = defaultInitState) =>
  createStore<Store>((set) => ({
    ...initState,

    addItem: (namespace: string, item) => {
      set((state) => {
        if (!state.items.has(namespace)) {
          return state;
        }

        const items = state.items.get(namespace) || [];
        return {
          items: state.items.set(namespace, [...items, item]),
        };
      });
    },
  }));

type Context = StoreApi<Store>;
export const StoreContext = createContext<Context>({} as Context);

interface StoreProviderProps {
  children: React.ReactNode;
  initialState?: StoreState;
}

export const StoreProvider = ({
  children,
  initialState,
}: StoreProviderProps) => {
  const storeRef = useRef<StoreApi<Store>>();

  if (!storeRef.current) {
    storeRef.current = createRootStore(initialState);
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = <T,>(namespace: string) => {
  const storeContext = useContext(StoreContext);

  if (!storeContext) {
    throw new Error(`useStore must be use within StoreProvider`);
  }

  return useZustandStore(storeContext, (state) => {
    const items = state.items.get(namespace) || [];
    return items as StoreItem<T>[];
  });
};
