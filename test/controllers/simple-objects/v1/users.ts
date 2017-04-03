import {Request, Response, NextFunction} from 'express';
import users from '../abstract/users';
import {extend} from "../../../../index";

export default extend(users, {

  getUser(req: Request, res: Response, next: NextFunction): any {

    res.send('v1');
  },

  getUsers(req: Request, res: Response, next: NextFunction): any {

    res.send('v1');
  }
});
