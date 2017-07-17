import assert from 'assert';
import {
  compileToFunction,
  profileQuery,
  profileQueries,
  compileToModule,
  compileSchemaJson,
  compileSchemaIDL,
  compileOptimizedSchemaJson,
  compileOptimizedSchemaIDL
} from '../src/index';
import getFixture from './get-fixture';
import types from './fixtures/types';

suite('compile-test', () => {
  test('it can transform a graphql query into an ES module', () => {
    const graphql = getFixture('query.graphql');
    const esModule = getFixture('query.js');

    const code = compileToModule(graphql);

    assert.equal(code, esModule);
  });

  test('it can transform a graphql query into a bare function', () => {
    const graphql = getFixture('query.graphql');
    const jsFunction = getFixture('query.function.js');

    const code = compileToFunction(graphql);

    assert.equal(code, jsFunction);
  });

  test('it can return the types utilized by a query', () => {
    const graphql = getFixture('query.graphql');
    const profile = profileQuery(graphql, types);

    assert.deepEqual(profile, {
      Product: ['id', 'name', 'price'],
      ID: [],
      String: [],
      Float: [],
      Query: ['node'],
      Node: []}
    );
  });

  test('it can return the types utilized by many queries', () => {
    const queryOne = getFixture('query.graphql');
    const queryTwo = getFixture('query-two.graphql');
    const profile = profileQueries([queryOne, queryTwo], types);

    assert.deepEqual(profile, {
      Product: ['id', 'name', 'price'],
      ID: [],
      String: [],
      Float: [],
      Query: ['node', 'shop'],
      Shop: ['name'],
      Node: []}
    );
  });

  test('it can transform a parsed JSON schema definition into an importable type bundle', () => {
    const schema = JSON.parse(getFixture('schema.json'));
    const expected = getFixture('types.js');

    return compileSchemaJson(schema).then((code) => {
      assert.equal(code, expected);
    });
  });

  test('it can transform a JSON schema definition into an importable type bundle', () => {
    const schemaJson = getFixture('schema.json');
    const expected = getFixture('types.js');

    return compileSchemaJson(schemaJson).then((code) => {
      assert.equal(code, expected);
    });
  });

  test('it can transform an IDL schema definition into an importable type bundle', () => {
    const schema = getFixture('schema.graphql');
    const expected = getFixture('types.js');

    return compileSchemaIDL(schema).then((code) => {
      assert.equal(code, expected);
    });
  });

  test('it can transform a JSON schema definition into an optimized bundle', () => {
    const schemaJson = getFixture('schema.json');
    const queryOne = getFixture('query.graphql');
    const queryTwo = getFixture('query-two.graphql');
    const expected = getFixture('optimized-types.js');

    return compileOptimizedSchemaJson(schemaJson, [queryOne, queryTwo]).then((code) => {
      assert.equal(code, expected);
    });
  });

  test('it can transform an IDL schema definition into an optimized bundle', () => {
    const schema = getFixture('schema.graphql');
    const queryOne = getFixture('query.graphql');
    const queryTwo = getFixture('query-two.graphql');
    const expected = getFixture('optimized-types.js');

    return compileOptimizedSchemaIDL(schema, [queryOne, queryTwo]).then((code) => {
      assert.equal(code, expected);
    });
  });
});
