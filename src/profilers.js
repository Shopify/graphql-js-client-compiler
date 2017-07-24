import Module from 'module';
import Client from 'graphql-js-client/dev';
import {compileToFunction} from './query-compilers';

export function profileQuery(query, types) {
  return profileQueries([query], types);
}

export function profileQueries(queries, types) {
  const client = new Client(types, {url: 'https://not-an-api.com'});

  const functions = queries.map((query) => {
    const code = compileToFunction(query);
    const virtualModule = new Module();

    virtualModule._compile(`module.exports = ${code}`, '');

    return virtualModule.exports;
  });

  Client.resetProfiler();
  Client.startProfiling();

  functions.forEach((func) => {
    func(client);
  });

  Client.pauseProfiling();

  return Client.captureProfile();
}
