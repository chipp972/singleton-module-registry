import EventEmitter from 'eventemitter3';

export interface EventObject {
  eventNames: string[];
  emitter: EventEmitter;
}

export interface Module {
  id?: string;
  required?: string[];
  event?: EventObject;
  [operation: string]: any;
}

export class ModuleRegistry extends EventEmitter {
  private modules: { [id: string]: Module };
  private required: { [id: string]: number };

  constructor() {
    super();
    this.modules = {};
    this.required = {};
  }

  public clean(): ModuleRegistry {
    this.removeAllListeners();
    this.modules = {};
    this.required = {};
    return this;
  }

  public registerEvents(id: string, event?: EventObject): ModuleRegistry {
    if (!event) return this;
    const { emitter, eventNames } = event;
    eventNames.forEach((eventName: string) => {
      emitter.on(eventName, (...args) => {
        this.emit(`${id}:${eventName}`, ...args);
      });
    });
    return this;
  }

  public getRequiredModules(): string[] {
    return Object.keys(this.required);
  }

  public registerModule(module: Module, id?: string): ModuleRegistry {
    const namespace = id || module.id;
    if (!namespace) {
      throw new Error(`No id provided`);
    } else if (this.modules[namespace]) {
      throw new Error(`A module with id "${namespace}" is already registered`);
    }
    this.addRequiredModules(module.required);
    this.modules[namespace] = module;
    this.registerEvents(namespace, module.event);
    return this;
  }

  public unregisterModule(id: string): ModuleRegistry {
    if (!this.modules[id]) throw new Error(`No module with id "${id}" found`);
    const requiredNb: number | void = this.required[id];
    if (requiredNb) {
      throw new Error(
        `The module with id "${id}" is required by ${requiredNb} other modules`,
      );
    }
    this.removeRequiredModules(this.modules[id].required);
    delete this.modules[id];
    return this;
  }

  public getModule(id: string): Module {
    const module = this.modules[id];
    if (!module) throw new Error(`No module with id "${id}" found`);
    return module;
  }

  public getModules(ids?: string[]): { [id: string]: Module } {
    const res: { [id: string]: Module } = {};
    if (!ids) return res;
    ids.forEach((id: string) => {
      if (!this.modules[id]) throw new Error(`No module with id "${id}" found`);
      res[id] = this.modules[id];
    });
    return res;
  }

  public getModuleIdsList(): string[] {
    return Object.keys(this.modules);
  }

  public getModuleList(): Module[] {
    return Object.keys(this.modules).map((id: string) => this.modules[id]);
  }

  private removeRequiredModules(ids?: string[]): ModuleRegistry {
    if (!ids) return this;
    ids.forEach((id: string) => {
      this.required[id]--;
      if (this.required[id] === 0) delete this.required[id];
    });
    return this;
  }

  private addRequiredModule(id: string): ModuleRegistry {
    if (this.required[id]) this.required[id]++;
    else this.required[id] = 1;
    return this;
  }

  private addRequiredModules(ids?: string[]): ModuleRegistry {
    if (!ids) return this;
    ids.forEach((id: string) => this.addRequiredModule(id));
    return this;
  }
}
