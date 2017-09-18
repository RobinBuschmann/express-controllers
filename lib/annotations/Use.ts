import {PathParams} from 'express-serve-static-core';
import {annotateRoute} from '../services/controller';

export function Use(target: any, propertyKey: string): void;
export function Use(path: PathParams): Function;
export function Use(...args: any[]): Function | void {
  return annotateRoute('use', args);
}
