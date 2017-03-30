import 'reflect-metadata';
import {IRouteHandlerOption} from "../interfaces/IRouteHandlerOption";
import {deepAssign} from "../utils/object";
import {IRouteHandlerOptions} from "../interfaces/IRouteHandlerOptions";
import {capitalize} from "../utils/string";

const ROUTE_HANDLERS_KEY = 'er:route-handler';

export function annotateRoute(method: string, args: any[]): void|Function {

  let path = '';

  if (args.length === 1) {

    path = args[0];

    return (target: any, propertyKey: string) =>
      addRouteHandlerOption(target, {method, path, propertyKey, implementations: [target]});
  } else {

    const target = args[0];
    const propertyKey = args[1];

    addRouteHandlerOption(target, {method, path, propertyKey, implementations: [target]});
  }
}

export function overrideRouteHandler(target: any, propertyKey: string): void|Function {

  const options = getRouteHandlerOptions(target);


}

/**
 * Returns route handlers from specified class prototype by restoring this
 * information from reflect metadata
 */
export function getRouteHandlerOptions(target: any): IRouteHandlerOptions|undefined {

  const options = Reflect.getMetadata(ROUTE_HANDLERS_KEY, target);

  if (options) {
    return options.map(opt => deepAssign({}, opt));
  }
}

/**
 * Sets attributes
 */
export function setRouteHandlerOptions(target: any, options: IRouteHandlerOptions): void {

  Reflect.defineMetadata(ROUTE_HANDLERS_KEY, Object.assign({}, options), target);
}

/**
 * Adds model attribute by specified property name and
 * sequelize attribute options and stores this information
 * through reflect metadata
 */
export function addRouteHandlerOption(target: any,
                                      option: IRouteHandlerOption): void {

  let options = getRouteHandlerOptions(target);

  if (!options) {
    options = {};
  }

  const key = option.method + option.path;

  if (options[key]) {
    throw new Error(`Route "${option.method.toUpperCase()} ${option.path || '/'}" already defined ` +
    `on prototype chain. (When overriding an existing route handler, the overridden handler must not ` +
    `have a @${capitalize(option.method.toLowerCase())} annotation. But instead an @OverrideRouteHandler ` +
    `annotation to ensure that the route was not overridden by accident)`);
  }

  options[key] = Object.assign({}, option);

  setRouteHandlerOptions(target, options);
}
