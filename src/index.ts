import { Fns } from './constants';
import guessGame from './functions/guessGame';
import recursiveRenameFile from './functions/recursiveRenameFile';
import removeEmptyFolder from './functions/removeEmptyFolder';
import { askFeature, inquirerErr } from './utils';

(async function async() {
  try {
    const fn = await askFeature();

    switch (fn) {
      case Fns.Remove:
        removeEmptyFolder();
        break;
      case Fns.Rename:
        recursiveRenameFile();
        break;
      case Fns.Guess:
        guessGame();
    }
  } catch (error) {
    inquirerErr(error as Error);
  }
})();
