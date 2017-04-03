import {Request, Response, NextFunction} from 'express';
import v1Movies from '../v1/movies';
import {extend} from "../../../../lib/express-controllers";

const movies = extend(v1Movies, {

  'GET /:id': (req: Request, res: Response, next: NextFunction) => {

    res.send('v2');
  },

  'PATCH /:id': (req: Request, res: Response, next: NextFunction) => {

    res.send('v2');
  },

  'HEAD /': (req: Request, res: Response, next: NextFunction) => {

    res.send('v2');
  },

  'OPTIONS /': (req: Request, res: Response, next: NextFunction) => {

    res.send('v2');
  },

  someKey: 1
});

export default movies;
