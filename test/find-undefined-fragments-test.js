import assert from 'assert';
import findUndefinedFragments from '../src/find-undefined-fragments';

suite('find-undefined-fragments-test', () => {
  test('it can find fragments without definitions in a document', () => {
    const undefinedFragments = findUndefinedFragments(`
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
    `);

    assert.deepEqual(undefinedFragments, [
      'collectionFragment',
      'productFragmentPartTwo'
    ]);
  });

  test('it can handle documents with no undefined fragments', () => {
    const undefinedFragments = findUndefinedFragments(`
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
    `);

    assert.deepEqual(undefinedFragments, []);
  });
});
