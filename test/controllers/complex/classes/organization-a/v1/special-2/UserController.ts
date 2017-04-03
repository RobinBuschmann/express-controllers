import {Request, Response} from 'express';
import {Get} from "../../../../../../../index";

export const RESULT = 'Hey, I\'m from organization version 2 and I\'m special as hell';

export class UserController {

  @Get
  getUsers(req: Request, res: Response, next: Function): any {

    res.send(RESULT);
  }

  @Get('/:id/posts')
  getUserPosts(req: Request, res: Response, next: Function): any {

    res.send(RESULT);
  }
}
