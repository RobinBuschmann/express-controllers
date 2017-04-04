import {Request, Response, NextFunction} from 'express';
import AbstractPostController from '../abstract/PostController';

export default class PostController extends AbstractPostController {

  getPost(req: Request, res: Response, next: NextFunction): any {

    res.send('v2');
  }

  getPostComments(req: Request, res: Response, next: NextFunction): any {

    res.send('v2');
  }

}
