[![Build Status](https://travis-ci.org/RobinBuschmann/express-controllers.png?branch=master)](https://travis-ci.org/RobinBuschmann/express-controllers)
[![codecov](https://codecov.io/gh/RobinBuschmann/express-controllers/branch/master/graph/badge.svg)](https://codecov.io/gh/RobinBuschmann/express-controllers)
[![NPM](https://img.shields.io/npm/v/???.svg)](https://www.npmjs.com/package/???)
[![Dependency Status](https://img.shields.io/david/RobinBuschmann/???.svg)](https://www.npmjs.com/package/???)

# express-controllers
Express middleware for resolving controllers from path with api versioning support.

 - [REST API versioning problems](#rest-api-versioning-problems)
 - [Solution](#solution)
 - [Getting started](#getting-started)
 - [Abstract controllers](#abstract-controllers)
 - [Complex file structures](#complex-file-structures)
 - [Defining routes directly in controllers with TypeScript](#defining-routes-directly-in-controllers-with-typescript)
 - [API](#api)

### Installation
```
npm install ??? --save
```

## REST API versioning problems
When creating a REST api with version support, there will be some problems you will face:

The definition of the same routes for all versions again and again and again ... and the need to care about which 
controller should be used for which version:
```typescript
app.get('/v1/users', (req, res, next) => usersController.getUsers(req, res, next));
app.get('/v2/users', (req, res, next) => usersController1.getUsers(req, res, next));
app.get('/v3/users', (req, res, next) => usersController2.getUsers(req, res, next));
/* ... */
```

The definition of routes of previous versions for next versions.
When creating a next version, not all routes should be created again for a new version. Especially when not all 
routes have changed compared to the previous version:
```typescript
// version 1
app.get('/v1/users', (req, res, next) => usersController.getUsers(req, res, next));
app.get('/v1/users/:id', (req, res, next) => usersController.getUser(req, res, next));
app.post('/v1/users', (req, res, next) => usersController.postUser(req, res, next));

// version 2
app.get('/v2/users', (req, res, next) => usersController2.getUsers(req, res, next));

// no changes here (see "userController" instead of "userController2")
app.get('/v2/users/:id', (req, res, next) => usersController.getUser(req, res, next));

app.post('/v2/users', (req, res, next) => usersController2.postUser(req, res, next));
```
Route `/v2/users/:id` has to be defined again, despite of nothing has changed in version 2 in `getUser` implementation. 
But to make this endpoint also available in version 2, we had to do so.

**Since DRY is not satisfied, all these issues will probably result in bugs**

## Solution
`???` solves the previously discussed problems for you. So that you don't need to repeat yourself:

### Getting Started
1. **Create file structure for controllers**
```
 - controllers/
    - v1/
        - users.js
        - posts.js
        - comments.js
    - v2/
        - users.js
        ...
```
The name of files should have the same name as the resource, which will appear in the path of the route. So that
`users.js` => `/users`. If you want to use any prefix or suffix for your file names see [controllerPattern](#api)

2. **Setup controllers**
    1. **Object literal approach**
    ```typescript
    // v1/users.js
     
    const users = {
        
       getUser(req, res, next) { /* ... */ },
    
       getUsers(req, res, next) { /* ... */ }
    };
     
    export default users;
    
    // v2/users.js
    import v1User from '../v1/users.js'
    
    const users = Object.create(v1User); // link usersV2 to usersV1 via prototype chain
    // override
    users.getUser = function (req, res, next) { /* ... */ };
    
    export default users;
    
    ```
    To make functionality of previous versions available in a newly created version, the newly created version has to
    be linked to the previous version. This is achieved with `Object.create(v1User)`. 
    If you don't want to make previous functionality available, don't link the controllers
    
    2. **Class approach**
     ```typescript
     // v1/users.js
      
     export default class UserController {
  
       getUser(req, res, next) { /* ... */ }
      
       getUsers(req, res, next) { /* ... */ }
     }
     
     // v2/users.js
     import V1UserController from '../v1/users.js'
     
     export class UserController extends V1UserController {
   
       // override
       getUser(req, res, next) { /* ... */ }
    
     }
     
     ```
    To make functionality of previous versions available in a newly created version, the newly created version has to
    extend the controller of the previous version.
    If you don't want to make previous functionality available, don't extend the controllers of the previous version
    
    If you're using **dependency injection**, you can set a getter function or an injector (see [here](#api))
    
**If you prefer using named exports, make sure, that the filename and the name of the exported controller are the same**

3. **Setup middleware and routes**
```typescript
import {controllers} from '???';

app.use(controllers({
  path: __dirname + '/controllers'
}));

app.get('/:version/users', (req, res, next) => req.controller.getUsers(req, res, next));
app.get('/:version/users/:id', (req, res, next) => req.controller.getUser(req, res, next));
```

## Abstract controllers
If you want to define abstract controllers for you routes, you can do so by creating an abstract folder on the
same level as the version folders:
```
 - controllers/
    - abstract/
        - users.js
        - posts.js
        - comments.js
    - v1/
        - users.js
        - posts.js
        - comments.js
    - v2/
        - users.js
        ...
```
The name of the abstract folder can be changed (see [here](#api)). 

## Complex file structures
If your controllers are structured much more complex like:
```
 - controllers/
    - organization-a/
        - v1/
          - users.js
        - v2/
          - users.js
    - organization-b/
        - v1/
          - users.js
          - sub-organization/
            - documents.js
        ...
```
`???` can also handle this for you and will resolve the controllers of the example to the following routes:
```
organization-a/:version/users
organization-b/:version/users
organization-b/:version/sub-organiuation/documents
```

## Defining routes directly in controllers with TypeScript
With TypeScript you're able to define the routes of its corresponding route handlers directly in the controller class
of these handlers. Therefore annotations come into play.

### Configuration
To use this feature, you need to install `reflect-metadata` and need to set some flags in your `tsconfig.json`:

#### `reflect-metadata`
```
npm install ??? --save
```

#### `tsconfig.json`
```json
"experimentalDecorators": true,
"emitDecoratorMetadata": true
```

### Usage
To define get routes, annotate the appropriate route handlers with a `@Get` annotation. The same works for all http
methods, that are supported by express. Please notice, that you should not use the resource name in the path, since
it is already set due to the filename.
```typescript
// /v1/UserController.js
import {Request, Response, NextFunction} from 'express';
import {Get, Post, Put} from '???';

export class UserController {

  @Get('/:id')
  getUser(req: Request, res: Response, next: NextFunction) { /* ... */ }

  @Get
  getUsers(req: Request, res: Response, next: NextFunction) { /* ... */ }

  @Get('/:id/posts')
  getUserPosts(req: Request, res: Response, next: NextFunction) { /* ... */ }

  @Post
  postUser(req: Request, res: Response, next: NextFunction) { /* ... */ }

  @Put('/:id')
  putUser(req: Request, res: Response, next: NextFunction) { /* ... */ }
}
```
#### Configure middleware
`resolveRouteHandler` need to be set to `true`.
```typescript
import {controllers} from '???';

app.use(controllers({
  path: __dirname + '/controllers',
  resolveRouteHandler: true,
  controllerPattern: /(.*?)Controller/
}));
```

#### Overriding
When overriding route handlers of previous versions, you must not define the route for its handler again. But must
instead use the `@OverrideRouteHandler` annotation. Otherwise `???` throws an error.
This will ensures, that route handlers will not be overridden by accident. Furthermore, it makes clear, that the
`@OverrideRouteHandler` annotated function *is* a route handler.

```typescript
// /v2/UserController.js
import {OverrideRouteHandler} from '???';
import {UserController as V1UserController} from '../v1/UserController';

export class UserController extends V1UserController {

  @OverrideRouteHandler
  getUser(req: Request, res: Response, next: NextFunction) { /* ... */ }
}
```

## API

### `controllers` options
 
```typescript
/**
 * Path to controllers
 */
path: string;

/**
 * Regex pattern to recognize a version folder
 * @default /^(v\d.*)$/
 */
versionPattern?: RegExp;

/**
 * Regex pattern to recognize controller files
 * @default /^(.*?)$/
 */
controllerPattern?: RegExp;

/**
 * Name of directory in which abstract controllers can be
 * found
 * @default abstract
 */
abstractDir?: string;

/**
 * Prints some info to console if true. Default is false
 * @default false
 */
debug?: boolean;

/**
 * Indicates if routes handlers should be resolved from
 * controllers automatically or not
 * @default false
 */
resolveRouteHandler?: boolean;

/**
 * Injector to inject controller class instance
 */
injector?: {get<T>(model: any): T};

/**
 * Inject function to inject a controller class instance
 */
inject?<T>(model: any): T;
```

### Annotations

```typescript

/**
 * Stores http method and path as metadata for target prototype
 */

@Get
@Get(path: PathParams)

@Put
@Put(path: PathParams)

@Post
@Post(path: PathParams)

// ... works for all http methods, that are supported by express

```