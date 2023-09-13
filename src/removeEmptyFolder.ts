import { readdir, rmdir, stat } from 'fs/promises';
import { resolve } from 'path';
import { secondaryFmt, successFmt } from './utils';

function removeDir(path: string) {
  rmdir(path).then(() =>
    console.log(successFmt('removed'), secondaryFmt('->'), path),
  );
}

function doDir(path: string) {
  readdir(path).then((list) =>
    list.length
      ? list.map((file) => resolve(path, file)).forEach(doFile)
      : removeDir(path),
  );
}

function doFile(path: string) {
  stat(path).then((obj) => obj.isDirectory() && doDir(path));
}

export default doFile;
