import {Request, Response} from 'express';
import {UserController as AbstractUserController} from "../abstract/UserController";

export const RESULT = 'Hey, I\'m from organization-a version 1';

export class UserController extends AbstractUserController {

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
