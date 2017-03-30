import {annotateRoute} from "../services/controller";

export function Patch(target: any, propertyName: string): void;
export function Patch(path: string): Function;
export function Patch(...args: any[]): void|Function {

  return annotateRoute('patch', args);
}
