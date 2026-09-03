import confirm from "@inquirer/confirm";
import { execFile } from "child_process";
import { readdir, rm, stat } from "fs/promises";
import { parse, resolve, sep } from "path";
import { exit } from "process";
import { promisify } from "util";
import { IMAGE_FILE_TYPE } from "../constants";
import {
  askPath,
  errorFmt,
  infoFmt,
  inquirerErr,
  successFmt,
  warningFmt,
} from "../utils";

const asyncExecFile = promisify(execFile);
const supportFileType = IMAGE_FILE_TYPE.filter(
  (s) => !["webp", "gif"].includes(s),
);

interface PicInfo {
  path?: string;
  originSize?: number;
  outputSize?: number;
  error?: any;
  filename?: string;
  output?: string;
}

const convert = async (path: string): Promise<PicInfo> => {
  const { dir, name, ext, base } = parse(path);
  const output = `${dir}${sep}${name}.webp`;

  try {
    // The libwebp should be installed on the device for executing the cwebp command.
    await asyncExecFile(ext.includes("gif") ? "gif2webp" : "cwebp", [
      "-q",
      "90",
      path,
      "-o",
      output,
    ]);
    return {
      path,
      outputSize: (await stat(output)).size,
      filename: base,
      output,
    };
  } catch (error) {
    console.error(errorFmt("cwebp executed error:"), error);
    return { path };
  }
};

const handleDir = async (path: string) => {
  const files = await readdir(path);
  const results = await Promise.allSettled(
    files.map((file) => resolve(path, file)).map(handleFile),
  );
  return results.reduce<PicInfo[]>((prev, curr) => {
    if (curr.status === "fulfilled") {
      return [...prev, ...curr.value];
    }
    return [...prev, { error: curr.reason }];
  }, []);
};

const handleFile = async (path: string): Promise<PicInfo[]> => {
  const stats = await stat(path);
  if (stats.isFile()) {
    if (!supportFileType.includes(parse(path).ext.slice(1))) {
      console.log(infoFmt("[IGNORE]"), path);
      return [{ path }];
    }
    const pic = await convert(path);
    pic.originSize = stats.size;
    return [pic];
  }
  if (stats.isDirectory()) {
    return await handleDir(path);
  }
  return [];
};

const convertPic = async () => {
  try {
    const pics = await handleFile(await askPath());
    const converts = pics.filter((pic) => pic.outputSize);
    const unexpected: PicInfo[] = [];
    const expected: PicInfo[] = [];
    const sum = converts.reduce<{ outputSize: number; originSize: number }>(
      (prev, curr) => {
        const { outputSize, originSize, filename, output } = curr;
        if (typeof outputSize === "number" && typeof originSize === "number") {
          prev.outputSize += outputSize;
          prev.originSize += originSize;
          if (outputSize > originSize * 0.9) {
            unexpected.push(curr);
            console.log(
              warningFmt("[OUTPUT SIZE WARNING]"),
              "filename:",
              filename,
              "output:",
              formatFileSize(outputSize),
              "origin:",
              formatFileSize(originSize),
              "ratio:",
              ((outputSize / originSize) * 100).toFixed(2) + "%",
            );
          } else {
            expected.push(curr);
          }
        } else {
          console.error(
            errorFmt("[DATA TYPE ERROR]"),
            "filename:",
            filename,
            "outputSize:",
            outputSize,
            "originSize:",
            originSize,
          );
        }
        return prev;
      },
      { outputSize: 0, originSize: 0 },
    );
    console.table([
      {
        Output: formatFileSize(sum.outputSize),
        Origin: formatFileSize(sum.originSize),
        Ratio: ((sum.outputSize / sum.originSize) * 100).toFixed(2) + "%",
        Less: formatFileSize(sum.originSize - sum.outputSize),
      },
    ]);
    console.log(
      successFmt(`${converts.length} of ${pics.length} file(s) converted.`),
    );
    if (
      unexpected.length &&
      (await confirm({
        message: `Do you want to remove the outputs that size more than 90% of origins?`,
      }))
    ) {
      await removeFiles(unexpected, "output");
    }
    if (
      expected.length &&
      (await confirm({
        message: `Do you want to remove the original file(s)${unexpected.length ? " besides unexpected outputs" : ""}?`,
      }))
    ) {
      await removeFiles(expected, "path");
    }
  } catch (error) {
    inquirerErr(error);
  } finally {
    exit();
  }
};

export default convertPic;

async function removeFiles(pics: PicInfo[], indexProp: keyof PicInfo) {
  const results = await Promise.allSettled(
    pics.map((pic) => pic[indexProp] && rm(pic[indexProp])),
  );
  const count = results.reduce((prev, curr) => {
    if (curr.status === "fulfilled") {
      return prev + 1;
    }
    console.error(errorFmt("[ERROR]"), curr.reason);
    return prev;
  }, 0);
  console.log(successFmt(`${count} of ${results.length} file(s) removed.`));
}

function formatFileSize(bytes: number) {
  const abs = Math.abs(bytes);
  if (abs < 1024) return `${bytes} B`;
  if (abs < 1048576) return `${(bytes / 1024).toFixed(2)} KiB`;
  if (abs < 1073741824) return `${(bytes / 1048576).toFixed(2)} MiB`;
  return `${(bytes / 1073741824).toFixed(2)} GiB`;
}
