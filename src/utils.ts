import input from '@inquirer/input';
import select from '@inquirer/select';
import chalk from 'chalk';
import { isAbsolute } from 'path';
import { Feature } from './constants';

export const errorFmt = chalk.red;
export const successFmt = chalk.green;
export const secondaryFmt = chalk.dim;

export async function askFeature() {
  return await select({
    message: 'Which feature is your need?',
    choices: [
      {
        name: 'Recursive rename file',
        value: Feature.Rename,
        description: secondaryFmt(
          'Entering a directory path, rename all files of sub directories to parent, the multiple files will add suffix by index.',
        ),
      },
      {
        name: 'Remove empty folder',
        value: Feature.Remove,
        description: secondaryFmt(
          'Entering a directory path, remove all empty folder recursively.',
        ),
      },
    ],
  });
}

export async function askPath() {
  return await input({
    message: 'Please input a path for feature executing:',
    validate(value) {
      if (!isAbsolute(value)) {
        return errorFmt(`'${value}' is not available filesystem path.`);
      }
      return true;
    },
  });
}
