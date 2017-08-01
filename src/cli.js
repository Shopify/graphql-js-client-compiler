import {readFileSync, writeFileSync} from 'fs';
import {relative, basename, dirname, join} from 'path';
import mkdirp from 'mkdirp';
import controller from './cli-controller';
import usage from './usage';
import fragmentFilesForDocument from './fragment-files-for-document';

function read(path, silent) {
  if (!silent) {
    // Double space after read to align with [WRITE]
    console.log(`[READ]  ${path}`);
  }

  return readFileSync(path).toString();
}

function write(path, body, silent) {
  if (!silent) {
    console.log(`[WRITE] ${path}`);
  }

  return writeFileSync(path, body);
}

function readDocuments(documents, silent) {
  return documents.map((path) => {
    return {
      body: read(path, silent),
      path
    };
  });
}

function concatBodies(files) {
  return files.reduce((buffer, file) => {
    return buffer + file.body;
  }, '');
}

function concatenateAndStripFragments(documentCode) {
  const allFragments = [];

  return documentCode.map((document) => {
    const fragmentFiles = fragmentFilesForDocument(document.path, document.body);

    if (fragmentFiles.length) {
      const fragments = documentCode.filter((possibleFragment) => {
        return fragmentFiles.includes(possibleFragment.path);
      });

      allFragments.push(...fragments);

      return {
        body: concatBodies(fragments.concat(document)),
        path: document.path
      };
    }

    return document;
  }).filter((documentOrFragment) => {
    return !allFragments.includes(documentOrFragment);
  });
}

function compileDocuments({documentCode, documentCompiler, outdir, silent}) {
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

    write(document.path, document.body, silent);
  });

  return documentCode.map((document) => document.body);
}

function compileSchema({outdir, documentCode, schema, schemaCompiler, silent}) {
  const documentBodies = documentCode.map((document) => document.body);
  const schemaBody = read(schema, silent);
  const relativeSchemaPath = relative(process.cwd(), schema);
  const extension = `.${schema.split('.').pop()}`;
  const filename = basename(relativeSchemaPath, extension);
  const relativeDirectory = dirname(relativeSchemaPath);
  const outputPath = join(outdir, relativeDirectory, `${filename}.js`);

  return schemaCompiler(schemaBody, {documents: documentBodies}).then((body) => {
    write(outputPath, body, silent);
  });
}

export default function cli(args, {silent = false} = {}) {
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

  const rawDocumentCode = readDocuments(documents, silent);
  const documentCode = concatenateAndStripFragments(rawDocumentCode);

  compileDocuments({outdir, documentCode, documentCompiler, silent});

  if (schema && schemaCompiler) {
    return compileSchema({outdir, documentCode, schema, schemaCompiler, silent});
  }

  return Promise.resolve();
}
