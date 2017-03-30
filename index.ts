import {middleware} from "./lib/express-controllers";

export const controllers = middleware;

export {Delete} from './lib/annotations/Delete'
export {Get} from './lib/annotations/Get'
export {Head} from './lib/annotations/Head'
export {Patch} from './lib/annotations/Patch'
export {Post} from './lib/annotations/Post'
export {Put} from './lib/annotations/Put'

export function extend(source: any, target: any): any {

  return Object.assign(Object.create(source), target);
}
