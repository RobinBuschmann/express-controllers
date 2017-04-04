
export interface IControllerDefaultOptions {

  /**
   * Regex pattern to recognize a version folder
   * @default /^(v\d.*)$/
   */
  versionPattern?: RegExp;

  /**
   * Regex pattern to recognize controller files
   * @default /^(.*?)$/
   */
  controllerPattern?: RegExp;

  /**
   * Name of directory in which abstract controllers can be
   * found
   * @default abstract
   */
  abstractDir?: string;

  /**
   * Prints some info to console if true. Default is false
   * @default false
   */
  debug?: boolean;

  /**
   * Indicates if routes handlers should be resolved from
   * controllers automatically or not
   * @default false
   */
  resolveRouteHandler?: boolean;

  /**
   * Injector to inject controller class instance
   */
  injector?: {get<T>(model: any): T};

  /**
   * Inject function to inject a controller class instance
   */
  inject?<T>(model: any): T;

}
