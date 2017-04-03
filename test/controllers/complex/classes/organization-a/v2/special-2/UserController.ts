import {Request, Response} from 'express';
import {UserController as ParentUserController} from '../../v1/special-2/UserController';
import {OverrideRouteHandler} from "../../../../../../../index";

export const RESULT = 'Hey, I\'m from organization version 2 and I\'m special as hell';

export class UserController extends ParentUserController {

  @OverrideRouteHandler
  getUserPosts(req: Request, res: Response, next: Function): any {

    res.send(RESULT);
  }
}
