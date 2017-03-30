/// <reference types="express" />
import { Router } from 'express';
import { IInternalVersioningOptions } from "../interfaces/IInternalVersioningOptions";
import { IVersioningOptions } from "../interfaces/IVersioningOptions";
export declare const VERSION_PLACEHOLDER = "__version__";
export declare function createRouter(options: IVersioningOptions): Router;
/**
 * Removes extension from string and returns new string
 *
 * @param filename
 * @returns {string}
 */
export declare function removeExtension(filename: string): string;
/**
 * Checks if current file is js file by checking filename
 *
 * @param filename
 * @returns {boolean}
 */
export declare function isJsFile(filename: string): boolean;
export declare function getResourceName(options: IInternalVersioningOptions, controllerName: string): string | undefined;
export declare function getController(module: any, controllerName: string): any;
export declare function prepareOptions(options: IVersioningOptions): IInternalVersioningOptions;
