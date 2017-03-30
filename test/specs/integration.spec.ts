import * as Promise from 'bluebird';
import {expect} from 'chai';
import * as request from 'supertest-as-promised';
import {app} from "../app";

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
  '/section-2/v1/users',
  '/section-2/v2/users',
  '/section-2/v2/records',
];

describe('integration', () => {

  describe('defined endpoints', () => {

    it('should return OK', () =>

      urls.reduce((promise, url) =>
        promise.then(() =>
          request(app).get(url).expect(200)), Promise.resolve<any>({}))
    );

  });

});
