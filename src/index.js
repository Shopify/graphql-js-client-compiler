import * as t from 'babel-types';
import generate from 'babel-generator';
import {transformToAst} from 'graphql-to-js-client-builder';
import Client from 'graphql-js-client/dev.es';
import Module from 'module';

function baseAst(graphQlCode) {
  const clientVar = 'client';
  const documentVar = 'document';

  return t.functionDeclaration(
    t.identifier('query'),
    [t.identifier(clientVar)],
    t.blockStatement(
      transformToAst(graphQlCode, clientVar, documentVar, 'spreads').concat(
        t.returnStatement(t.identifier(documentVar))
      )
    )
  );

}

export function transformToFunction(graphQlCode) {
  const ast = baseAst(graphQlCode);

  return `${generate(t.program([ast])).code}\n`;
}

export function profileQuery(graphQlCode, types) {
  const client = new Client(types, {url: 'https://not-an-api.com'});
  const functionCode = transformToFunction(graphQlCode);
  const functionModule = new Module();

  functionModule._compile(`module.exports = ${functionCode};`, '');

  Client.resetProfiler();
  Client.startProfiling();
  functionModule.exports(client);
  Client.pauseProfiling();

  return Client.captureProfile();
}

export default function compile(graphQlCode) {
  const ast = t.exportDefaultDeclaration(baseAst(graphQlCode));

  return `${generate(t.program([ast])).code}\n`;
}
