import input from '@inquirer/input';
import select from '@inquirer/select';
import chalk from 'chalk';
import { isAbsolute } from 'path';
import { ErrorMsg, Fns } from './constants';

export const errorFmt = chalk.red;
export const successFmt = chalk.green;
export const secondaryFmt = chalk.dim;

export async function askFeature() {
  return await select({
    message: 'Which feature do you need?',
    choices: [
      {
        name: 'Guess Game',
        value: Fns.Guess,
        description: secondaryFmt(
          'Entering a name, APIs will guess gender or nation of the name.',
        ),
      },
      {
        name: 'Recursive rename files',
        value: Fns.Rename,
        description: secondaryFmt(
          'Entering a directory path, rename all files in subdirectories to parent; the multiple files will add a suffix by index.',
        ),
      },
      {
        name: 'Remove empty folders',
        value: Fns.Remove,
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

export function inquirerErr(error: Error) {
  if (error.message === ErrorMsg.UserCancel) {
    console.log(secondaryFmt('Press Enter to exit.'));
    return;
  }
  console.error(errorFmt('Oops! script crashed.'), error);
}
