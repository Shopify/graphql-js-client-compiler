import assert from 'assert';
import compile, {transformToFunction, profileQuery} from '../src/index';
import getFixture from './get-fixture';
import types from './fixtures/types';

suite('compile-test', () => {
  test('it can transform a graphql query into an ES module', () => {
    const graphql = getFixture('query.graphql');
    const esModule = getFixture('query.js');

    const code = compile(graphql);

    assert.equal(code, esModule);
  });

  test('it can transform a graphql query into a bare function', () => {
    const graphql = getFixture('query.graphql');
    const jsFunction = getFixture('query.function.js');

    const code = transformToFunction(graphql);

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
});
