import {Request, Response, NextFunction} from 'express';
import posts from '../abstract/posts';
import {extend} from "../../../../index";

export default extend(posts, {

  getPost(req: Request, res: Response, next: NextFunction): any {

    res.send('v2');
  },

  getPostComments(req: Request, res: Response, next: NextFunction): any {

    res.send('v2');
  }


});
