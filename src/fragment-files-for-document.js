import {dirname, join} from 'path';
import findUndefinedFragments from './find-undefined-fragments';

export default function fragmentFilesForDocument(documentPath, document) {
  const undefinedFragments = findUndefinedFragments(document);
  const workingDirectory = dirname(documentPath);

  return undefinedFragments.map((fragmentName) => {
    return join(workingDirectory, `${fragmentName}.graphql`);
  });
}
