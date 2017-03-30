import * as fs from 'fs';
import {Router} from 'express';
import * as pluralize from 'pluralize';
import {IVersioningDefaultOptions} from "../interfaces/IVersioningDefaultOptions";
import {IInternalVersioningOptions} from "../interfaces/IInternalVersioningOptions";
import {IVersioningOptions} from "../interfaces/IVersioningOptions";
import {getRouteHandlerOptions} from "./controller";

const defaultOptions: IVersioningDefaultOptions = {

  controllerPattern: /^(.*?)Controller$/,
  versionPattern: /^(v\d.*)$/,
  debug: false,
  abstractDir: 'abstract'
};

export const VERSION_PLACEHOLDER = '__version__';

export function createRouter(options: IVersioningOptions): Router {

  const _options = prepareOptions(options);
  const router = Router();
  const data = resolve(_options);

  return defineRoutes(router, _options, data);
}

function resolve(options: IInternalVersioningOptions,
                 path: string = options.path,
                 controllers: any = {},
                 route: string = '',
                 routes: string[] = []): {controllers: any, routes: string[]} {

  let parentVersion;

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
        const resourceName = getResourceName(options, controllerName);

        if (resourceName) {

          const finalRoute = route + `/${resourceName}`;
          const module = require(subpath);

          controllers[resourceName] = getController(module, controllerName);

          if (routes.indexOf(finalRoute) === -1) routes.push(finalRoute);
        }
      }
    });

  return {
    controllers,
    routes
  };
}

function defineRoutes(router: Router,
                      options: IInternalVersioningOptions, {routes, controllers}: {routes: string[], controllers: any}): Router {

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

                let controller;
                const path = route.replace(VERSION_PLACEHOLDER, version);

                // tslint:disable:no-console
                if (options.debug) console.info(path);

                let routeOptions;

                if (typeof currentInnerNode === 'function') {

                  routeOptions = getRouteHandlerOptions(currentInnerNode.prototype);

                  if (typeof options.inject === 'function') {

                    controller = options.inject(currentInnerNode);
                  } else if (typeof options.injector === 'object') {

                    controller = options.injector.get(currentInnerNode);
                  } else {

                    controller = new currentInnerNode();
                  }
                } else {

                  controller = currentInnerNode;
                }

                if (routeOptions) {

                  const rootPath = path;

                  routeOptions.forEach(({method, path, propertyKey}) => {

                    router[method](rootPath + path, (req, res, next) =>
                      controller[propertyKey](req, res, next)
                    );
                  });
                } else {

                  router.use(path, (req: any, res, next) => {

                    req.controller = controller;
                    next();
                  });
                }
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
export function removeExtension(filename: string): string {

  return filename.replace('.js', '');
}

/**
 * Checks if current file is js file by checking filename
 *
 * @param filename
 * @returns {boolean}
 */
export function isJsFile(filename: string): boolean {

  return filename.slice(-3) === '.js';
}

export function getResourceName(options: IInternalVersioningOptions,
                                controllerName: string): string|undefined {

  const match = options.controllerPattern.exec(controllerName);

  if (match && match.length) {
    return pluralize(match[1].toLowerCase());
  }

  return void 0;
}

export function getController(module: any,
                              controllerName: string): any {

  const controller = module[controllerName] || module.default;

  if (!controller) {

    throw new Error(`No default export or "${controllerName}" names export for route "${controllerName}" ` +
      `in module { ${Object.keys(module).join()} } found`);
  }

  return controller;
}

export function prepareOptions(options: IVersioningOptions): IInternalVersioningOptions {

  for (let key in defaultOptions) {
    if (defaultOptions.hasOwnProperty(key) && !(key in options)) {

      options[key] = defaultOptions[key];
    }
  }

  return options as IInternalVersioningOptions;
}

