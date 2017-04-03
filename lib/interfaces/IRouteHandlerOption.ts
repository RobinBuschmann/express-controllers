import {PathParams} from "express-serve-static-core";

export interface IRouteHandlerOption {

  method: string;
  path: PathParams;
  propertyKey: string;
  implementations: any[];
}
