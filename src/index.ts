import { ModuleRegistry } from './module_registry';
export { EventObject, Module, ModuleRegistry } from './module_registry';

const REGISTRY_SINGLETON = Symbol.for('expressRegistry');

/**
 * Set the registry global variable
 * @param {ModuleRegistry} reg
 * @return {ModuleRegistry}
 */
export function setRegistrySingleton(reg: ModuleRegistry) {
  // @ts-ignore
  global[REGISTRY_SINGLETON] = reg;
  return reg;
}

/**
 * Get the registry global variable
 * @return {ModuleRegistry}
 */
export function getRegistrySingleton(): ModuleRegistry {
  const globalSymbols = Object.getOwnPropertySymbols(global);
  const hasRegistry = globalSymbols.indexOf(REGISTRY_SINGLETON) > -1;
  if (!hasRegistry) {
    // @ts-ignore
    global[REGISTRY_SINGLETON] = new ModuleRegistry();
  }
  // @ts-ignore
  return global[REGISTRY_SINGLETON];
}

/**
 * Clean the global namespace
 */
export function clearGlobals(): void {
  // @ts-ignore
  delete global[REGISTRY_SINGLETON];
}

export default getRegistrySingleton;
