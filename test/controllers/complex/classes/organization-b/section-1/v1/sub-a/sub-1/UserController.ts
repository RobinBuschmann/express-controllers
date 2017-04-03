import {Request, Response} from 'express';

export const RESULT = 'Hey, I\'m from organization-b version 1 and in a "sub-a/sub-1" path. ' +
  'But beware of the following: I\'m also available in version 2';

export class UserController {

  postUsers(req: Request, res: Response, next: Function): any {

    res.send(RESULT);
  }

  getUsers(req: Request, res: Response, next: Function): any {

    res.send(RESULT);
  }

  putUsers(req: Request, res: Response, next: Function): any {

    res.send(RESULT);
  }
}
