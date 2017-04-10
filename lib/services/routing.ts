import * as fs from 'fs';
import {Router, Request, Response, NextFunction} from 'express';
import * as pluralize from 'pluralize';
import {IInternalControllerOptions} from "../interfaces/IInternalControllerOptions";
import {
  getRouteHandlerOptions,
  tryGuessingRouteHandlerOptionsByKeys,
  getResourceName as getResourceNameMeta
} from "./controller";
import {IRouteHandlerOption} from "../interfaces/IRouteHandlerOption";
import {IRouteHandlerOptions} from "../interfaces/IRouteHandlerOptions";

export const VERSION_PLACEHOLDER = '__version__';

export function createRouter(options: IInternalControllerOptions): Router {

  const router = Router();
  const data = resolve(options);

  return defineRoutes(router, options, data);
}

/**
 * Resolves routes including resources and its controller objects
 */
function resolve(options: IInternalControllerOptions,
                 path: string = options.path,
                 controllers: any = {},
                 route: string = '',
                 routes: string[] = []): {controllers: any, routes: string[]} {

  let parentVersion: any;

  fs.readdirSync(path)
    .sort() // ensure that in case of version folders the order is considered
    .forEach(name => {

      const subpath = path + '/' + name;
      let _route = route;

      if (fs.statSync(subpath).isDirectory()) {

        let obj = {};

        if (options.versionPattern.test(name) || name === options.abstractDir) {

          if (parentVersion) {

            // link current version to parent version
            // via prototype chain
            // e.g. v2 -> v1

            obj = Object.create(parentVersion);
          }

          parentVersion = obj;
          _route = route + `/${VERSION_PLACEHOLDER}`;
        } else {

          if (name in controllers) {
            // if key already exists in a parent object
            // link the current node to the existing one
            // e.g. v2.foo      -> v1.foo
            //      v2.foo.bar  -> v1.foo.bar

            obj = Object.create(controllers[name]);
          }

          _route = route + `/${name}`;
        }

        controllers[name] = obj;
        resolve(options, subpath, obj, _route, routes);

      } else if (isJsFile(name)) {

        const controllerName = removeExtension(name);
        const module = require(subpath);
        const controller = getController(module, controllerName);
        const resourceName = getResourceName(options, controllerName, controller);

        if (resourceName) {

          const finalRoute = route + `/${resourceName}`;

          controllers[resourceName] = controller;

          if (routes.indexOf(finalRoute) === -1) routes.push(finalRoute);
        }
      }
    });

  return {
    controllers,
    routes
  };
}

/**
 * Defines express routes
 */
function defineRoutes(router: Router,
                      options: IInternalControllerOptions, {routes, controllers}: {routes: string[], controllers: any}): Router {

  routes.forEach(route => {

    const nodeNames = route.split('/');
    const node = controllers;

    if (route.charAt(0) === '/') {
      nodeNames.shift();
    }

    let currentNode = node;

    nodeNames.reduce((leftNames, name) => {

      // leftNames represent node names after current node name:
      // so if "bar" is the current of ['foo', 'bar', 'baz', 'boo'],
      // the leftNames are ['baz', 'boo']
      leftNames.shift();

      if (name === VERSION_PLACEHOLDER) {

        // fetch all available versions in the current
        // node and process with left node names
        Object
          .keys(currentNode)
          .filter(key => options.versionPattern.test(key))
          .forEach(version => {

            let currentInnerNode = currentNode[version];

            leftNames.forEach((leftName, index) => {

              if (!currentInnerNode) return;

              currentInnerNode = currentInnerNode[leftName];

              // because last name should always be the name of the resource,
              // we can finally resolve the route with a controller instance
              if (index === leftNames.length - 1 && currentInnerNode) {

                processController(currentInnerNode, router, version, route, options);
              }
            });
          });
      } else if (currentNode) {

        currentNode = currentNode[name];
      }

      return leftNames;
    }, (<string[]> []).concat(nodeNames));

  });

  return router;
}

/**
 * Removes extension from string and returns new string
 *
 * @param filename
 * @returns {string}
 */
function removeExtension(filename: string): string {

  return filename.replace('.js', '');
}

/**
 * Checks if current file is js file by checking filename
 *
 * @param filename
 * @returns {boolean}
 */
function isJsFile(filename: string): boolean {

  return filename.slice(-3) === '.js';
}

function getResourceName(options: IInternalControllerOptions,
                         controllerName: string,
                         controller: any): string|undefined {

  // Try to retrieve resource name from meta data if resolveRouteHandler is true
  if (options.resolveRouteHandler && controller) {
    const prototype = controller.prototype || controller;
    const resourceName = getResourceNameMeta(prototype);

    if (resourceName) {
      return resourceName;
    }
  }

  // Try to retrieve resource name from file name
  const match = options.controllerPattern.exec(controllerName);

  if (match && match.length) {
    return pluralize(match[1].toLowerCase());
  }

  return void 0;
}

function getController(module: any,
                       controllerName: string): any {

  const controller = module[controllerName] || module.default;

  if (!controller) {

    throw new Error(`No default export or no named export for file "${controllerName}" found ` +
      ` in module { ${Object.keys(module).join()} }`);
  }

  return controller;
}

function processController(controller: any,
                           router: Router,
                           version: string,
                           route: string,
                           options: IInternalControllerOptions): void {

  let controllerInstance: any;
  const fullPath = route.replace(VERSION_PLACEHOLDER, version);

  // tslint:disable:no-console
  /* istanbul ignore next */
  if (options.debug) console.info(fullPath);

  const controllerPrototype = controller.prototype || controller;

  if (typeof controller === 'function') {

    if (typeof options.inject === 'function') {

      controllerInstance = options.inject(controller);
    } else if (typeof options.injector === 'object') {

      controllerInstance = options.injector.get(controller);
    } else {

      controllerInstance = new controller();
    }
  } else {

    controllerInstance = controller;
  }

  // Middleware for setting controller to req
  router.use(fullPath, (req: any, res, next) => {

    req.controller = controllerInstance;
    next();
  });

  // If resolve route handler is true, we're trying to resolve
  // route handlers by reflect meta data or trying to guess
  // it by target property keys
  if (options.resolveRouteHandler) {
    let routeOptions: IRouteHandlerOptions|undefined = getRouteHandlerOptions(controllerPrototype);

    if (!routeOptions) {
      routeOptions = tryGuessingRouteHandlerOptionsByKeys(controllerPrototype);
    }

    if (routeOptions) {

      const _routeOptions: IRouteHandlerOptions = routeOptions;
      const rootPath = fullPath;

      Object
        .keys(_routeOptions)
        .map<IRouteHandlerOption>(key => _routeOptions[key])
        .sort((a, b) => {
          if (a.method === b.method) {
            return 0;
          } else if (a.method === 'head') {
            return -1;
          }
          return 1;
        })
        .forEach(({method, path, propertyKey, implementations}) => {

          if (implementations.indexOf(controllerPrototype) === -1 &&
            controllerPrototype.hasOwnProperty(propertyKey)) {

            throw new Error(`Accidentally overridden route handler "${propertyKey}". When overriding a ` +
              `route handler, the @OverrideRouteHandler annotation must be used. Annotate "${propertyKey}" ` +
              `with @OverrideRouteHandler or change method name.`);
          }

          (router as any)[method](rootPath + path, (req: Request, res: Response, next: NextFunction) =>
            controllerInstance[propertyKey](req, res, next)
          );
        });
    }
  }
}
