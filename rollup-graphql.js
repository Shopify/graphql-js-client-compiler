import babel from 'rollup-plugin-babel';
import graphql from './src/rollup-plugin';

export default {
  entry: 'graph-src/index.js',
  plugins: [
    graphql({
      extensions: ['.graphql']
    }),
    babel({
      presets: [
        ['shopify/node', {modules: false}]
      ]
    })
  ],
  targets: [
    {
      dest: 'graphql.js',
      format: 'cjs',
      sourceMap: true
    }
  ]
};
