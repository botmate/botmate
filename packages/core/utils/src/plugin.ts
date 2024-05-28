export function getPluginPath(name: string) {
  return require.resolve(name);
}
