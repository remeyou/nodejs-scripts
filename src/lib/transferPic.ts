import { execFile } from "child_process";
import { readdir, stat } from "fs/promises";
import { parse, resolve } from "path";
import { IMAGE_FILE_TYPE } from "../constants";
import { askPath, infoFmt, inquirerErr, successFmt } from "../utils";

const supportFileType = IMAGE_FILE_TYPE.filter(
  (s) => !["gif", "webp"].includes(s)
);

const transfer = (path: string) => {
  const { dir, name, ext } = parse(path);
  if (!supportFileType.includes(ext.slice(1))) {
    console.log("[SKIP]", path);
    return;
  }
  const output = `${dir}\\${name}.webp`;
  // The libwebp should be installed on the device for executing the cwebp command.
  execFile("cwebp", ["-q", "90", path, "-o", output], (err) => {
    if (err) {
      throw err;
    }
    console.log(successFmt("transferred"), infoFmt("->"), output);
  });
};

const handleDir = (path: string) =>
  readdir(path).then((list) =>
    list.map((file) => resolve(path, file)).forEach(handleFile)
  );

const handleFile = (path: string) =>
  stat(path).then((stats) => {
    if (stats.isFile()) transfer(path);
    if (stats.isDirectory()) handleDir(path);
  });

const transferPic = () => askPath().then(handleFile).catch(inquirerErr);

export default transferPic;
