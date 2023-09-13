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
    message: 'Which feature do you need?',
    choices: [
      {
        name: 'Recursive rename files',
        value: Feature.Rename,
        description: secondaryFmt(
          'Entering a directory path, rename all files in subdirectories to parent; the multiple files will add a suffix by index.',
        ),
      },
      {
        name: 'Remove empty folders',
        value: Feature.Remove,
        description: secondaryFmt(
          'Entering a directory path, remove all empty folders recursively.',
        ),
      },
    ],
  });
}

export async function askPath() {
  return await input({
    message: 'Please input a path for feature execution:',
    validate(value) {
      if (!isAbsolute(value)) {
        return errorFmt(`'${value}' is not an available filesystem path.`);
      }
      return true;
    },
  });
}
