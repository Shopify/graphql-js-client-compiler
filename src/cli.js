import {readFileSync, writeFileSync} from 'fs';
import {relative, basename, dirname, join} from 'path';
import mkdirp from 'mkdirp';
import controller from './cli-controller';
import usage from './usage';

function read(path) {
  // Double space after read to align with [WRITE]
  console.log(`[READ]  ${path}`);

  return readFileSync(path).toString();
}

function write(path, body) {
  console.log(`[WRITE] ${path}`);

  return writeFileSync(path, body);
}

function readDocuments(documents) {
  return documents.map((path) => {
    return {
      body: read(path),
      path
    };
  });
}

function compileDocuments({documentCode, documentCompiler, outdir}) {
  const compiledDocuments = documentCode.map((document) => {
    const relativePath = relative(process.cwd(), document.path);
    const filename = basename(relativePath, '.graphql');
    const relativeDirectory = dirname(relativePath);
    const outputPath = join(outdir, relativeDirectory, `${filename}.js`);

    return {
      body: documentCompiler(document.body),
      path: outputPath
    };
  });


  compiledDocuments.forEach((document) => {
    mkdirp.sync(dirname(document.path));

    write(document.path, document.body);
  });

  return documentCode.map((document) => document.body);
}

function compileSchema({outdir, documentCode, schema, schemaCompiler}) {
  const documentBodies = documentCode.map((document) => document.body);
  const schemaBody = read(schema);
  const relativeSchemaPath = relative(process.cwd(), schema);
  const extension = `.${schema.split('.').pop()}`;
  const filename = basename(relativeSchemaPath, extension);
  const relativeDirectory = dirname(relativeSchemaPath);
  const outputPath = join(outdir, relativeDirectory, `${filename}.js`);

  return schemaCompiler(schemaBody, {documents: documentBodies}).then((body) => {
    write(outputPath, body);
  });
}

function run(args) {
  const {
    documents,
    documentCompiler,
    schema,
    schemaCompiler,
    outdir,
    help
  } = controller(args);

  if (help) {
    console.log(usage);
    process.exit(0);
  }

  mkdirp.sync(outdir);

  const documentCode = readDocuments(documents);

  compileDocuments({outdir, documentCode, documentCompiler});

  if (schema && schemaCompiler) {
    compileSchema({outdir, documentCode, schema, schemaCompiler});
  }
}

run(process.argv.slice(2));
