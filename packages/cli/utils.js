const { existsSync } = require('fs');
const { resolve } = require('path');

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
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  return exports.hasTsNode();
};

exports.hasTsNode = () => {
  return exports.isPackageValid('ts-node/dist/bin');
};

exports.initEnv = function () {
  const env = {
    PORT: '3000',
    NODE_ENV: 'development',
    DB_STORAGE: 'storage/db/botmate.sqlite',
  };

  for (const key in env) {
    if (!process.env[key]) {
      process.env[key] = env[key];
    }
  }
};
