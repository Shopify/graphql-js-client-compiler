import {createFilter} from 'rollup-pluginutils';
import compile from './index';

export default function myPlugin(options = {}) {
  const filter = createFilter(options.include, options.exclude);
  const extensions = options.extensions;
  const extensionMatchers = extensions.map((ext) => {
    return new RegExp(`${ext}$`);
  });

  return {
    transform(code, id) {
      if (!filter(id)) {
        return;
      }

      if (!extensionMatchers.some((matcher) => id.match(matcher))) {
        return;
      }

      return compile(code);
    }
  };
}
