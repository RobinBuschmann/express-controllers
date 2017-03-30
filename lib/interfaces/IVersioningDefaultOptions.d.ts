export interface IVersioningDefaultOptions {
    /**
     * Regex pattern of versions to recognize a version folder
     */
    versionPattern?: RegExp;
    /**
     * Regex pattern of controllers to recognize controller files
     */
    controllerPattern?: RegExp;
    /**
     * Name of directory in which abstract controllers can be
     * found
     */
    abstractDir?: string;
    /**
     * Prints some info to console if true. Default is false
     */
    debug?: boolean;
    /**
     * Injector to inject controller class instance
     */
    injector?: {
        get<T>(model: any): T;
    };
    /**
     * Inject function to inject a controller class instance
     */
    inject?<T>(model: any): T;
}
