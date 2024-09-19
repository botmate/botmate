import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import type { PluginMeta } from '@botmate/server';
import {
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@botmate/ui';

import { useApp } from '../../../hooks/use-app';
import useCurrentBot from '../../../hooks/use-bot';
import { useBotPlugins, usePlugins } from '../../../hooks/use-plugins';
import { setCurrentPlugin } from '../../../reducers/plugins';
import {
  useDisablePluginMutation,
  useEnablePluginMutation,
  useInstallPluginMutation,
  useUninstallPluginMutation,
} from '../../../services/plugins';

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(
    window.matchMedia(query).matches,
  );

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

function PluginSettingsPage() {
  const app = useApp();
  const params = useParams();

  const plugins = usePlugins();
  const botPlugins = useBotPlugins();
  const bot = useCurrentBot();
  const dispatch = useDispatch();

  const [installPluginMutation] = useInstallPluginMutation();
  const [uninstallPluginMutation] = useUninstallPluginMutation();
  const [enablePluginMutation] = useEnablePluginMutation();
  const [disablePluginMutation] = useDisablePluginMutation();

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  console.log('isDesktop', isDesktop);

  const name = params.name;

  const plugin = plugins?.find((plugin) => plugin.name === name) as
    | PluginMeta
    | undefined;

  useEffect(() => {
    if (plugin) {
      const data = botPlugins.find((p) => p.name === plugin.name);
      if (data) {
        dispatch(setCurrentPlugin(data));
      }
    }
    return () => {
      dispatch(setCurrentPlugin(null));
    };
  }, [plugin]);

  if (plugin) {
    const data = botPlugins.find((p) => p.name === plugin.name);
    const Settings = app.pluginSettings.get(plugin.name);

    return (
      <div className="flex-1">
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h1 className="text-xl font-medium">{plugin.displayName}</h1>
            <p className="text-muted-foreground">{plugin.description}</p>
          </div>
        </div>

        <div className="px-4 py-4 border-b w-full bg-muted/20">
          <div className="flex gap-2 items-center overflow-auto *:flex-shrink-0">
            <Badge
              className="cursor-pointer"
              onClick={async () => {
                if (data) {
                  if (data.enabled) {
                    await disablePluginMutation({
                      botId: bot.id,
                      name: plugin.name,
                    }).unwrap();
                  } else {
                    await enablePluginMutation({
                      botId: bot.id,
                      name: plugin.name,
                    }).unwrap();
                  }
                } else {
                  await installPluginMutation({
                    botId: bot.id,
                    name: plugin.name,
                  }).unwrap();
                  window.location.reload();
                }
              }}
            >
              click to{' '}
              {data ? (data?.enabled ? 'disable' : 'enable') : 'install'}
            </Badge>{' '}
            {/* {!!data && (
              <Dialog>
                <DialogTrigger asChild>
                  <Badge className="cursor-pointer">configure</Badge>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <div>{Settings || 'No settings'}</div>
                </DialogContent>
              </Dialog>
            )} */}
            {!!data &&
              (isDesktop ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Badge className="cursor-pointer">configure</Badge>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Settings</DialogTitle>
                      <DialogDescription></DialogDescription>
                    </DialogHeader>

                    <div>{Settings || 'No settings'}</div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Drawer>
                  <DrawerTrigger asChild>
                    <Badge className="cursor-pointer">configure</Badge>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Settings</DrawerTitle>
                      <DrawerDescription>
                        Configure the settings for the plugin.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4">{Settings || 'No settings'}</div>
                  </DrawerContent>
                </Drawer>
              ))}
            <Badge variant="outline">v{plugin.version}</Badge>
            <Badge variant="outline">latest</Badge>
            <div className="flex-1" />
            {!!data && (
              <>
                <Badge
                  variant="danger"
                  className="bg-red-500 text-white cursor-pointer hover:bg-red-400"
                  onClick={async () => {
                    await uninstallPluginMutation({
                      botId: bot.id,
                      name: plugin.name,
                    }).unwrap();
                    window.location.reload();
                  }}
                >
                  uninstall
                </Badge>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-2xl">Docs</h1>
        </div>
      </div>
    );
  }

  if (!plugin)
    return (
      <div className="h-screen flex items-center justify-center">
        <h1>Plugin not found</h1>
      </div>
    );
}

export default PluginSettingsPage;
