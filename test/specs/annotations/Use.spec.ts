import 'reflect-metadata';
import {expect} from 'chai';
import {Use} from '../../../lib/annotations/Use';

describe('annotations.Use', () => {

  class Controller {
    @Use
    someMiddleware(req: any, res: any, next: any): any {

    }

    @Use('/test')
    someOtherMiddleware(req: any, res: any, next: any): any {

    }
  }

  const metadata = Reflect.getMetadata('er:route-handler', Controller.prototype);

  it('should store metadata', () => {
    expect(metadata).to.not.be.undefined;
    expect(metadata).to.have.property('use').that.have.property('method', 'use');
    expect(metadata).to.have.property('use').that.have.property('path', '');
    expect(metadata).to.have.property('use/test').that.have.property('method', 'use');
    expect(metadata).to.have.property('use/test').that.have.property('path', '/test');
  });

});
