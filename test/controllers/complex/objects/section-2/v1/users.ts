import {Request, Response, NextFunction} from 'express';

export default {

  getUsers(req: Request, res: Response, next: NextFunction): any {

    res.send('no class :)');
  }
};
