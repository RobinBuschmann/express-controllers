import {IRouteHandlerOption} from "../interfaces/IRouteHandlerOption";
import {IRouteHandlerOptions} from "../interfaces/IRouteHandlerOptions";
import {capitalize} from "../utils/string";
import {methods} from "../utils/http";

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

export function addImplementationToRouteHandler(target: any, propertyKey: string): void|Function {

  const option = getRouteHandlerOption(target, propertyKey);

  if (!option) {
    throw new Error(`Nothing to override: "${propertyKey}" does not exist on prototype chain`);
  }

  option.implementations.push(target);

}

/**
 * Returns route handlers from specified class prototype by restoring this
 * information from reflect metadata
 */
export function getRouteHandlerOptions(target: any): IRouteHandlerOptions|undefined {

  const options = Reflect.getMetadata(ROUTE_HANDLERS_KEY, target) as IRouteHandlerOptions|undefined;

  if (options) {
    return Object.keys(options).reduce((copy: any, key) => {
      copy[key] = Object.assign({}, options[key]);
      return copy;
    }, {});
  }
}

/**
 * Tries to guess route handler options by target property keys.
 * If target has a property key "GET /:id", which refers to a function,
 * a route handler option can be generated from this
 */
export function tryGuessingRouteHandlerOptionsByKeys(target: any): IRouteHandlerOptions|undefined {

  const ROUTE_REGEX = new RegExp('^(' + methods.join('|') + '?) (.*)$', 'i');
  let routeHandlerOptions: IRouteHandlerOptions|undefined;

  // tslint:disable:forin
  for (const key in target) {

    if (typeof target[key] !== 'function') continue;

    const match = ROUTE_REGEX.exec(key);

    if (match && match.length > 1) {

      const method = match[1].toLowerCase();
      const path = match[2].replace(/^\/$/, '').toLowerCase();

      if (!routeHandlerOptions) routeHandlerOptions = {};

      routeHandlerOptions[key] = {
        method,
        path,
        propertyKey: key,
        implementations: [target]
      };
    }
  }

  return routeHandlerOptions;
}

/**
 * Sets route handler options by storing this information via reflect metadata
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

  const key = option.method + option.path.toString();
  const existingOption = options[key];

  if (existingOption) {
    throw new Error(`Route "${option.method.toUpperCase()} ${option.path || '/'}" already defined ` +
      `on prototype chain (${existingOption.propertyKey}). (When overriding an existing route handler, the overridden ` +
      `handler must not have a @${capitalize(option.method.toLowerCase())} annotation. But instead an ` +
      `@OverrideRouteHandler annotation to ensure that the route was not overridden by accident)`);
  }

  options[key] = Object.assign({}, option);

  setRouteHandlerOptions(target, options);
}

function getRouteHandlerOption(target: any, propertyKey: string): IRouteHandlerOption|undefined {

  const options = getRouteHandlerOptions(target);

  if (options) {

    return Object.keys(options)
      .map(key => options[key])
      .find(option => option.propertyKey === propertyKey);
  }
}
