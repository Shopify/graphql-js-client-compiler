import * as t from 'babel-types';
import generate from 'babel-generator';
import {transformToAst} from 'graphql-to-js-client-builder';

export default function compile(graphQlCode) {
  const clientVar = 'client';
  const documentVar = 'document';

  const ast = t.exportDefaultDeclaration(
    t.functionDeclaration(
      t.identifier('query'),
      [t.identifier(clientVar)],
      t.blockStatement(
        transformToAst(graphQlCode, clientVar, documentVar, 'spreads').concat(
          t.returnStatement(t.identifier(documentVar))
        )
      )
    )
  );

  return `${generate(t.program([ast])).code}\n`;
}
