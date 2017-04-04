import {Request, Response, NextFunction} from 'express';
import V1UserController from '../v1/UserController';

export default class UserController extends V1UserController {

  getUser(req: Request, res: Response, next: NextFunction): any {

    res.send('v2');
  }

}
