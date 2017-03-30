/// <reference types="express" />
import { IVersioningOptions } from "./interfaces/IVersioningOptions";
import { Router } from "express";
export declare function middleware(options: IVersioningOptions): Router;
