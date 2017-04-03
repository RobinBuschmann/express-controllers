import {Request, Response} from 'express';
import {RecordController as AbstractRecordController} from "../abstract/RecordController";

export const RESULT = 'Hey, I\'m an implementation from organization-a version 1. ' +
  'Despite I\'m not explicitly implemented in version 2, I\'m available in version 2 as well';

export class RecordController extends AbstractRecordController {

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
