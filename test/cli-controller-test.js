import assert from 'assert';
import {join} from 'path';
import {
  compileToModule,
  compileOptimizedSchemaJson,
  compileOptimizedSchemaIDL,
  compileSchemaJson,
  compileSchemaIDL
} from '../src/index';
import controller from '../src/cli-controller';

suite('cli-controller-test', () => {
  test('it can handle a list of queries', () => {
    const runConfig = controller([
      'query-one.graphql',
      './some-other-query.graphql',
      './queries/../queries/../queries/query-three.graphql'
    ]);

    assert.deepEqual(runConfig, {
      documents: [
        join(process.cwd(), 'query-one.graphql'),
        join(process.cwd(), 'some-other-query.graphql'),
        join(process.cwd(), 'queries/query-three.graphql')
      ],
      documentCompiler: compileToModule,
      schemaCompiler: null,
      schema: '',
      outdir: process.cwd()
    });
  });

  test('it can filter out the schema file from the list of files', () => {
    // Schema file must exist
    const runConfig = controller([
      '--schema',
      'test/fixtures/schema.graphql',
      'query-one.graphql',
      './some-other-query.graphql',
      './queries/../queries/../test/fixtures/schema.graphql'
    ]);

    assert.deepEqual(runConfig, {
      documents: [
        join(process.cwd(), 'query-one.graphql'),
        join(process.cwd(), 'some-other-query.graphql')
      ],
      documentCompiler: compileToModule,
      schemaCompiler: compileSchemaIDL,
      schema: join(process.cwd(), 'test/fixtures/schema.graphql'),
      outdir: process.cwd()
    });
  });

  test('it respects the outdir', () => {
    const runConfig = controller([
      '--outdir',
      './some/directory',
      'query-one.graphql'
    ]);

    assert.deepEqual(runConfig, {
      documents: [
        join(process.cwd(), 'query-one.graphql')
      ],
      documentCompiler: compileToModule,
      schemaCompiler: null,
      schema: '',
      outdir: join(process.cwd(), 'some/directory')
    });
  });

  test('it can detect a json schema', () => {
    // Schema file must exist
    const runConfig = controller([
      '--schema',
      'test/fixtures/schema.json',
      'query-one.graphql'
    ]);

    assert.deepEqual(runConfig, {
      documents: [
        join(process.cwd(), 'query-one.graphql')
      ],
      documentCompiler: compileToModule,
      schemaCompiler: compileSchemaJson,
      schema: join(process.cwd(), 'test/fixtures/schema.json'),
      outdir: process.cwd()
    });
  });

  test('it throws if you pass the optimize flag with no ', () => {
    assert.throws(() => {
      controller([
        '--optimize',
        'query-one.graphql'
      ]);
    }, /Can not generate an optimized bundle without a schema./);
  });

  test('it returns the right optimization method for an IDL schema', () => {
    const runConfig = controller([
      '--schema',
      'test/fixtures/schema.graphql',
      '--optimize',
      'query-one.graphql'
    ]);

    assert.deepEqual(runConfig, {
      documents: [
        join(process.cwd(), 'query-one.graphql')
      ],
      documentCompiler: compileToModule,
      schemaCompiler: compileOptimizedSchemaIDL,
      schema: join(process.cwd(), 'test/fixtures/schema.graphql'),
      outdir: process.cwd()
    });
  });

  test('it returns the right optimization method for a JSON schema', () => {
    const runConfig = controller([
      '--schema',
      'test/fixtures/schema.json',
      '--optimize',
      'query-one.graphql'
    ]);

    assert.deepEqual(runConfig, {
      documents: [
        join(process.cwd(), 'query-one.graphql')
      ],
      documentCompiler: compileToModule,
      schemaCompiler: compileOptimizedSchemaJson,
      schema: join(process.cwd(), 'test/fixtures/schema.json'),
      outdir: process.cwd()
    });
  });

  test('if only a schema is given, the correct functions are returned', () => {
    const runConfig = controller([
      '--schema',
      'test/fixtures/schema.json'
    ]);

    assert.deepEqual(runConfig, {
      documents: [],
      documentCompiler: compileToModule,
      schemaCompiler: compileSchemaJson,
      schema: join(process.cwd(), 'test/fixtures/schema.json'),
      outdir: process.cwd()
    });
  });

  test('if --help is passed, it returns early with help', () => {
    const runConfig = controller(['--help']);

    assert.deepEqual(runConfig, {
      help: true
    });
  });

  test('if no files are passed, help is set', () => {
    const runConfig = controller([]);

    assert.deepEqual(runConfig, {
      help: true
    });
  });
});
