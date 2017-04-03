import {Request, Response, NextFunction} from 'express';

export default {

  getRecords(req: Request, res: Response, next: NextFunction): any {

    res.send('no class :)');
  }

};
