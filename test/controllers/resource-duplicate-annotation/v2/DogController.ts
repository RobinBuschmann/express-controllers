import {OverrideRouteHandler, Resource} from "../../../../";
import {DogController as DogV1Controller} from '../v1/DogController';

@Resource('cats')
export class DogController extends DogV1Controller {

  @OverrideRouteHandler
  get(): any {

  }
}
