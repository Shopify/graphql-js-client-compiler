import usage from 'command-line-usage';

export default usage([
  {
    header: 'GraphQL JS Client Compiler',
    content: 'Converts GraphQL files and schema definitions into ES Modules'
  }, {
    header: 'Options',
    optionList: [{
      name: 'help',
      description: 'Print this usage guide.'
    }, {
      name: 'schema',
      typeLabel: '[underline]{file}',
      description: 'The schema file to process. This can be in JSON (.json) or IDL (.graphql) format.'
    }, {
      name: 'outdir',
      typeLabel: '[underline]{path}',
      description: '[underline]{default: "."} The path to write the compiled files, preserving directory structure from the source. This path will be created if it does not exist.'
    }, {
      name: 'optimize',
      description: 'Specifiy the "optimize" option to generate an optimized type bundle. This operation is slow and should only be used in production'
    }]
  }, {
    header: 'Examples',
    content: [{
      desc: '1. Converting a bunch of graphql queries.',
      example: '$ graphql-js-client-compiler queries/**/*.graphql some-other-query.graphql'
    }, {
      desc: '2. Convert a bunch of queries, and a schema.',
      example: '$ graphql-js-client-compiler --schema schema.graphql queries/**/*.graphql'
    }, {
      desc: '3. Complete example: Convert a bunch of queries, a schema, and optimize the schema output for unly used types.',
      example: '$ graphql-js-client-compiler --outdir src --schema schema.graphql --optimize queries/**/*.graphql'
    }]
  }
]);
