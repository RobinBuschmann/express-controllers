import { IVersioningDefaultOptions } from "./IVersioningDefaultOptions";
export interface IInternalVersioningOptions extends IVersioningDefaultOptions {
    path: string;
    /**
     * Regex pattern of versions to recognize a version folder
     */
    versionPattern: RegExp;
    /**
     * Regex pattern of controllers to recognize controller files
     */
    controllerPattern: RegExp;
    /**
     * Name of directory in which abstract controllers can be
     * found
     */
    abstractDir: string;
}
