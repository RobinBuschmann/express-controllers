import * as express from 'express';
import {Router} from 'express';
import {controllers} from "../index";

export const app = express();

app.use(controllers({
  path: __dirname + '/controllers/classes',
  debug: true,
  inject(model: any): any {
    return new model();
  }
}));
app.use(controllers({path: __dirname + '/controllers/objects', debug: true, controllerPattern: /^(.*)$/}));

const orgA = Router();
const orgBSec1 = Router();
const sec2 = Router();

app.use('/organization-a/:version', orgA);
app.use('/organization-b/section-1/:version', orgBSec1);
app.use('/section-2/:version', sec2);

orgA.get('/users', (req, res, next) => req.controller.getUsers(req, res, next));
orgA.get('/records', (req, res, next) => req.controller.getRecord(req, res, next));

orgBSec1.get('/sub-a/sub-1/users', (req, res, next) => req.controller.getUsers(req, res, next));
orgBSec1.get('/sub-a/sub-2/records', (req, res, next) => req.controller.getRecord(req, res, next));

sec2.get('/users', (req, res, next) => req.controller.getUsers(req, res, next));
sec2.get('/records', (req, res, next) => req.controller.getRecords(req, res, next));
