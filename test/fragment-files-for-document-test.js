import assert from 'assert';
import {join} from 'path';
import fragmentFilesForDocument from '../src/fragment-files-for-document';

suite('fragment-files-for-document-test', () => {
  test('it can resolve fragment files given a document and a file path', () => {
    const queryWithUndefinedFragments = `
      query {
        shop {
          ...shopFragment
        }

        node(id: "1") {
          ...productFragment
          ...collectionFragment
        }
      }

      fragment shopFragment on Shop {
        name
      }

      fragment productFragment on Product {
        ...productFragmentPartOne
        ...productFragmentPartTwo
      }

      fragment productFragmentPartOne on Product {
        name
      }
    `;

    const queryPath = join(process.cwd(), 'queries', 'has-undefined-fragments.graphql');

    const undefinedFragmentPaths = fragmentFilesForDocument(queryPath, queryWithUndefinedFragments);

    assert.deepEqual(undefinedFragmentPaths, [
      join(process.cwd(), 'queries', 'collectionFragment.graphql'),
      join(process.cwd(), 'queries', 'productFragmentPartTwo.graphql')
    ]);
  });

  test('it can handle documents with no undefined fragments', () => {
    const query = `
      query {
        shop {
          ...shopFragment
        }

        node(id: "1") {
          ...productFragment
        }
      }

      fragment shopFragment on Shop {
        name
      }

      fragment productFragment on Product {
        name
      }
    `;

    const queryPath = join(process.cwd(), 'queries', 'has-only-defined-fragments.graphql');

    const fragmentPaths = fragmentFilesForDocument(queryPath, query);

    assert.deepEqual(fragmentPaths, []);
  });
});
