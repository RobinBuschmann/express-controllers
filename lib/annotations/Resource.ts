import {processResource} from "../services/controller";

export function Resource(resourceName: string): Function {

  return (target: any) => processResource(target.prototype, resourceName);
}
