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

exports.generateAppDir = function () {
  const appPkgPath = dirname(
    dirname(require.resolve('@botmate/app/src/index.ts')),
  );
  const appDevDir = resolve(process.cwd(), './storage/.app-dev');
  if (
    exports.isDev() &&
    !exports.hasCorePackages() &&
    appPkgPath.includes('node_modules')
  ) {
    if (!existsSync(appDevDir)) {
      mkdirSync(appDevDir, { force: true, recursive: true });
      cpSync(appPkgPath, appDevDir, {
        recursive: true,
        force: true,
      });
    }
    process.env.APP_PACKAGE_ROOT = appDevDir;
  } else {
    process.env.APP_PACKAGE_ROOT = appPkgPath;
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
