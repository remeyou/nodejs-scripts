import { readdir, rename, stat } from 'fs/promises';
import { parse, resolve } from 'path';
import { askPath, inquirerErr, secondaryFmt, successFmt } from '../utils';

function renameFile(path: string, index?: number) {
  const { dir, ext } = parse(path);
  const parentDir = dir.split('\\').at(-1);
  const suffix = index ? '-' + index : '';
  const newPath = resolve(dir, parentDir + suffix + ext);
  rename(path, newPath).then(() =>
    console.log(successFmt('renamed'), secondaryFmt('->'), newPath),
  );
}

function doDir(path: string) {
  readdir(path).then((list) =>
    list.map((file) => resolve(path, file)).forEach(doFile),
  );
}

function doFile(path: string, index?: number) {
  stat(path).then((obj) => {
    if (obj.isFile()) {
      renameFile(path, index);
      return;
    }
    if (obj.isDirectory()) {
      doDir(path);
    }
  });
}

async function recursiveRenameFile() {
  try {
    const path = await askPath();
    doFile(path);
  } catch (error) {
    inquirerErr(error as Error);
  }
}

export default recursiveRenameFile;
