import * as t from 'babel-types';
import generate from 'babel-generator';
import {transformToAst} from 'graphql-to-js-client-builder';

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

export function compileToFunction(graphQlCode) {
  const ast = baseAst(graphQlCode);

  return `${generate(t.program([ast])).code}\n`;
}

export function compileToModule(graphQlCode) {
  const ast = t.exportDefaultDeclaration(baseAst(graphQlCode));

  return `${generate(t.program([ast])).code}\n`;
}
