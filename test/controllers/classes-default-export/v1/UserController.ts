import {Request, Response, NextFunction} from 'express';
import AbstractUserController from '../abstract/UserController';

export default class UserController extends AbstractUserController {

  getUser(req: Request, res: Response, next: NextFunction): any {

    res.send('v1');
  }

  getUsers(req: Request, res: Response, next: NextFunction): any {

    res.send('v1');
  }
}
