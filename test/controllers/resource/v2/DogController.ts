import {OverrideRouteHandler} from "../../../../";
import {DogController as DogV1Controller} from '../v1/DogController';

export class DogController extends DogV1Controller {

  @OverrideRouteHandler
  get(): any {

  }
}
