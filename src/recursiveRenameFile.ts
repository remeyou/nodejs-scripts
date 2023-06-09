import { readdir, rename, stat } from 'fs/promises';
import { parse, resolve } from 'path';

function renameFile(path: string, index?: number) {
  const { dir, ext } = parse(path);
  const parentDir = dir.split('\\').at(-1);
  const suffix = index ? '-' + index : '';
  const newPath = resolve(dir, parentDir + suffix + ext);
  rename(path, newPath).then(() => console.log('renamed ->', newPath));
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

export default doFile;
