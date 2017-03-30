import 'reflect-metadata';
import { IRouteHandlerOption } from "../interfaces/IRouteHandlerOption";
import { IRouteHandlerOptions } from "../interfaces/IRouteHandlerOptions";
export declare function annotateRoute(method: string, args: any[]): void | Function;
export declare function overrideRouteHandler(target: any, propertyKey: string): void | Function;
/**
 * Returns route handlers from specified class prototype by restoring this
 * information from reflect metadata
 */
export declare function getRouteHandlerOptions(target: any): IRouteHandlerOptions | undefined;
/**
 * Sets attributes
 */
export declare function setRouteHandlerOptions(target: any, options: IRouteHandlerOptions): void;
/**
 * Adds model attribute by specified property name and
 * sequelize attribute options and stores this information
 * through reflect metadata
 */
export declare function addRouteHandlerOption(target: any, option: IRouteHandlerOption): void;
