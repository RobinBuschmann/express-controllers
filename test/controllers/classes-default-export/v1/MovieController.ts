import {Request, Response, NextFunction} from 'express';
import {Get, Delete, Put} from "../../../../index";

export default class MovieController {

  @Get('/:id')
  getMovie(req: Request, res: Response, next: NextFunction): any {

    res.send('v1');
  }

  @Put('/:id')
  putMovie(req: Request, res: Response, next: NextFunction): any {

    res.send('v1');
  }

  @Delete('/:id')
  deleteMovie(req: Request, res: Response, next: NextFunction): any {

    res.send('v1');
  }

  @Get
  getMovies(req: Request, res: Response, next: NextFunction): any {

    res.send('v1');
  }
}
