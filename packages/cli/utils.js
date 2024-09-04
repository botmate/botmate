const { mkdirSync, existsSync, cpSync } = require('fs');
const { dirname, resolve } = require('path');

exports.isPackageValid = (pkg) => {
  try {
    require.resolve(pkg);
    return true;
  } catch (error) {
    return false;
  }
};

exports.hasCorePackages = () => {
  const coreDir = resolve(process.cwd(), 'packages/core/build');
  return existsSync(coreDir);
};

exports.isDev = function isDev() {
  if (process.env.APP_ENV === 'production') {
    return false;
  }
  return exports.hasTsNode();
};

exports.hasTsNode = () => {
  return exports.isPackageValid('ts-node/dist/bin');
};

exports.setupAppDir = function () {
  try {
    require.resolve('@botmate/app/src/index.ts');
    process.env.APP_PACKAGE_ROOT = dirname(
      dirname(require.resolve('@botmate/app/src/index.ts')),
    );
  } catch {
    require.resolve('@botmate/app');
    process.env.APP_PACKAGE_ROOT = dirname(
      dirname(require.resolve('@botmate/app')),
    );
  }
};

exports.initEnv = function () {
  const env = {
    APP_ENV: 'development',
    APP_PORT: '3000',
    API_BASE_PATH: '/api',
    DB_STORAGE: 'storage/db/botmate.sqlite',
  };

  for (const key in env) {
    if (!process.env[key]) {
      process.env[key] = env[key];
    }
  }
};
