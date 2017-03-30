import {annotateRoute} from "../services/controller";

export function Head(target: any, propertyName: string): void;
export function Head(path: string): Function;
export function Head(...args: any[]): void|Function {

  return annotateRoute('head', args);
}
