import defaultImport, {
  clearGlobals,
  getRegistrySingleton,
  injectRegistry,
  ModuleRegistry,
  registerModule,
  setRegistrySingleton,
} from './index';

describe('index', () => {
  it('should export clearGlobals', () => {
    expect(clearGlobals).toBeInstanceOf(Function);
  });

  it('should export getRegistrySingleton', () => {
    expect(getRegistrySingleton).toBeInstanceOf(Function);
  });

  it('should export setRegistrySingleton', () => {
    expect(setRegistrySingleton).toBeInstanceOf(Function);
  });

  it('should export ModuleRegistry class', () => {
    expect(ModuleRegistry).toBeDefined();
  });

  it('should export injectRegistry', () => {
    expect(injectRegistry).toBeInstanceOf(Function);
  });

  it('should export registerModule', () => {
    expect(registerModule).toBeInstanceOf(Function);
  });

  it('should export by default getRegistrySingleton', () => {
    expect(defaultImport).toBe(getRegistrySingleton);
  });
});
