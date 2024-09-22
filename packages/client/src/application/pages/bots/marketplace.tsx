import { ImageOff } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button, PageLayout } from '@botmate/ui';

import useCurrentBot from '../../hooks/bots';
import { useSocketIO } from '../../hooks/socket';

function useLocalStorage<T = unknown>(key: string, initialValue: T) {
  const [value, setValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setItem = (newValue: T) => {
    setValue(newValue);
    window.localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setItem] as [T, (newValue: T) => void];
}

type MarketPlugin = {
  id: number;
  created_at: string;
  name: string;
  description: string;
  screenshots: string[];
  logo: string;
  version: string;
  github_url: string;
  npm_url: string;
  is_verified: boolean;
  publisher: Publisher;
  package_name: string;
  ref: string;
  categories: string[];
  github_stars: number;
  npm_downloads: number;
  last_updated: string;
};

type Publisher = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
};

function MarketplacePage() {
  const bot = useCurrentBot();
  const socket = useSocketIO();
  const [plugins, setPlugins] = useLocalStorage<MarketPlugin[]>('plugins', []);

  function updatePlugins() {
    fetch('https://market.botmate.dev/api/plugins')
      .then((res) => res.json())
      .then((data) => {
        setPlugins(data);
      });
  }

  useEffect(() => {
    if (!plugins || plugins.length === 0) updatePlugins();
  }, []);
  return (
    <PageLayout
      title="Marketplace"
      subtitle="Discover and install new plugins to extend the functionality of the bot."
      className="relative"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-6">
        {plugins.map((plugin) => {
          const ss = plugin.screenshots?.[0] || '';
          return (
            <div
              key={plugin.id}
              className="flex flex-col justify-between p-4 bg-muted/20 gap-4 rounded-2xl"
            >
              <div>
                {ss ? (
                  <img
                    src={ss}
                    alt={plugin.name}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-40 bg-muted/40 rounded-xl flex items-center justify-center">
                    <ImageOff />
                  </div>
                )}
                <h1 className="text-md font-medium mt-4">{plugin.name}</h1>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {plugin.description}
                </p>
                <div className="flex items-center mt-2">
                  {plugin.categories?.map((category) => (
                    <span
                      key={category}
                      className="text-xs bg-muted/40 px-2 py-1 rounded-full mr-2"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-1" />
              <div>
                <Button
                  onClick={() => {
                    socket.emit('install_plugin', {
                      package_name: plugin.package_name,
                      bot_id: bot.id,
                    });
                  }}
                >
                  Install
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}

export default MarketplacePage;
