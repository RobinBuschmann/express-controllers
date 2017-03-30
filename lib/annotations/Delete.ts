import {annotateRoute} from "../services/controller";

export function Delete(target: any, propertyName: string): void;
export function Delete(path: string): Function;
export function Delete(...args: any[]): void|Function {

  return annotateRoute('delete', args);
}
