import {parse, visit} from 'graphql/language';

export default function findUndefinedFragments(document) {
  const definitionNames = [];
  const spreadNames = [];

  visit(parse(document), {
    FragmentDefinition(nodes) {
      definitionNames.push(nodes.name.value);
    },
    FragmentSpread(nodes) {
      spreadNames.push(nodes.name.value);
    }
  });

  return spreadNames.filter((name) => {
    return !definitionNames.includes(name);
  });
}
