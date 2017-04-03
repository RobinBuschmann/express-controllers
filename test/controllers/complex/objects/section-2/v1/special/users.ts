import {Request, Response, NextFunction} from 'express';
import {Get} from "../../../../../../../index";

export const users: any = {};

Get(users, 'getUsers');
users.getUsers = function(req: Request, res: Response, next: NextFunction): any {

  res.send('no class :)');
};

Get('/:id/posts')(users, 'getUserPosts');
users.getUserPosts = function (req: Request, res: Response, next: Function): any {

  res.send('no class :)');
};
