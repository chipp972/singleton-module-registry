export class ModuleRegistry<T = { [id: string]: any }> {
  private modules: Partial<T>;

  public constructor() {
    this.modules = {};
  }

  public clean(): ModuleRegistry {
    this.modules = {};
    return this;
  }

  public registerModule<K extends keyof T>(
    id: K,
    module: T[K],
  ): ModuleRegistry<T> {
    if (!id) {
      throw new Error('No id provided');
    }
    if (this.modules[id]) {
      throw new Error(`A module with id "${id}" is already registered`);
    }
    this.modules[id] = module;
    return this;
  }

  public unregisterModule<K extends keyof T>(id: K): ModuleRegistry {
    if (!this.modules[id]) {
      throw this.createNotFoundError(id);
    }
    delete this.modules[id];
    return this;
  }

  public getModule<K extends keyof T>(id: K): T[K] | undefined {
    const module = this.modules[id];
    if (!module) {
      throw this.createNotFoundError(id);
    }
    return module;
  }

  public getModules<K extends keyof T>(ids?: K[]): Partial<T> {
    const res: Partial<T> = {};
    if (!ids) {
      return this.modules;
    }
    ids.forEach((id) => {
      if (!this.modules[id]) {
        throw this.createNotFoundError(id);
      }
      res[id] = this.modules[id];
    });
    return res;
  }

  public getModuleIdsList(): string[] {
    return Object.keys(this.modules);
  }

  private createNotFoundError(id: string | number | symbol): Error {
    return new Error(`No module with id "${id.toString()}" found`);
  }
}
