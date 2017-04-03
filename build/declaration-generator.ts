import * as generator from 'ts-type-info';
import {writeFile} from 'fs';
import {methods} from "../lib/utils/http";
import {camelCase, capitalize} from "../lib/utils/string";

writeFile(__dirname + '/../lib/annotations/method-annotations.d.ts', generator.createFile({
  imports: [
    {
      moduleSpecifier: 'express-serve-static-core',
      namedImports: [{
        name: 'PathParams'
      }]
    }
  ],
  functions: methods.map(method => ({
    name: capitalize(camelCase(method)),
    overloadSignatures: [
      {
        parameters: [{
          name: 'target',
          type: 'any'
        }, {
          name: 'propertyKey',
          type: 'string'
        }]
      },
      {
        parameters: [{
          name: 'path',
          type: 'PathParams'
        }],
        returnType: 'Function'
      }
    ],
    parameters: [{
      name: 'target',
      type: 'any'
    }, {
      name: 'propertyKey',
      type: 'string'
    }],
    returnType: 'void|Function',
    isAmbient: true,
    hasDeclareKeyword: true
  }))
}).write(), () => null);
