import {Request, Response, NextFunction} from 'express';

const movies = {

  'GET /:id': (req: Request, res: Response, next: NextFunction) => {

    res.send('v1');
  },

  'PUT /:id': (req: Request, res: Response, next: NextFunction) => {

    res.send('v1');
  },

  'DELETE /:id': (req: Request, res: Response, next: NextFunction) => {

    res.send('v1');
  },

  'GET /': (req: Request, res: Response, next: NextFunction) => {

    res.send('v1');
  }
};

export default movies;
