import { Feature } from './constants';
import recursiveRenameFile from './recursiveRenameFile';
import removeEmptyFolder from './removeEmptyFolder';
import { askFeature, askPath } from './utils';

(async function async() {
  const feature = await askFeature();

  const path = await askPath();

  switch (feature) {
    case Feature.Remove:
      removeEmptyFolder(path);
      break;
    case Feature.Rename:
      recursiveRenameFile(path);
      break;
  }
})();
