import {Request, Response} from 'express';
import {UserController as ParentUserController} from "../v1/UserController";

export const RESULT = 'Hey, I\'m from organiuation-a version 2';

export class UserController extends ParentUserController {

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
