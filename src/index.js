import * as t from 'babel-types';
import generate from 'babel-generator';
import {transformToAst} from 'graphql-to-js-client-builder';
import Client from 'graphql-js-client/dev.es';
import Module from 'module';
import {generateSchemaBundle} from 'graphql-js-schema';
import {graphql, buildSchema} from 'graphql';
import {introspectionQuery} from 'graphql/utilities';

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

export function profileQuery(query, types) {
  return profileQueries([query], types);
}

export function profileQueries(queries, types) {
  const client = new Client(types, {url: 'https://not-an-api.com'});

  const functions = queries.map((query) => {
    const code = transformToFunction(query);
    const virtualModule = new Module();

    virtualModule._compile(`module.exports = ${code}`, '');

    return virtualModule.exports;
  });

  Client.resetProfiler();
  Client.startProfiling();

  functions.forEach((func) => {
    console.log(func);
    func(client);
  });

  Client.pauseProfiling();

  return Client.captureProfile();
}

export function compileSchemaJson(schemaJson) {
  let schema;

  if (typeof schemaJson === 'string') {
    schema = JSON.parse(schemaJson);
  } else {
    schema = schemaJson;
  }

  return generateSchemaBundle(schema, 'Types').then((bundle) => {
    return bundle.body;
  });
}

export function compileSchemaIDL(schemaIDL) {
  const schema = buildSchema(schemaIDL);

  return graphql(schema, introspectionQuery).then((schemaJson) => {
    return compileSchemaJson(schemaJson);
  });
}

export function compileQuery(graphQlCode) {
  const ast = t.exportDefaultDeclaration(baseAst(graphQlCode));

  return `${generate(t.program([ast])).code}\n`;
}
