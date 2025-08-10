/**
 * Provides universal loading of ES Modules / CommonJS on Node and ES Modules in the browser.
 *
 * {@link ModuleLoaderObj} is returned with the loaded module along with metadata that describes the loading mechanism.
 */
declare class ModuleLoader {
  /**
   * @template M, E
   *
   * Loads an ES Module via import dynamic or CommonJS via require in Node passing back an object containing info
   * about the loading process.
   *
   * @param {object}      options - Options object.
   *
   * @param {string|URL}  options.modulepath - A module name, file path, or URL.
   *
   * @param {(M) => E}    [options.resolveModule] - An optional function which resolves the import to set `instance`.
   *
   * @returns {Promise<ModuleLoaderObj<M, E>>} The module / instance and data about the loading process.
   */
  static load<M, E>({
    modulepath,
    resolveModule,
  }: {
    modulepath: string | URL;
    resolveModule?: (M: any) => E;
  }): Promise<ModuleLoaderObj<M, E>>;
}
/**
 * The object passed back from `ModuleLoader.load`.
 */
type ModuleLoaderObj<M, E> = {
  /**
   * If available the file path on Node otherwise this will match `loadpath` in the
   * browser.
   */
  filepath: string;
  /**
   * Either the module itself or any particular export the `resolveModule` function
   * selects.
   */
  instance: E;
  /**
   * Indicates if the import was an ES Module.
   */
  isESM: boolean;
  /**
   * A string representation of the module path being loaded.
   */
  loadpath: string;
  /**
   * The direct module import.
   */
  module: M;
  /**
   * The initial string or URL sent to ModuleLoader.
   */
  modulepath: string | URL;
  /**
   * The type and how the module was loaded.
   */
  type: 'import-module' | 'import-path' | 'import-url' | 'require-module' | 'require-path' | 'require-url';
};

/**
 * Provides a custom error for Node to combine CJS and ESM module not found errors.
 */
declare class ModuleLoadError extends Error {
  /**
   * @param {object} options - Options object.
   *
   * @param {string} options.message - Error message.
   *
   * @param {string} options.code - Error code.
   */
  constructor({ message, code }: { message: string; code: string });
  code: string;
}

export { ModuleLoadError, ModuleLoader, type ModuleLoaderObj };
