import minimist from 'minimist';
import { isAbsolute } from 'path';
import { argv } from 'process';
import recursiveRenameFile from './recursiveRenameFile';
import removeEmptyFolder from './removeEmptyFolder';

function main() {
  // init
  const args = minimist(argv);
  const { path, action } = args;

  // validate
  if (!isAbsolute(path)) {
    console.error(path, 'is not available file path. ');
    return;
  }

  // task
  switch (action) {
    case 'test':
      console.log(args);
      break;
    case 'remove':
      removeEmptyFolder(path);
      break;
    case 'rename':
      recursiveRenameFile(path);
      break;
  }
}

main();
