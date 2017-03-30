import {annotateRoute} from "../services/controller";

export function Post(target: any, propertyName: string): void;
export function Post(path: string): Function;
export function Post(...args: any[]): void|Function {

  return annotateRoute('post', args);
}
