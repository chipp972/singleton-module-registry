import { ModuleRegistry } from './module_registry';

describe('Module Registry', () => {
  describe('Basic operations', () => {
    it('should be able to instanciate a registry', () => {
      const registry: ModuleRegistry = new ModuleRegistry();
      expect(registry).toBeDefined();
    });

    it('should be able to register a module', () => {
      const registry: ModuleRegistry = new ModuleRegistry();
      registry.registerModule('test', 'haha');
      expect(registry.getModule('test')).toEqual('haha');
    });

    it('should be able to clean modules in a registry', () => {
      const registry: ModuleRegistry = new ModuleRegistry();
      registry.registerModule('test', 'haha');
      registry.clean();
      expect(registry.getModule.bind(registry, 'test')).toThrowError(
        `No module with id "test" found`,
      );
    });
  });

  describe('Registering modules', () => {
    const registry: ModuleRegistry = new ModuleRegistry();

    afterEach(() => {
      registry.clean();
    });

    it('should be able to register module', () => {
      registry.registerModule('test1', {});
      registry.registerModule('test2', 'haha');
      const modulesIds = registry.getModuleIdsList();

      expect(registry.getModule('test1')).toEqual({});
      expect(registry.getModule('test2')).toEqual('haha');
      expect(modulesIds).toEqual(['test1', 'test2']);
    });

    it('should be able to get modules with getModules function', () => {
      registry.registerModule('test1', { a: 'a' });
      registry.registerModule('test2', { b: 'b' });
      const { test1, test2 } = registry.getModules(['test1', 'test2']);

      expect(test1).toEqual({ a: 'a' });
      expect(test2).toEqual({ b: 'b' });
    });

    it('should prevent registering a module with a null id', () => {
      expect(registry.registerModule.bind(registry, null, {})).toThrowError(
        'No id provided',
      );
    });

    it('should prevent registering a module with an undefined id', () => {
      expect(registry.registerModule.bind(registry, null, {})).toThrowError(
        'No id provided',
      );
    });

    it('should prevent registering 2 modules with the same id', () => {
      registry.registerModule('test1', {});
      expect(registry.getModule('test1')).toEqual({});
      expect(
        registry.registerModule.bind(registry, 'test1', {}),
      ).toThrowError();
    });
  });

  describe('Retrieving modules', () => {
    let registry: ModuleRegistry;

    beforeEach(() => {
      registry = new ModuleRegistry();
      registry.registerModule('test', {});
    });

    afterEach(() => {
      registry.clean();
    });

    it('should throw an error if trying to retrieve a module that is not in the registry via getModules', () => {
      expect(
        registry.getModules.bind(registry, ['test', 'test2']),
      ).toThrowError(`No module with id "test2" found`);
    });

    it('should be able to list module ids', () => {
      registry.registerModule('test2', {});
      expect(registry.getModuleIdsList()).toEqual(['test', 'test2']);
    });

    it('should be able to retrieve module with number ids', () => {
      registry.registerModule(1, {});
      expect(registry.getModuleIdsList()).toEqual(['1', 'test']);
      expect(registry.getModules.bind(registry, ['test', 2])).toThrowError(
        `No module with id "2" found`,
      );
    });

    it('should throw an error if a module with number id is not present', () => {
      expect(registry.getModules.bind(registry, ['test', 1])).toThrowError(
        `No module with id "1" found`,
      );
    });
  });

  describe('Unregistering modules', () => {
    const registry: ModuleRegistry = new ModuleRegistry();

    afterEach(() => {
      registry.clean();
    });

    it('should prevent unregistering a module that is not in the registry', () => {
      expect(registry.unregisterModule.bind(registry, 'test1')).toThrow();
    });

    it('should be able to delete a registered module', () => {
      registry.registerModule('test', {});
      expect(registry.getModule('test')).toEqual({});
      registry.unregisterModule('test');
      expect(registry.getModule.bind(registry, 'test')).toThrowError(
        `No module with id "test" found`,
      );
    });
  });
});
