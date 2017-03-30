import {Request, Response} from 'express';

export abstract class RecordController {

  postRecord(req: Request, res: Response, next: Function): any {

    next('not implemented');
  }

  getRecord(req: Request, res: Response, next: Function): any {

    next('not implemented');
  }

  putRecord(req: Request, res: Response, next: Function): any {

    next('not implemented');
  }
}
