import {OverrideRouteHandler} from "../../../../index";
import {TController as V1TController} from '../v1/TController';

export class TController extends V1TController {

  @OverrideRouteHandler
  getT(): any {

  }

}
