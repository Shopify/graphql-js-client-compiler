import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import {readFileSync} from 'fs';
import {execSync} from 'child_process';

const pkg = require('./package.json');

const external = Object.keys(pkg.dependencies).concat(
  'graphql/utilities',
  'graphql/language',
  'graphql-js-client/dev',
  'module',
  'fs',
  'path'
);
const revision = execSync('git rev-parse HEAD')
  .toString()
  .trim()
  .slice(0, 7);

const banner = `#!/usr/bin/env node

/*
${readFileSync('./LICENSE.md')}
Version: ${pkg.version} Commit: ${revision}
*/`;

export default {
  entry: 'src/cli-executor.js',
  plugins: [
    babel({
      presets: [
        ['shopify/node', {modules: false}]
      ]
    }),
    resolve({
      preferBuiltins: true,
      browser: false,
      module: true
    })
  ],
  external,
  banner,
  targets: [
    {
      dest: pkg.bin,
      format: 'cjs',
      sourceMap: true
    }
  ]
};
