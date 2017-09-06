import {Request, Response, NextFunction} from 'express';
import {users as usersV1} from '../../v1/special/users';
import {OverrideRouteHandler} from "../../../../../../../index";

export const users: any = Object.create(usersV1);

OverrideRouteHandler(users, 'getUserPosts');
users.getUserPosts = function (req: Request, res: Response, next: NextFunction): any {

  res.send('no class :)');
};
