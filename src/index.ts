import { getRegistrySingleton } from './singleton';

export { ModuleRegistry } from './module_registry';
export {
  clearGlobals,
  getRegistrySingleton,
  injectRegistry,
  registerModule,
  setRegistrySingleton,
} from './singleton';
export default getRegistrySingleton;
