import { configureStore } from '@reduxjs/toolkit';

import { baseApi } from './api';
import plugins from './reducers/plugins';

export const store = configureStore({
  reducer: {
    plugins,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(baseApi.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
