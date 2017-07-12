const {graphql, buildSchema} = require('graphql');
const {introspectionQuery} = require('graphql/utilities');
const {readFileSync, writeFileSync} = require('fs');
const path = require('path');

const fixtureRoot = path.join(process.cwd(), 'test', 'fixtures');
const schemaPath = path.join(fixtureRoot, 'schema.graphql');
const schemaJsonPath = path.join(fixtureRoot, 'schema.json');

const schemaText = readFileSync(schemaPath).toString();
const schema = buildSchema(schemaText);

graphql(schema, introspectionQuery).then((schemaJson) => {
  writeFileSync(schemaJsonPath, JSON.stringify(schemaJson, null, 2));
}).catch((error) => {
  console.error(error);
});
