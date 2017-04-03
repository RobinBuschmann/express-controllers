import {Request, Response, NextFunction} from 'express';

export default {

  getComment(req: Request, res: Response, next: NextFunction): any {

    res.send('v1');
  },

  getComments(req: Request, res: Response, next: NextFunction): any {

    res.send('v1');
  }
};
