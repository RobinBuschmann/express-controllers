[![Build Status](https://travis-ci.org/RobinBuschmann/sequelize-typescript.png?branch=master)](https://travis-ci.org/RobinBuschmann/sequelize-typescript)
[![codecov](https://codecov.io/gh/RobinBuschmann/sequelize-typescript/branch/master/graph/badge.svg)](https://codecov.io/gh/RobinBuschmann/sequelize-typescript)
[![NPM](https://img.shields.io/npm/v/sequelize-typescript.svg)](https://www.npmjs.com/package/sequelize-typescript)
[![Dependency Status](https://img.shields.io/david/RobinBuschmann/sequelize-typescript.svg)](https://www.npmjs.com/package/sequelize-typescript)

# express-controllers
Express middleware for resolving controllers from path with api versioning support.

### Installation
```
npm install ??? --save
```

## API versioning problems 
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
Route `/v2/users/:id` has to be defined again, despite of nothing has changed in version 2. But to make this endpoint
also available in version 2, we had to do so.

**Since DRY is not satisfied, all these issues will probably result in bugs**

## Solution
`???` solves the previously discussed problems for you. So that you don't need to repeat yourself:

## Getting Started
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
`users.js` => `/users`. If you want to use any prefix or suffix for your file names see *controllerPattern* **TODO**

2. **Setup controllers**
    1. **Object literal approach**
    ```typescript
    // v1/users.js
     
    const users = {
        
     getUser(req, res, next) {
    
        /* ... */
      },
    
      getUsers(req, res, next) {
    
        /* ... */
      }
    }
     
    export default users;
    
    // v2/users.js
    import v1User from '../v1/users.js'
    
    const users = Object.create(v1User); // link usersV2 to usersV1 via prototype chain
    
    users.getUser = function (req, res, next) {
    
      /* ... */
    }
    
    export default users;
    
    ```
    To make functionality of previous versions available in a newly created version, the newly created version has to
    be linked to the previous version. This is achieved with `Object.create(v1User)`. 
    **If you don't want to make previous functionality available, don't link the controllers**
    
    2. **Class approach**
     ```typescript
     // v1/users.js
      
     export default class UserController {
  
       getUser(req, res, next) {
      
          /* ... */
        }
      
        getUsers(req, res, next) {
      
          /* ... */
        }
     }
     
     // v2/users.js
     import V1UserController from '../v1/users.js'
     
     export class UserController extends V1UserController {
   
       getUser(req, res, next) {
      
          /* ... */
        }
      
        getUsers(req, res, next) {
      
          /* ... */
        }
     }
     
     ```
    To make functionality of previous versions available in a newly created version, the newly created version has to
    extend the controller of the previous version.
    **If you don't want to make previous functionality available, don't extend the controllers of the previous version**
    
**If you prefer using named exports, make sure, that the filename and the name of the exported controller are the same**

3. **Setup middleware and routes**
```typescript
import {controllers} from '???';

app.use(controllers({
  path: __dirname + '/controllers'
}));

app.get('/:version/users', (req, res, next) => req.controller.getUsers(req, res, next));
app.get('/:version/users/:id', (req, res, next) => req.controller.getUser(req, res, next));
/* ... */
```

## Defining routes directly in controllers when using TypeScript
With TypeScript you're able to define the routes of its corresponding route handlers directly in the controller class
of these handlers.

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