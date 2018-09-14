import { ModuleRegistry } from './module_registry';
import {
  clearGlobals,
  getRegistrySingleton,
  injectRegistry,
  registerModule,
  REGISTRY_SINGLETON,
  setRegistrySingleton,
} from './singleton';

describe('getRegistrySingleton', () => {
  it('should instantiate a new registry if none is defined', () => {
    expect(global[REGISTRY_SINGLETON]).toBeUndefined();
    getRegistrySingleton();
    expect(global[REGISTRY_SINGLETON]).toBeDefined();
  });

  it('should return the global registry singleton', () => {
    const registry = getRegistrySingleton();
    expect(registry).toEqual(global[REGISTRY_SINGLETON]);
  });
});

describe('clearGlobals', () => {
  it('should delete global registry', () => {
    getRegistrySingleton();
    expect(global[REGISTRY_SINGLETON]).toBeDefined();
    clearGlobals();
    expect(global[REGISTRY_SINGLETON]).toBeUndefined();
  });
});

describe('setRegistrySingleton', () => {
  let registry: ModuleRegistry;

  beforeEach(() => {
    registry = getRegistrySingleton();
  });

  afterEach(function() {
    registry.clean();
    clearGlobals();
  });

  it('should swap the default instance with the one provided', () => {
    registry.registerModule('test1', {});
    expect(registry.getModule('test1')).toEqual({});

    const otherRegistry = new ModuleRegistry();
    otherRegistry.registerModule('test2', { a: 'a' });
    expect(otherRegistry.getModule('test2')).toEqual({ a: 'a' });

    setRegistrySingleton(otherRegistry);
    expect(getRegistrySingleton()).toEqual(otherRegistry);
    expect(
      getRegistrySingleton<{ test2: string }>().getModule('test2'),
    ).toEqual({ a: 'a' });
  });
});

describe('registerModule', () => {
  it('should instantiate a registry and add the module', () => {
    expect(global[REGISTRY_SINGLETON]).toBeUndefined();
    registerModule<{ test: {} }>('test', {});
    expect(global[REGISTRY_SINGLETON]).toBeDefined();
    expect(global[REGISTRY_SINGLETON].getModule('test')).toEqual({});
  });
});

describe('injectRegistry', () => {
  interface T {
    test1: {
      a: string;
    };
    test2: {
      b: string;
    };
  }
  let registry: ModuleRegistry<T>;

  beforeEach(() => {
    registry = getRegistrySingleton();
    registry.registerModule('test1', { a: 'a' });
    registry.registerModule('test2', { b: 'b' });
  });

  afterEach(() => {
    registry.clean();
    clearGlobals();
  });

  it('should return a function', () => {
    const test = injectRegistry();
    expect(test).toBeInstanceOf(Function);
  });

  it('should throw an error if we execute the resulting function without argument', () => {
    const test = injectRegistry();
    expect(test).toThrowError(`Cannot read property 'bind' of undefined`);
  });

  it('should binds the function given as 2nd argument with the whole registry if no mapper is provided', () => {
    const spy = jest.fn();
    const test = injectRegistry()(spy);
    test();
    expect(spy).toHaveBeenCalledWith({
      test1: { a: 'a' },
      test2: { b: 'b' },
    });
  });

  it('should binds the function given as 2nd argument with the mapped registry if a mapper is provided', () => {
    const spy = jest.fn();
    interface T1 {
      test3: string;
      test4: string;
      test5: string;
    }

    const test = injectRegistry<T, T1, void>((reg) => ({
      test3: reg.test1.a,
      test4: reg.test2.b,
      test5: reg.test1.a + reg.test2.b,
    }))(spy);
    test();
    expect(spy).toHaveBeenCalledWith({
      test3: 'a',
      test4: 'b',
      test5: 'ab',
    });
  });
});
