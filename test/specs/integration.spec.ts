import * as express from 'express';
import * as Promise from 'bluebird';
import {expect} from 'chai';
import * as request from 'supertest';
import {controllers} from "../../index";
import {Router} from 'express';

describe('integration', () => {

  describe('versions', () => {

    [
      {
        describe: 'classes',
        path: __dirname + '/../controllers/simple-classes',
        resolveRouteHandler: true,
        inject(model: any): any {
          return new model();
        }
      },
      {
        describe: 'classes',
        path: __dirname + '/../controllers/simple-classes',
        resolveRouteHandler: true,
        injector: {
          get(model: any): any {
            return new model();
          }
        }
      },
      {
        describe: 'objects',
        path: __dirname + '/../controllers/simple-objects',
        resolveRouteHandler: true,
        controllerPattern: /^(.*)/
      },
    ].forEach(options => {

      describe(options.describe, () => {

        const app = express();

        app.use(controllers(options));

        // prepare meta data
        const versions = ['v1', 'v2'];
        const urls: Array<[string, Array<[string, string, (string[])]>]> = [
          ['/:version/users', [['get', 'getUsers', ['abstract', 'v1', '<v2']]]],
          ['/:version/users/:id', [['get', 'getUser', ['abstract', 'v1', 'v2']], ['delete', 'deleteUser', ['abstract']]]],
          ['/:version/comments', [['get', 'getComments', ['v1', '<v2']]]],
          ['/:version/comments/:id', [['get', 'getComment', ['v1', '<v2']], ['delete', '', []]]],
          ['/:version/posts', [['get', 'getPosts', ['abstract']]]],
          ['/:version/posts/:id', [['get', 'getPost', ['abstract', 'v2']]]],
          ['/:version/posts/:id/comments', [['get', 'getPostComments', ['abstract', 'v2']]]],
          ['/:version/movies', [['get', '', ['v1', '<v2']], ['head', '', ['v2']], ['options', '', ['v2']]]],
          ['/:version/movies/:id',
            [
              ['get', '', ['v1', 'v2']],
              ['put', '', ['v1', '<v2']],
              ['patch', '', ['v2']],
              ['delete', '', ['v1', '<v2']]
            ]],
        ];

        // setup routes
        urls.forEach(([url, methods]) => {
          methods.forEach(([method, key]) => {
            if (key) {
              app[method](url, (req, res, next) => req.controller[key](req, res, next));
            }
          });
        });

        // pass condition to filter meta data
        function filter(conditioner: (version: string, availableVersions: string[], method: string) => boolean): Array<[string, string]> {

          return urls.reduce((_urls, [url, methods]) => {

            versions.forEach(v => {

              methods.forEach(([method, key, _versions]) => {

                if (conditioner(v, _versions, method)) {
                  _urls.push([method, `${url.replace(':id' as any, 1 as any).replace(':version', v)
                    }`]);
                }
              });
            });

            return _urls;
          }, []);
        }


        // filter all routes, that are not implemented
        const urls200 = filter((v, _versions) =>
          _versions.indexOf(v) !== -1 || _versions.indexOf('<' + v) !== -1
        );

        it('should return 200', () =>
          Promise.all(
            urls200
              .map(([method, url]) =>
                request(app)[method](url)
                  .expect(200)
                  .catch(err => {
                    const arr = [method, url];
                  })
              )
          )
        );

        // filter all routes, that are not implemented
        const urlsV1 = filter((v, _versions) =>
          v === 'v1' && _versions.indexOf('v1') !== -1
        );

        it('should return 200 and "v1"', () =>
          Promise.all(
            urlsV1
              .map(([method, url]) =>
                request(app)[method](url)
                  .expect(200)
                  .then(({text}) => {
                    if (method !== 'head') expect(text).to.equal('v1');
                  })
              )
          )
        );

        // filter all routes, that are not implemented
        const urlsV2 = filter((v, _versions) =>
          v === 'v2' && _versions.indexOf('v2') !== -1
        );

        it('should return 200 and "v2"', () =>
          Promise.all(
            urlsV2
              .map(([method, url]) =>
                request(app)[method](url)
                  .expect(200)
                  .then(({text}) => {
                    if (method !== 'head') expect(text).to.equal('v2');
                  })
              )
          )
        );

        // filter all routes, that are not implemented
        const urls404 = filter((v, _versions, method) =>
          _versions.indexOf(v) === -1 &&
          _versions.indexOf('<' + v) === -1 &&
          method !== 'head' &&
          method !== 'options'
        );

        it('should return 404', () =>
          Promise.all(
            urls404
              .map(([method, url]) =>
                request(app)[method](url)
                  .expect(404)
              )
          )
        );

        // filter all routes, that are not implemented and have an abstract controller
        const abstractUrls = filter((v, _versions) =>
          _versions.indexOf(v) === -1 &&
          _versions.indexOf('<' + v) === -1 &&
          _versions.indexOf('abstract') !== -1
        );

        it('should return 404 * not implemented', () =>
          Promise.all(
            abstractUrls
              .map(([method, url]) =>
                request(app)[method](url)
                  .expect(404)
                  .then(result => {
                    expect(result.text).to.match(/not implemented/);
                  })
              )
          )
        );
      });
    });
  });

  describe('controller pattern', () => {

    it('should throw due to wrong export', () => {

      expect(() => {

        controllers({
          path: __dirname + '/../controllers/controller-class-differ-filename',
          resolveRouteHandler: true
        });
      }).to.throw(/No default export or no named export/);
    });

  });

  describe('override', () => {

    it('should not throw', () => {

      expect(() => {

        controllers({
          path: __dirname + '/../controllers/override',
          resolveRouteHandler: true
        });
      }).not.to.throw();
    });

    it('should throw due misused @OverrideRouteHandler annotation', () => {

      expect(() => {

        controllers({
          path: __dirname + '/../controllers/override-nothing-to-override',
          resolveRouteHandler: true
        });
      }).to.throw(/Nothing to override/);
    });

    it('should throw due to missing @OverrideRouteHandler annotation', () => {

      expect(() => {

        controllers({
          path: __dirname + '/../controllers/override-missing-override',
          resolveRouteHandler: true
        });
      }).to.throw(/Accidentally overridden route handler/);
    });

    it('should throw due to forbidden duplicate annotation', () => {

      expect(() => {

        controllers({
          path: __dirname + '/../controllers/override-forbidden-duplicate-annotation',
          resolveRouteHandler: true
        });
      }).to.throw(/Route .* already defined on prototype chain/);
    });

  });

  describe('complex structure', () => {

    const app = express();

    app.use(controllers({
      path: __dirname + '/../controllers/complex/classes',
      resolveRouteHandler: true,
      inject(model: any): any {
        return new model();
      }
    }));
    app.use(controllers({
      path: __dirname + '/../controllers/complex/objects',
      resolveRouteHandler: true,
      controllerPattern: /^(.*)$/
    }));

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


    const urls = [
      '/organization-a/v1/users',
      '/organization-a/v1/records',
      '/organization-a/v2/users',
      '/organization-a/v2/records',
      '/organization-a/v2/special/users',
      '/organization-a/v2/special/users/1/posts',
      '/organization-a/v1/special-2/users',
      '/organization-a/v1/special-2/users/1/posts',
      '/organization-a/v2/special-2/users',
      '/organization-a/v2/special-2/users/1/posts',
      '/organization-b/section-1/v1/sub-a/sub-1/users',
      '/organization-b/section-1/v2/sub-a/sub-1/users',
      '/organization-b/section-1/v2/sub-a/sub-2/records',
      '/section-2/v1/special/users',
      '/section-2/v2/special/users',
      '/section-2/v1/special/users/1/posts',
      '/section-2/v2/special/users/1/posts',
      '/section-2/v1/users',
      '/section-2/v2/users',
      '/section-2/v2/records',
    ];

    describe('defined endpoints', () => {

      it('should return OK', () =>

        urls.reduce((promise, url) =>
          promise.then(() =>
            request(app).get(url).expect(200)), Promise.resolve<any>({}))
      );

    });
  });

});
