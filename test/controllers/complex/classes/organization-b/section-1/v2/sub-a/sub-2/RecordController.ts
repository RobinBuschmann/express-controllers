import {Request, Response} from 'express';

export const RESULT = 'Hey, I\'m from organization-b version 2 and in version 2 only available';

export abstract class RecordController {

  postRecord(req: Request, res: Response, next: Function): any {

    res.send(RESULT);
  }

  getRecord(req: Request, res: Response, next: Function): any {

    res.send(RESULT);
  }

  putRecord(req: Request, res: Response, next: Function): any {

    res.send(RESULT);
  }
}
