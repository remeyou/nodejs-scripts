import { ErrorMsg, Feature } from './constants';
import recursiveRenameFile from './recursiveRenameFile';
import removeEmptyFolder from './removeEmptyFolder';
import { askFeature, askPath, errorFmt } from './utils';

(async function async() {
  try {
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
  } catch (error) {
    if ((error as Error).message === ErrorMsg.UserCancel) {
      return;
    }
    console.error(errorFmt('Oops! script crashed.'), error);
  }
})();
