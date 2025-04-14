import checkbox from "@inquirer/checkbox";
import input from "@inquirer/input";
import select from "@inquirer/select";
import chalk from "chalk";
import { isAbsolute } from "path";
import { ErrorMsg, Features, IMAGE_FILE_TYPE } from "./constants";

export const errorFmt = chalk.red;
export const successFmt = chalk.green;
export const infoFmt = chalk.dim;

export const askFeature = () =>
  select({
    message: "Which feature do you need?",
    choices: [
      {
        name: "Recursive rename files",
        value: Features.Rename,
        description: infoFmt(
          "Enter a directory path and rename all files in subdirectories to parent. The multiple files will add a suffix by index."
        ),
      },
      {
        name: "Remove empty folders",
        value: Features.Remove,
        description: infoFmt(
          "Entering a directory path, remove all empty folders recursively."
        ),
      },
      {
        name: "Pick a random file",
        value: Features.Random,
        description: infoFmt(
          "Entering a directory path, selecting a file type (optional), recursively picking a file, and opening it."
        ),
      },
      {
        name: "Transfer picture(s) to WebP",
        value: Features.Transfer,
        description: infoFmt(
          "Enter a directory path or a file path to recursively transfer files to WebP."
        ),
      },
    ],
  });

export const askPath = () =>
  input({
    message: "Please input a path for feature execution:",
    validate(value) {
      if (!isAbsolute(value)) {
        return errorFmt(`'${value}' is not an available filesystem path.`);
      }
      return true;
    },
  });

export const askFiletype = () =>
  checkbox({
    message: "Which file type do you want to open?",
    choices: IMAGE_FILE_TYPE.map((s) => ({
      name: s,
      value: s,
    })),
  });

export const inquirerErr = (err: unknown) =>
  err instanceof Error && err.message === ErrorMsg.UserCancel
    ? console.log(infoFmt("Ctrl + C pressed, script will exit."))
    : console.error(errorFmt("Oops! script crashed."), err);
