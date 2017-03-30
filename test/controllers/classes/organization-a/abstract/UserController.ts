import {Request, Response} from 'express';

export abstract class UserController {

  postUsers(req: Request, res: Response, next: Function): any {

    next('not implemented');
  }

  getUsers(req: Request, res: Response, next: Function): any {

    next('not implemented');
  }

  putUsers(req: Request, res: Response, next: Function): any {

    next('not implemented');
  }
}
