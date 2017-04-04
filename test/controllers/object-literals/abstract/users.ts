import {Request, Response, NextFunction} from 'express';

export default {

  getUser(req: Request, res: Response, next: NextFunction): any {

    res.status(404).send('"getUser" not implemented');
  },

  getUsers(req: Request, res: Response, next: NextFunction): any {

    res.status(404).send('"getUsers" not implemented');
  },

  deleteUser(req: Request, res: Response, next: NextFunction): any {

    res.status(404).send('"deleteUser" not implemented');
  }
};
