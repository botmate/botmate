import { ImageOff, RefreshCcw, UploadIcon, VerifiedIcon } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Button,
  Input,
  PageLayout,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@botmate/ui';
import { toast } from 'sonner';

import useCurrentBot from '../../hooks/bots';
import { useBotPlugins } from '../../hooks/plugins';
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
  const botPlugins = useBotPlugins();

  const [query, setQuery] = useState('');

  const [loading, setLoading] = useState(false);
  const [plugins, setPlugins] = useLocalStorage<MarketPlugin[]>('plugins', []);

  const filtered = useMemo(() => {
    if (query) {
      return plugins?.filter((plugin) => {
        const q = query.toLowerCase();
        const name = plugin.name.toLowerCase();
        const desc = plugin.description.toLowerCase();
        if (name.includes(q)) return true;
        if (desc.includes(q)) return true;
      });
    }
    return plugins ?? [];
  }, [query]);

  function updatePlugins() {
    setLoading(true);
    fetch('https://market.botmate.dev/api/plugins?platform=' + bot.platformType)
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem('plugins_updated_at', new Date().toISOString());
        setPlugins(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error('Failed to fetch plugins');
      });
  }

  useEffect(() => {
    if (!plugins || plugins.length === 0) updatePlugins();
    const updatedAt = localStorage.getItem('plugins_updated_at');
    if (updatedAt) {
      const HOURS = 4;
      const now = new Date();
      const lastUpdated = new Date(updatedAt);
      const diff = Math.abs(now.getTime() - lastUpdated.getTime());
      const hours = Math.floor(diff / 1000 / 60 / 60);
      if (hours >= HOURS) {
        updatePlugins();
      }
    }
  }, []);

  return (
    <PageLayout
      title="Marketplace"
      className="relative"
      actions={
        <div className="flex gap-2">
          <Input
            placeholder="Search plugins"
            className="w-52"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            variant="ghost"
            tooltip="Refresh"
            onClick={updatePlugins}
            isLoading={loading}
          >
            <RefreshCcw size={16} />
          </Button>
          <Link to="https://market.botmate.dev/" target="_blank">
            <Button variant="ghost" tooltip="Submit">
              <UploadIcon size={16} />
            </Button>
          </Link>
        </div>
      }
    >
      <div>
        {plugins.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <p className="text-muted-foreground text-lg">No plugins found</p>
          </div>
        ) : (
          <div>
            <p className="text-muted-foreground text-sm mb-4">
              Please note that some of the plugins are not verified by BotMate.
              Use them at your own risk.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-6">
              {filtered.map((plugin) => {
                const ss = plugin.screenshots?.[0] || '';
                const isInstalled = botPlugins.some(
                  (p) => p.name === plugin.package_name,
                );

                return (
                  <div
                    key={plugin.id}
                    className="flex flex-col justify-between p-4 bg-muted/20 gap-4 rounded-2xl border relative"
                  >
                    {plugin.is_verified && (
                      <TooltipProvider>
                        <Tooltip delayDuration={200}>
                          <TooltipTrigger asChild>
                            <div className="absolute text-primary bottom-4 right-4 p-1 rounded-full">
                              <VerifiedIcon size={20} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="text-xs">
                            This plugin is verified by BotMate.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <div>
                      <div className="flex items-center gap-3">
                        <img
                          src={plugin.logo}
                          alt={plugin.name}
                          className="w-14 aspect-square rounded-xl"
                        />

                        <div className="-2">
                          <h1 className={`text-lg font-medium`}>
                            {plugin.name}
                          </h1>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {plugin.description}
                          </p>
                        </div>
                      </div>

                      <div className="relative transition-all mt-4">
                        <div className="absolute bottom-2 left-2 flex items-center gap-2">
                          <span className="text-[12px] text-white bg-black/20 backdrop-blur-lg px-2 py-1 rounded-xl">
                            v{plugin.version}
                          </span>
                        </div>
                        {ss ? (
                          <img
                            src={ss}
                            alt={plugin.name}
                            className="w-full h-60 object-cover rounded-xl cursor-pointer"
                            onClick={() => {
                              const modal = document.createElement('div');
                              modal.className =
                                'fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center';
                              modal.innerHTML = `
                                <img src="${ss}" alt="${plugin.name}" class="max-w-5xl max-h-screen object-contain rounded-2xl" />
                              `;
                              modal.onclick = () => {
                                modal.remove();
                              };
                              document.body.appendChild(modal);
                            }}
                          />
                        ) : (
                          <div className="w-full h-60 bg-muted/40 rounded-xl flex items-center justify-center">
                            <ImageOff />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center mt-3 flex-wrap gap-2">
                        {/* {plugin.is_verified && (
                          <span className="text-[10px] bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-200 bg-muted/40 px-2 py-1 rounded-full">
                            <CheckIcon size={12} />
                          </span>
                        )} */}
                        {plugin.categories?.map((category) => (
                          <span
                            key={category}
                            className="text-[10px] bg-muted/40 px-2 py-1 rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          socket.emit('install_plugin', {
                            package_name: plugin.package_name,
                            bot_id: bot.id,
                          });
                        }}
                        disabled={isInstalled}
                      >
                        {isInstalled ? 'Installed' : 'Install'}
                      </Button>
                      <Link
                        to={`https://market.botmate.dev/explore/${plugin.id}`}
                        target="_blank"
                      >
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default MarketplacePage;
