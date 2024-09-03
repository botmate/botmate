export class Config {
  protected _config: Record<string, string | number | boolean> = {};

  get(key: string, defaultValue?: string | number | boolean) {
    return this._config[key] ?? defaultValue;
  }

  set(key: string, value: string | number | boolean) {
    this._config[key] = value;
  }
}
