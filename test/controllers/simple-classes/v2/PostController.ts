import {Request, Response, NextFunction} from 'express';
import {PostController as AbstractPostController} from '../abstract/PostController';

export class PostController extends AbstractPostController {

  getPost(req: Request, res: Response, next: NextFunction): any {

    res.send('v2');
  }

  getPostComments(req: Request, res: Response, next: NextFunction): any {

    res.send('v2');
  }

}
