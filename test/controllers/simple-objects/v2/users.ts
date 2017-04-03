import {Request, Response, NextFunction} from 'express';
import v1Users from '../v1/users';
import {extend} from "../../../../index";

export default extend(v1Users, {

  getUser(req: Request, res: Response, next: NextFunction): any {

    res.send('v2');
  }

});
