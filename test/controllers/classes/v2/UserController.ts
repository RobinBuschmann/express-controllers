import {Request, Response, NextFunction} from 'express';
import {UserController as V1UserController} from '../v1/UserController';

export class UserController extends V1UserController {

  getUser(req: Request, res: Response, next: NextFunction): any {

    res.send('v2');
  }

}
