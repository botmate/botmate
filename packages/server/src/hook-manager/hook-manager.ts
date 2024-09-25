/* eslint-disable @typescript-eslint/no-explicit-any */
type HookFunction = (...args: any[]) => void;

type ServerHook = {
  name: string;
  namespace: string;
  callback: HookFunction;
};

export class HookManager {
  protected hooks: ServerHook[] = [];

  registerHook(name: string, callback: HookFunction) {
    const namespace = name.split('/')[0];
    this.hooks.push({ name, callback, namespace });
  }

  async invoke<T>(name: string, ...args: any[]): Promise<T> {
    const hook = this.hooks.find((h) => h.name === name);
    if (hook) {
      return hook.callback(...args) as T;
    }
    throw new Error(`Hook ${name} not found`);
  }
}
