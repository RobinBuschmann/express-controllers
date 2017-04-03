import {addImplementationToRouteHandler} from "../services/controller";

export function OverrideRouteHandler(target: any, propertyName: string): void {

  addImplementationToRouteHandler(target, propertyName);
}
