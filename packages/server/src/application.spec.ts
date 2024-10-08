import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Application } from './application';
import { BotManager } from './bot-manager';
import { ConfigManager } from './config';
// import { connectToDatabase } from './database';
import { PlatformManager } from './platform-manager';
import { PluginManager } from './plugin-manager';

// import { setupVite } from './vite';

vi.mock('./routes', () => ({
  setupCoreRoutes: vi.fn(),
}));

vi.mock('./vite', () => ({
  setupVite: vi.fn(),
}));

vi.mock('./database', () => ({
  connectToDatabase: vi.fn(),
}));

describe('Application', () => {
  let app: Application;

  beforeEach(() => {
    app = new Application({
      dbString: 'empty_string',
    });
  });

  it('should initialize with default values', () => {
    expect(app.mode).toBe('development');
    expect(app.port).toBe(8233);
    expect(app.rootPath).toBe(process.cwd());
    expect(app.isMonorepo).toBe(false);
  });

  it('should create instances of managers', () => {
    expect(app.pluginManager).toBeInstanceOf(PluginManager);
    expect(app.platformManager).toBeInstanceOf(PlatformManager);
    expect(app.botManager).toBeInstanceOf(BotManager);
    expect(app.configManager).toBeInstanceOf(ConfigManager);
  });

  // it('should initialize the application', async () => {
  //   await app.init();

  //   expect(setupVite).toHaveBeenCalled();
  //   expect(connectToDatabase).toHaveBeenCalled();
  // });

  // it('should start the server', async () => {
  //   vi.spyOn(app.server, 'listen').mockImplementation(() => {
  //     return {} as never;
  //   });
  //   await app.start();
  //   expect(app.server.listen).toHaveBeenCalledWith(app.port);
  // });

  it('should stop the application', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit() was called.');
    });

    try {
      await app.stop();
    } catch (e) {
      if (e instanceof Error)
        expect(e.message).toBe('process.exit() was called.');
    }

    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it('should get the latest version', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ latest: '1.0.0' }),
    });
    global.fetch = fetchMock;

    const version = await app.getLatestVersion();
    expect(version).toBe('1.0.0');
  });
});
