import {annotateRoute} from "../services/controller";

export function Get(target: any, propertyName: string): void;
export function Get(path: string): Function;
export function Get(...args: any[]): void|Function {

  return annotateRoute('get', args);
}
