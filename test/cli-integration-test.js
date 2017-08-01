import assert from 'assert';
import {join, normalize} from 'path';
import {readdirSync, readFileSync} from 'fs';
import tmp from 'tmp';
import cli from '../src/cli';

suite('cli-integration-test', () => {
  let outdir;
  let originalCwd;

  suiteSetup(() => {
    originalCwd = process.cwd();
  });

  suiteTeardown(() => {
    process.chdir(originalCwd);
  });

  setup(() => {
    tmp.setGracefulCleanup();
    outdir = tmp.dirSync().name;
  });

  function assertFilesMatch(files) {
    assert.equal(
      readFileSync(files.output).toString(),
      readFileSync(files.fixture).toString(),
      `Output file: "${normalize(files.output)}" does not match fixture "${normalize(files.fixture)}"`
    );
  }

  test('it can generate a set of graphql modules for a set of queries', () => {
    process.chdir(join(originalCwd, 'test/fixtures/cli-integration/queries'));

    return cli([
      '--outdir',
      outdir,
      'query-one.graphql',
      'sub-folder/query-two.graphql'
    ], {silent: true}).then(() => {
      assert.deepEqual(readdirSync(outdir), [
        'query-one.js',
        'sub-folder'
      ]);
      assert.deepEqual(readdirSync(join(outdir, 'sub-folder')), [
        'query-two.js'
      ]);

      [{
        output: join(outdir, 'query-one.js'),
        fixture: join(process.cwd(), '../basic-output/query-one.js')
      }, {
        output: join(outdir, 'sub-folder/query-two.js'),
        fixture: join(process.cwd(), '../basic-output/sub-folder/query-two.js')
      }].forEach(assertFilesMatch);
    });
  });

  test('it can generate a set of graphql modules for a set of queries and a schema', () => {
    process.chdir(join(originalCwd, 'test/fixtures/cli-integration/queries'));

    return cli([
      '--outdir',
      outdir,
      '--schema',
      'schema.graphql',
      'query-one.graphql',
      'sub-folder/query-two.graphql'
    ], {silent: true}).then(() => {
      assert.deepEqual(readdirSync(outdir), [
        'query-one.js',
        'schema.js',
        'sub-folder'
      ]);
      assert.deepEqual(readdirSync(join(outdir, 'sub-folder')), [
        'query-two.js'
      ]);

      [{
        output: join(outdir, 'query-one.js'),
        fixture: join(process.cwd(), '../basic-output/query-one.js')
      }, {
        output: join(outdir, 'schema.js'),
        fixture: join(process.cwd(), '../basic-output/schema.js')
      }, {
        output: join(outdir, 'sub-folder/query-two.js'),
        fixture: join(process.cwd(), '../basic-output/sub-folder/query-two.js')
      }].forEach(assertFilesMatch);
    });
  });

  test('it can generate and optimize a set of graphql modules for a set of queries and a schema', () => {
    process.chdir(join(originalCwd, 'test/fixtures/cli-integration/queries'));

    return cli([
      '--optimize',
      '--outdir',
      outdir,
      '--schema',
      'schema.graphql',
      'query-one.graphql',
      'sub-folder/query-two.graphql'
    ], {silent: true}).then(() => {
      [{
        output: join(outdir, 'query-one.js'),
        fixture: join(process.cwd(), '../optimized-output/query-one.js')
      }, {
        output: join(outdir, 'schema.js'),
        fixture: join(process.cwd(), '../optimized-output/schema.js')
      }, {
        output: join(outdir, 'sub-folder/query-two.js'),
        fixture: join(process.cwd(), '../optimized-output/sub-folder/query-two.js')
      }].forEach(assertFilesMatch);
    });
  });

  test('it can concatenate fragments into queries with unresolved queries', () => {
    process.chdir(join(originalCwd, 'test/fixtures/cli-integration/queries-with-fragments'));

    return cli([
      '--outdir',
      outdir,
      'query-one.graphql',
      'sub-folder/query-two.graphql',
      'ProductFragment.graphql'
    ], {silent: true}).then(() => {
      assert.deepEqual(readdirSync(outdir), [
        'query-one.js',
        'sub-folder'
      ]);
      assert.deepEqual(readdirSync(join(outdir, 'sub-folder')), [
        'query-two.js'
      ]);

      [{
        output: join(outdir, 'query-one.js'),
        fixture: join(process.cwd(), '../concatenated-fragment-output/query-one.js')
      }, {
        output: join(outdir, 'sub-folder/query-two.js'),
        fixture: join(process.cwd(), '../concatenated-fragment-output/sub-folder/query-two.js')
      }].forEach(assertFilesMatch);
    });
  });
});
