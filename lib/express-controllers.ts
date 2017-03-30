import {IVersioningOptions} from "./interfaces/IVersioningOptions";
import {Router} from "express";
import {createRouter} from "./services/routing";

export function middleware(options: IVersioningOptions): Router {

  return createRouter(options);
}
