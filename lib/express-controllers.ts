import {Router} from "express";
import {IControllerOptions} from "./interfaces/IControllerOptions";
import {IControllerDefaultOptions} from "./interfaces/IControllerDefaultOptions";
import {IInternalControllerOptions} from "./interfaces/IInternalControllerOptions";
import {createRouter} from "./services/routing";

const defaultOptions: IControllerDefaultOptions = {

  controllerPattern: /^(.*?)Controller$/,
  versionPattern: /^(v\d.*)$/,
  resolveRouteHandler: false,
  debug: false,
  abstractDir: 'abstract'
};

export function controllers(options: IControllerOptions): Router {

  const _options = prepareOptions(options);

  if (_options.resolveRouteHandler) {
    require('reflect-metadata');
  }

  return createRouter(_options);
}

export function extend(prototype: any, _with: any): any {

  return Object.assign(Object.create(prototype), _with);
}

function prepareOptions(options: IControllerOptions): IInternalControllerOptions {

  return Object.assign({}, defaultOptions, options) as IInternalControllerOptions;
}
