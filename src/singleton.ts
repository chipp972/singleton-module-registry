import { ModuleRegistry } from './module_registry';

export const REGISTRY_SINGLETON = Symbol.for('registrySingleton');

/**
 * swap the registry in the global object with the one provided
 * @param {ModuleRegistry} reg
 * @return {ModuleRegistry}
 */
export function setRegistrySingleton<T>(reg: ModuleRegistry<T>) {
  // @ts-ignore
  global[REGISTRY_SINGLETON] = reg;
  return reg;
}

/**
 * Get the registry from the global object
 * @return {ModuleRegistry}
 */
export function getRegistrySingleton<T>(): ModuleRegistry<T> {
  const globalSymbols = Object.getOwnPropertySymbols(global);
  const hasRegistry = globalSymbols.indexOf(REGISTRY_SINGLETON) > -1;
  if (!hasRegistry) {
    // @ts-ignore
    global[REGISTRY_SINGLETON] = new ModuleRegistry<T>();
  }
  // @ts-ignore
  return global[REGISTRY_SINGLETON];
}

export function registerModule<T>(id: keyof T, module: any): ModuleRegistry<T> {
  return getRegistrySingleton<T>().registerModule(id, module);
}

/**
 * Clean the global object
 */
export function clearGlobals(): void {
  // @ts-ignore
  delete global[REGISTRY_SINGLETON];
}

/**
 * Higher-Order function that lets you inject the whole or part of the registry into a function
 * just like react-redux connect function
 * Use it as a Dependency Injection mechanism to keep your function pure, easy to test
 * and to code against an interface instead of an implementation
 */
export function injectRegistry<ModulesT, InputT, OutputT>(
  mapRegistryToProps?: (modules: Partial<ModulesT>) => InputT,
): (fn: (ins: InputT | Partial<ModulesT>) => OutputT) => () => OutputT {
  return (fn) => () => {
    const modules = getRegistrySingleton<ModulesT>().getModules();
    const params = mapRegistryToProps ? mapRegistryToProps(modules) : modules;
    return fn(params);
  };
}
