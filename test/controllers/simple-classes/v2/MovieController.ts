import {Request, Response, NextFunction} from 'express';
import {OverrideRouteHandler, Patch, Head, Options} from "../../../../index";
import {MovieController as V1MovieController} from '../v1/MovieController';

export class MovieController extends V1MovieController {

  @OverrideRouteHandler
  getMovie(req: Request, res: Response, next: NextFunction): any {

    res.send('v2');
  }

  @Patch('/:id')
  patchMovie(req: Request, res: Response, next: NextFunction): any {

    res.send('v2');
  }

  @Head
  headMovies(req: Request, res: Response, next: NextFunction): any {

    res.send('v2');
  }

  @Options
  optionsMovies(req: Request, res: Response, next: NextFunction): any {

    res.send('v2');
  }
}
