import type { IPlugin } from '@botmate/server';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';

interface PluginState {
  current: null | IPlugin;
}

const initialState = { current: null } satisfies PluginState as PluginState;

const pluginsSlice = createSlice({
  name: 'plugins',
  initialState,
  reducers: {
    setCurrentPlugin(state, action: PayloadAction<IPlugin | null>) {
      state.current = action.payload;
    },
  },
});

export const { setCurrentPlugin } = pluginsSlice.actions;
export default pluginsSlice.reducer;

export const selectCurrentPlugin = (root: RootState) => root.plugins.current;
