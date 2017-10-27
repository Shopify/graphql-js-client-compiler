[![CircleCI](https://circleci.com/gh/Shopify/graphql-js-client-compiler.svg?style=svg)](https://circleci.com/gh/Shopify/graphql-js-client-compiler)

# graphql-js-client-compiler

Converts GraphQL files and schema definitions into ES Modules for use with the [graphql-js-client](https://github.com/Shopify/graphql-js-client).

## Table Of Contents

- [Installation](#installation)
- [Examples](#examples)
- [Fragments](#fragments)
- [CLI Usage](#cli_usage)
- [API](#api)
- [Complete example](#complete_example)
- [License](http://github.com/Shopify/graphql-js-client-compiler/blob/master/LICENSE.md)

## Installation

#### With Yarn:

```bash
$ yarn global add graphql-js-client-compiler
```

#### With NPM:

```bash
$ npm install -g graphql-js-client-compiler
```

## Examples

### CLI Usage

#### CLI Options

- `--help`
  Print this usage guide.
- `--schema file`
  The schema file to process. This can be in JSON (.json) or IDL (.graphql) format.
- `--outdir path`
  default: "." The path to write the compiled files, preserving directory structure from the source. This path will be created if it does not exist.
- `--optimize`
  Specifiy the "optimize" option to generate an optimized type bundle. This operation is slow and should only be used in production.

#### CLI Example

1. Converting a bunch of graphql queries.
```bash
$ graphql-js-client-compiler queries/**/*.graphql some-other-query.graphql
```
2. Convert a bunch of queries, and a schema.
```bash
$ graphql-js-client-compiler --schema schema.graphql queries/**/*.graphql
```
3. Complete example: Convert a bunch of queries, a schema, and optimize the schema output for only used types.
```bash
$ graphql-js-client-compiler --outdir src --schema schema.graphql --optimize queries/**/*.graphql
```

### Fragments

Documents may reference fragments outside of the current `.graphql` file. For example:

```graphql
query ($id: ID!) {
  node(id: $id) {
    ...ProductFragment
  }
}
```

If `ProductFragment` isn't in the `.graphql` file, the compiler will search for a file called `ProductFragment.graphql` in the same directory. This allows fragments to be recycled between documents.

### API

This library exports several functions that can transform schemas and documents into ES modules.


```javascript
import {
  compileToModule,
  compileOptimizedSchemaJson,
  compileOptimizedSchemaIDL,
  compileSchemaJson,
  compileSchemaIDL
} from '../src/index';
```

#### Compile a Query

```javascript
import {writeFileSync} from 'fs';
import {compileToModule} from 'graphql-js-client-compiler';

const code = compileToModule(`
query {
  shop {
   name
  }
}
`);

writeFileSync('query.js', code);
```

This will generate a file, that's importable, and invocable with the GraphQL JS Client:

```javascript
import query from 'query';

...

client.send(query).then({model} => console.log(model));
```

#### Other Functions

- `compileSchemaJson(schemaJson, {profile = null} = {})`
  Transforms a JSON schema into the javascript code for an ES module expressing all types in the schema.
  - `schemaJson`: The JSON string of a schema file.
  - `profile`: (optional) The profile returned by GraphQL JS Client's profiler.
  - returns: javascript code
- `compileSchemaIDL(schemaIDL, {profile = null} = {})`
  Transforms an IDL schema into the javascript code for an ES module expressing all types in the schema.
  - `schemaIDL`: The IDL string of a schema file.
  - `profile`: (optional) The profile returned by GraphQL JS Client's profiler.
  - returns: javascript code
- `compileOptimizedSchemaJson(schemaJson, {documents})`
  Transforms a JSON schema into the javascript code for an ES module expressing only the types found in the passed documents.
  - `schemaJson`: The JSON string of a schema file.
  - `documents`: an array of GraphQL documents as text.
  - returns: javascript code
- `compileOptimizedSchemaIDL(schemaIDL, {documents})`
  Transforms an IDL schema into the javascript code for an ES module expressing only the types found in the passed documents.
  - `schemaIDL`: The IDL string of a schema file.
  - `documents`: an array of GraphQL documents as text.
  - returns: javascript code


### Complete example

This example demonstrates transforming a directory of GraphQL queries, and a GraphQL schema into code, and consuming it with the GraphQL JS Client.


__Compilation__
```bash
$ graphql-js-client-compiler --outdir src --schema graphql/schema.graphql --optimize graphql/**/*.graphql
```

__Consumption__

src/index.js:

```javascript
import Client from 'graphql-js-client';
import types from './schema';
import productQuery from './graphql/product-query';

const client = new Client(types, {url: 'https://my-api.com/graphql');

client.send(productQuery).then({model} => {
  console.log(model);
});
```

## License

MIT, see [LICENSE.md](http://github.com/Shopify/graphql-js-client-compiler/blob/master/LICENSE.md) for details.

<img src="https://cdn.shopify.com/shopify-marketing_assets/builds/19.0.0/shopify-full-color-black.svg" width="200" />
