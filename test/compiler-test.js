import assert from 'assert';
import compile from '../src/index';
import getFixture from './get-fixture';

suite('compile-test', () => {
  test('it can transform a graphql query into an ES module', () => {
    const graphql = getFixture('query.graphql');
    const esModule = getFixture('query.js');

    const code = compile(graphql);

    assert.equal(code, esModule);
  });
});
