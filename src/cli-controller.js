import minimist from 'minimist';
import {resolve} from 'path';
import {readFileSync} from 'fs';
import {
  compileToModule,
  compileOptimizedSchemaJson,
  compileOptimizedSchemaIDL,
  compileSchemaJson,
  compileSchemaIDL
} from './index';

function splitFiles(files, schemaPath) {
  const filenames = files.map((path) => resolve(path));
  const schema = resolve(schemaPath);

  const documents = filenames.filter((filename) => {
    return schema !== filename;
  });

  return {documents, schema};
}

function detectSchemaFormat(fullPath) {
  const body = readFileSync(fullPath);

  try {
    JSON.parse(body);

    return 'json';
  } catch (_) {
    return 'idl';
  }
}

export default function run(argv) {
  const args = minimist(argv, {
    string: ['outdir', 'schema'],
    boolean: ['optimize', 'help'],
    default: {
      help: false,
      optimize: false,
      schema: '',
      outdir: '.'
    }
  });

  const {outdir, schema, optimize, help} = args;
  const files = args._;

  if (help || (files.length === 0 && !schema)) {
    return {help: true};
  }

  const {schema: schemaFullPath, documents} = splitFiles(files, schema);

  const documentCompiler = compileToModule;
  let schemaCompiler = null;
  let schemaFormat;

  if (schema) {
    schemaFormat = detectSchemaFormat(schemaFullPath);
  }

  if (optimize) {
    if (!schema) {
      throw new Error(`
        Can not generate an optimized bundle without a schema.
        Please provide a schema file
      `);
    }

    if (schemaFormat === 'json') {
      schemaCompiler = compileOptimizedSchemaJson;
    } else {
      schemaCompiler = compileOptimizedSchemaIDL;
    }
  } else if (schema && schemaFormat) {
    if (schemaFormat === 'json') {
      schemaCompiler = compileSchemaJson;
    } else {
      schemaCompiler = compileSchemaIDL;
    }
  }

  return {
    documentCompiler,
    documents,
    schemaCompiler,
    schema: schema && schemaFullPath,
    outdir: resolve(outdir)
  };
}
