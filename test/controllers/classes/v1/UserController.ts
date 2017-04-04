import {Request, Response, NextFunction} from 'express';
import {UserController as AbstractUserController} from '../abstract/UserController';

export class UserController extends AbstractUserController {

  getUser(req: Request, res: Response, next: NextFunction): any {

    res.send('v1');
  }

  getUsers(req: Request, res: Response, next: NextFunction): any {

    res.send('v1');
  }
}
