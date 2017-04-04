import {Request, Response, NextFunction} from 'express';

export default class PostController {

  getPost(req: Request, res: Response, next: NextFunction): any {

    res.status(404).send('"getPost" not implemented');
  }

  getPosts(req: Request, res: Response, next: NextFunction): any {

    res.status(404).send('"getPosts" not implemented');
  }

  getPostComments(req: Request, res: Response, next: NextFunction): any {

    res.status(404).send('"getPosts" not implemented');
  }
}
