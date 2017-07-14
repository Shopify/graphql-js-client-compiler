import Module from 'module';
import {generateSchemaBundle} from 'graphql-js-schema';
import {graphql, buildSchema} from 'graphql';
import {introspectionQuery} from 'graphql/utilities';
import {profileQueries} from './profilers';

function schemaIDLToJson(schemaIDL) {
  const schema = buildSchema(schemaIDL);

  return graphql(schema, introspectionQuery);
}

export function compileSchemaJson(schemaJson, profile) {
  let schema;

  if (typeof schemaJson === 'string') {
    schema = JSON.parse(schemaJson);
  } else {
    schema = schemaJson;
  }

  return generateSchemaBundle(schema, 'Types', profile).then((bundle) => {
    return bundle.body;
  });
}

export function compileSchemaIDL(schemaIDL, profile) {
  return schemaIDLToJson(schemaIDL).then((schemaJson) => {
    return compileSchemaJson(schemaJson, profile);
  });
}

export function compileOptimizedSchemaJson(schemaJson, queries) {
  return compileSchemaJson(schemaJson).then((typesCode) => {
    const typesCjsCode = typesCode.replace('export default', 'module.exports =');
    const typesModule = new Module();

    typesModule._compile(typesCjsCode, '');

    const types = typesModule.exports;
    const profile = profileQueries(queries, types);

    return compileSchemaJson(schemaJson, profile);
  });
}

export function compileOptimizedSchemaIDL(schemaIDL, queries) {
  return schemaIDLToJson(schemaIDL).then((schemaJson) => {
    return compileOptimizedSchemaJson(schemaJson, queries);
  });
}
