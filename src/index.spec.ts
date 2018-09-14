import EventEmitter from 'eventemitter3';
import {
  clearGlobals,
  getRegistrySingleton,
  ModuleRegistry,
  setRegistrySingleton,
} from './index';

describe('Module Registry', function() {
  const registry: ModuleRegistry = getRegistrySingleton();

  afterEach(function() {
    registry.clean();
    clearGlobals();
  });

  describe('Registering modules', function() {
    it('should be able to register module', function() {
      registry.registerModule({ id: 'test1' });
      registry.registerModule({}, 'test2');
      const modules = registry.getModuleList();
      const modulesIds = registry.getModuleIdsList();

      expect(registry.getModule('test1')).toEqual({ id: 'test1' });
      expect(registry.getModule('test2')).toEqual({});
      expect(modules).toEqual([{ id: 'test1' }, {}]);
      expect(modulesIds).toEqual(['test1', 'test2']);
    });

    it('should be able to get modules with getModules function', function() {
      registry.registerModule({ id: 'test1' });
      registry.registerModule({}, 'test2');
      const { test1, test2 } = registry.getModules(['test1', 'test2']);

      expect(test1).toEqual({ id: 'test1' });
      expect(test2).toEqual({});
    });

    it('should prevent registering a module without id', function() {
      expect(registry.registerModule.bind(registry, {})).toThrowError(
        'No id provided',
      );
    });

    it('should prevent registering a module with an undefined id', function() {
      expect(
        registry.registerModule.bind(registry, { id: undefined }),
      ).toThrowError('No id provided');
    });

    it('should prevent registering 2 modules with the same id', function() {
      registry.registerModule({ id: 'test1' });
      expect(registry.getModule('test1')).toEqual({ id: 'test1' });
      expect(
        registry.registerModule.bind(registry, { id: 'test1' }),
      ).toThrowError();
    });
  });

  describe('Unregistering modules', function() {
    it('should prevent unregistering a module that is required by another module', function() {
      registry.registerModule({ id: 'test1' });
      registry.registerModule({ id: 'test2', required: ['test1'] });
      expect(registry.unregisterModule.bind(registry, 'test1')).toThrow();
      expect(registry.unregisterModule.bind(registry, 'test2')).not.toThrow();
      expect(registry.unregisterModule.bind(registry, 'test1')).not.toThrow();
    });

    it('should prevent unregistering a module that is not in the registry', function() {
      expect(registry.unregisterModule.bind(registry, 'test1')).toThrow();
    });
  });

  describe('Events', function() {
    it('should be able to register a module events', function() {
      const emitter = new EventEmitter();
      const eventSpy = jest.fn();
      const unregistredEventSpy = jest.fn();
      registry.registerModule({
        id: 'module1',
        event: {
          emitter,
          eventNames: ['event1'],
        },
      });
      registry.on('module1:event1', eventSpy);
      registry.on('module1:event2', unregistredEventSpy);
      emitter.emit('event1', { data: 'data' });
      emitter.emit('event2', { data: 'data2' });

      expect(eventSpy).toBeCalledTimes(1);
      expect(unregistredEventSpy).not.toBeCalled();
      expect(eventSpy).toBeCalledWith({ data: 'data' });
    });

    it('should be able to register standalone events', function() {
      const emitter = new EventEmitter();
      const eventSpy = jest.fn();
      const unregistredEventSpy = jest.fn();
      registry.registerEvents('standalone', {
        emitter,
        eventNames: ['event1'],
      });
      registry.on('standalone:event1', eventSpy);
      registry.on('standalone:event2', unregistredEventSpy);
      emitter.emit('event1', { data: 'data' });
      emitter.emit('event2', { data: 'data2' });

      expect(eventSpy).toBeCalledTimes(1);
      expect(unregistredEventSpy).not.toBeCalled();
      expect(eventSpy).toBeCalledWith({ data: 'data' });
    });
  });

  describe('Modifying registry singleton', function() {
    it('should be able to change library registry instance', function() {
      registry.registerModule({ id: 'test1' });
      expect(registry.getModule('test1')).toEqual({ id: 'test1' });
      const otherRegistry = new ModuleRegistry();
      otherRegistry.registerModule({ id: 'test2' });
      expect(otherRegistry.getModule('test2')).toEqual({ id: 'test2' });
      setRegistrySingleton(otherRegistry);
      expect(getRegistrySingleton()).toEqual(otherRegistry);
      expect(getRegistrySingleton().getModule('test2')).toEqual({
        id: 'test2',
      });
    });
  });
});
