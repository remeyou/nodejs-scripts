import { Features } from "./constants";
import convertPic from "./lib/convertPic";
import pickRandomFile from "./lib/pickRandomFile";
import recursiveRenameFile from "./lib/recursiveRenameFile";
import removeEmptyFolder from "./lib/removeEmptyFolder";
import { askFeature, inquirerErr } from "./utils";

const features = {
  [Features.Remove]: removeEmptyFolder,
  [Features.Rename]: recursiveRenameFile,
  [Features.Random]: pickRandomFile,
  [Features.Convert]: convertPic,
};

const userArgv0 = process.argv[2];
if (userArgv0) {
  if (userArgv0 === "random") {
    pickRandomFile();
  }
} else {
  askFeature()
    .then((f) => features[f]())
    .catch(inquirerErr);
}
