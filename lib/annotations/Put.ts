import {annotateRoute} from "../services/controller";

export function Put(target: any, propertyName: string): void;
export function Put(path: string): Function;
export function Put(...args: any[]): void|Function {

  return annotateRoute('put', args);
}
